var async = require('async') //控制并发
var cheerio = require('cheerio') //选择器
var superagent  = require('superagent') //请求发送
var charset = require('superagent-charset'); //编码转换


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

var urls = [];
var a = 255
var b = 255
var c = 255
var d = 255

//IP段遍历
for(var e = 0; e < a; e++) {
    for (var f = 0; f < b; f++) {
        for(var g = 0; g < c; g++) {
            for (var h = 0; h < d; h++) {
                urls.push('http://' + e + '.' + f +'.' + g + '.' + h + ':80');
                console.log('http://' + e + '.' + f +'.' + g + '.' + h + ':80')
            }
        }
    }
}

// //控制并发
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