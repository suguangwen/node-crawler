var async = require('async') //控制并发
var cheerio = require('cheerio') //选择器
var superagent  = require('superagent') //请求发送
var whois = require('whois') //域名检索
//node基本模块
var fs = require('fs');

//拼音数据
var domainData = []
//跑完之后得到的数据
var endData = []

//抓取新华字典里的所有拼音
superagent.get('http://xh.5156edu.com/pinyi.html')
.end(function (err, res) {  
    try {
        var $ = cheerio.load(res.text)
    } catch (e) {
        // console.log("sss:" + err)
        return
    }
    $('.fontbox').each(function (i, e) {
        domainData.push($(e).text().trim())
    })
    console.log(domainData.length)
    dataFun(domainData)
})

//检查并发
var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  // delay 的值在 2000 以内，是个随机的整数
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
  //  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, delay);
};

//开始获取
var dataFun =  function (data) {
    var urls = [];
    //域名遍历
    for(var i = 0; i < data.length; i++) {
        urls.push(data[i] + '.com');
    }
    //控制并发
    async.mapLimit(urls, 10, function (url, callback) {
        fetchUrl(url, callback);
        //请求发送
        whois.lookup(url, function(err, data) {
            if(err) return
            if (data.indexOf('No match for domain') == 0) {
                console.log('该域名还没有人认领哦：' + url)
                endData.push(url)
            }
            console.log('该域名已被注册：' + url)
        })
    }, function (err, result) {
        //存储爬取到的数据
        fs.writeFile('demo.txt', endData, (err)=> {
            if (err) {
                return console.error(err);
            }
            console.log("数据写入成功！");
            console.log("--------我是分割线-------------")
        });
    });
}