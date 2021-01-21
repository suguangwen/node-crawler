var fs = require('fs');
var path = require('path');
var filePath = path.resolve('./dist');
let p = process.argv.splice(2)
let str = p[0]
let str1 = p[1] || 5
let str2 = p[2] || 20
let arr = []
let arrTwo = []
function searchTxt (str, content) {
    let con = content
    let inx = 0
    for (let index = 0; index < 10; index++) {
        inx = con.indexOf(str)
        if (inx == '-1') {
            break
        } else {
            if (con.slice(inx) != '' && con.slice(inx - str1,inx + str2)) arrTwo.push(con.slice(inx - str1,inx + str2))
            con = con.slice(inx + str.length,con.length)
        }
        
    }
}

fileDisplay(filePath)
//文件遍历方法
function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
　　　　　　　　　　　　　　　　　// 读取文件内容
                            var content = fs.readFileSync(filedir, 'utf-8');
                            searchTxt(str, content.replace(/\s*/g,""))
                            if (arrTwo.length > 0) {
                                arrTwo.map( item => {
                                    arr.push({
                                        title:filedir,
                                    con: item})
                                })
                                arrTwo = []
                            }
                            if (arr.length > 0) {
                                fs.writeFile('./答案.json', JSON.stringify(arr), (err)=> {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    console.log("数据写入成功！");
                                    console.log("--------我是分割线-------------")
                                });
                            }
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}