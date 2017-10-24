var async = require('async') //控制并发
var cheerio = require('cheerio') //选择器
var superagent  = require('superagent') //请求发送
var charset = require('superagent-charset'); //编码转换
var mysql  = require('mysql'); //MYSQL数据库
//node基础库
var urls = require('url')
var fs = require('fs');
 
//链接数据库
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '123456',
//     database : 'test'
// });
 
// connection.connect();
var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  // delay 的值在 2000 以内，是个随机的整数
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
//   console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, delay);
};

var urls = [];
var a = 151
var b = 255
//IP段遍历
for(var i = 150; i < a; i++) {
    for (var j = 0; j < b; j++) {
        urls.push('http://121.8.' + i + '.' + j + ':81');
    }
}
console.log(urls)
//控制并发
async.mapLimit(urls, 5, function (url, callback) {
    fetchUrl(url, callback);
    //请求发送
    superagent.get(url)
    .end(function (err, res) {  
        try {
            var $ = cheerio.load(res.text)
            console.log(url)
        } catch (e) {
            // console.log("sss:" + err)
            return
        }
        // console.log(url)
    })
}, function (err, result) {
    // console.log('final:');
    console.log(result);
});