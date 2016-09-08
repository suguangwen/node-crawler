//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');

//目标网址
var oUrl = 'http://www.3lian.com/gif/more/04/';

//本地存储目录
var dir = './dome_02_images';

//未抓取列表
var aNewUrlQueue = [];

//需要抓取的类别列表
var aGotUrlQueue = [];

//类别的总页码数
var aNewLen = [];

//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});


(function () {
    //发送请求
    if (aNewUrlQueue.length === 0 && aGotUrlQueue.length === 0) {
        aNewUrlQueue.push(oUrl)
    }
    request(oUrl, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            for (var i = 0; i < aNewUrlQueue.length; i++) {
                var sUrl = aNewUrlQueue[i];
                var n = 0;
                request(sUrl, function(error, res, body) {
                    var $ = cheerio.load(body);
                    var lEn = $('.page select').find('option').length
                    aNewLen.push(lEn)
                    for (var j = 0; j < aNewLen[n]; j++) {
                        var zUrl = "http://www.3lian.com" + res.req.path + "index_" + j +".html"
                        request(zUrl, function(error, re, body) {
                            if(!error && response.statusCode == 200) {
                                var $ = cheerio.load(body);
                                $('.img img').each(function() {
                                    var src = $(this).attr('src');
                                    var sRc = src.split("/");
                                    sRc.splice(sRc.length - 1, 0, "d");
                                    console.log('正在下载' + sRc.join("/"));
                                    var patt=new RegExp("http");
                                    if (patt.test(sRc.join("/"))) {
                                        download(sRc.join("/"), dir, Math.floor(Math.random()*10000000) + src.substr(-4,4));
                                        console.log('下载完成');
                                    }
                                });
                            }
                            console.log(response.statusCode)
                        });
                    };
                    n++
                });
            };
        }
        console.log(response.statusCode)
    });
})()
//下载方法
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};