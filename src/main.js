// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
//加载根组件和ui库
import Vant from 'vant';
import App from './App'
import router from './router'
import 'vant/lib/vant-css/index.css';
import 'font-awesome/css/font-awesome.min.css'



//单独加载不能直接使用的ui组件库
import { Lazyload } from 'vant';
import { Waterfall } from 'vant';
import { PullRefresh } from 'vant';

//window.share = jsbridge;
//使用ui组件
Vue.use(Lazyload);
Vue.use(Waterfall);
Vue.use(PullRefresh);

Vue.config.productionTip = false

Vue.use(Vant);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false

Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {
  'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
};

Vue.prototype.Base64 = require('js-base64').Base64;

//设置Cookie,增加到Vue实例方便全局调用
Vue.prototype.setCookie = (c_name, value, expireTimes) => {
	let exdate = new Date();
	exdate.setTime(exdate.getDate() + expireTimes);
	document.cookie = c_name + "=" + escape(value) + ((expireTimes = null) ? "" : ";expores=" + exdate.toGMTString());
}
//获取cookie
Vue.prototype.getCookie = (name) => {
	let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

//删除cookie
Vue.prototype.delCookie =(name) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/* eslint-disable no-new */
//实例化Vue
const app = new Vue({
	data:{},
	render:h => h(App),
	router,
	created(){
		this.hasUserid();
	},
	methods:{
		hasUserid(){
			let query = this.$route.query;
			if(JSON.stringify(query) == "{}"){
				console.log("没有登录")
			}else{
				this.setCookie('userid',query.userid);
			}
		}
	}
}).$mount('#app')