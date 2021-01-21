//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var async = require('async'); //控制并发
const { equal } = require('assert');
var mkdirp = require('mkdirp')
//目标网址
// var url = 'http://www.biquge.se/' + i +'/';
//跑完之后得到的数据
var endData = []
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
(function () {
    var urls = [];
    //域名遍历
    for(var i = 57378; i < 57381; i++) {
        urls.push('http://www.biquge.se/' + i + '/');
    }
    //控制并发
    async.mapLimit(urls, 10, function (url, callback) {
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                $('#info').find('h1').text()
                request(url, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        // endData.push({
                        //     title: $('#info').find('h1').text(),
                        //     intro: $('#intro').text(),
                        //     href: $('#info a').eq(2).attr('href'),
                        //     chapter: $('#list dd').length
                        // })
                        let dd = []
                        $('#list dd').each(function() {
                            dd.push($(this).find('a').attr('href'))
                        });
                        let infoTitle = $('#info').find('h1').text()
                        //创建目录
                        mkdirp('./dist/' +infoTitle, function(err) {
                            if(err){
                                console.log(err);
                            }
                        });
                        for (let index = 0; index < dd.length; index++) {
                            request('http://www.biquge.se' + dd[index], function(error, response, body) {
                                if(!error && response.statusCode == 200) {
                                    var $ = cheerio.load(body);
                                    fs.writeFile('./dist/' + infoTitle + '/' + $('.bookname h1').text() + '.txt', $('#content').text(), (err)=> {
                                        if (err) {
                                            return console.error(err);
                                        }
                                        console.log("数据写入成功！");
                                        console.log("--------我是分割线-------------")
                                    });
                                }
                            });
                        }
                    }
                });
                fetchUrl(url, callback);
            }
        });
        //请求发送
    }, function (err, result) {
        console.log('OK')
        //存储爬取到的数据
        // fs.writeFile('demo.txt', endData, (err)=> {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log("数据写入成功！");
        //     console.log("--------我是分割线-------------")
        // });
    });
})()