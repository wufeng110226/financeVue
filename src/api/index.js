let localhostDev = true;
//如果是本地开发，就把localhostDev 设置成true，连接就是拼成‘http://www.xxx.com/api’
//生产环境，就把localhostDev 设置成false，连接就是拼成‘http://xxx.com/api/test’
let _host = localhostDev ? 'http://192.168.188.49:8082/gateway' : 'http://47.93.247.70:8882/gateway'
let httpUrl = {
	'interflow': _host + '/interflow',//首页
	'newCut': _host + '/newCut',    //最新口子
	'userInfo': _host + '/userInfo',//用户信息
	'cutInfo': _host + '/cutInfo',  //获取帖子信息
	'likeCut': _host + '/likeCut',  //点赞
	'setComment': _host + '/setComment' //发送评论
};
export {httpUrl}
