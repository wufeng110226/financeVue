<template>
	<div class="newkouzi" v-waterfall-lower="loadMore" waterfall-disabled="disabled">
		<cutnavbars :title="name"></cutnavbars>
		<van-pull-refresh v-model="isLoading">
			<van-tabs class="childtabs" @click="handleTabClick">
				<!--swipe广告位-->
				<van-swipe class="cutAdvert" :autoplay="0">
				  	<van-swipe-item v-for="(image, index) in bannerList" :key="index">
				    	<img :src="baseurl+image.imgurl" />
				  	</van-swipe-item>
				</van-swipe>
			  	<van-tab title="最新发表">
				   	<ul class="kouzi">
					  	<li v-for="item in recentUpList" @click="toDetail(item)">
						  	<div class="kouziCard">
						  		<div class="content">
						  			<div class="content_name">{{item.title}}</div>
						  			<div class="content_desc">{{item.content}}</div>
						  			<div class="content_img"><img v-for="pic in item.pic" :src="pic" v-lazy="pic"></div>
						  		</div>
						  		<div class="footer">
						  			<div class="time">
						  				<span>{{item.createTime}}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span>{{item.name}}</span>
						  			</div>
						  			<div class="ctl">
	    								<span>{{item.comments}}阅读</span>
						  			</div>
						  		</div>
						  	</div>
				  		</li>
					</ul>
					<div class="loadingsBox" v-if="recentisNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
					<div class="loadingsBox" v-else>没有更多的内容了</div>
			  	</van-tab>
			  	<van-tab title="首发口子">
				  	<ul class="kouzi">
					  	<li v-for="item in allCutList" @click="toDetail(item)">
						  	<div class="kouziCard">
						  		<div class="content">
						  			<div class="content_name">{{item.title}}</div>
						  			<div class="content_desc">{{item.content}}</div>
						  			<div class="content_img"><img v-for="pic in item.pic" :src="pic" v-lazy="pic"></div>
						  		</div>
						  		<div class="footer">
						  			<div class="time">
						  				<span>{{item.createTime}}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span>{{item.names}}</span>
						  			</div>
						  			<div class="ctl">
						  				<span>{{item.comments}}阅读</span>
						  			</div>
						  		</div>
						  	</div>
				  		</li>
					</ul>
					<div class="loadingsBox" v-if="allCutisNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
					<div class="loadingsBox" v-else>没有更多的内容了</div>
			  	</van-tab>
			</van-tabs>
			<div @click="test">按钮</div>
			<div @click="test2">按钮2</div>
		</van-pull-refresh>
	</div>
</template>

<script>
import router from '@/router'
import cutnavbars from '@/components/public/cutnavbar'
import { Toast } from 'vant';
import {httpUrl} from '@/api'
export default {
	components:{
		cutnavbars
	},
	data(){
		return {
			name:'最新口子',
			maintype:1,
			baseurl:'',
			bannerList:[],
			recentUpList:[],
			recentisNext:0,
			recentpage:1,
			allCutList:[],
			allCutisNext:0,
			allCutpage:1,
			isLoading:false,       //下拉刷新
			disabled:false,        //分页
		}
	},
	watch:{
		isLoading(){
			if(this.isLoading){
				this.newCut();
			}
		}
	},
	methods: {
		/*test2(){
			console.log("2");
			clearInterval(window.timer);
		},
		test(){
			console.log("1");
			let _this = this;
			let timer = setInterval(function(){
				console.log(_this);
				if(_this._isDestroyed){
					console.log("路由已经被销毁");
					clearInterval(timer);
				}
			},5000)
			window.timer = setInterval(function(){
				console.log("1");
			},3000);
		},*/
		handleTabClick(index){
			if(index == 0){
				this.maintype = 1
			}else{
				this.maintype = 2
			}
		},
		newCut(){
			Toast.loading({
				duration: 0,       // 持续展示 toast
				forbidClick: true, // 禁用背景点击
			});
			let form = {
	    		type:0
	    	}
	    	this.$http.post(httpUrl.newCut,form)
	    		.then(
	    			response => {
	    				this.isLoading = false;
	    				Toast.clear();
	    				/*base64解码*/
	    				let recentUpList = response.body.recentUpList;
	    				let allCutList = response.body.allCutList;
	    				for(let i=0;i<recentUpList.length;i++){
	    					recentUpList[i].title = this.Base64.decode(recentUpList[i].title);
	    					recentUpList[i].content = this.Base64.decode(recentUpList[i].content);
	    					recentUpList[i].name = this.Base64.decode(recentUpList[i].name);
	    					if(recentUpList[i].pic !== ''){
    							recentUpList[i].pic = recentUpList[i].pic.split(',');
    							for(let a=0;a<recentUpList[i].pic.length;a++){
    								recentUpList[i].pic[a] = response.body.baseurl + recentUpList[i].pic[a];
    							}
    						}
	    				}
	    				for(let v=0;v<allCutList.length;v++){
	    					allCutList[v].title = this.Base64.decode(allCutList[v].title);
	    					allCutList[v].content = this.Base64.decode(allCutList[v].content);
	    					allCutList[v].name = this.Base64.decode(allCutList[v].name);
	    					if(allCutList[v].pic !== ''){
    							allCutList[v].pic = allCutList[v].pic.split(',');
    							for(let b=0;b<allCutList[v].pic.length;b++){
    								allCutList[v].pic[b] = response.body.baseurl + allCutList[v].pic[b];
    							}
    						}
	    				}
	    				
	    				this.recentUpList = recentUpList;
	    				this.allCutList = allCutList;
	    				
	    				this.baseurl = response.body.baseurl;
	    				this.recentisNext = response.body.isNext;
	    				this.allCutisNext = response.body.isNext;
	    				this.bannerList = response.body.bannerList;
	    			},
	    			response => {
	    				this.isLoading = false;
	    				Toast({
    						message:'链接服务器失败，请稍后再试！',
    						position:'bottom'
    					});
	    			}
	    		)
		},
		loadElse(){
			if(this.maintype == 1){
				let form
				if(this.recentisNext == 1){
					form = {
						type:this.maintype,
						page:this.recentpage + 1
					}
					this.$http.post(httpUrl.newCut,form)
						.then(
							response => {
								this.disabled = false;
								this.recentpage += 1;
								this.recentisNext = response.body.isNext;
								let recentUpList = response.body.recentUpList;
								for(let i=0;i<recentUpList.length;i++){
									recentUpList[i].name = this.Base64.decode(recentUpList[i].name);
									recentUpList[i].title = this.Base64.decode(recentUpList[i].title);
									recentUpList[i].content = this.Base64.decode(recentUpList[i].content);
									if(recentUpList[i].pic !== ''){
										recentUpList[i].pic = recentUpList[i].pic.split(',');
										for(let x=0;x<recentUpList[i].pic.length;x++){
											recentUpList[i].pic[x] = response.body.baseurl + recentUpList[i].pic[x];
										}
									}
									this.recentUpList.push(recentUpList[i]);
								}
							},
							response => {
								Toast({
	    							message:'链接服务器失败，请稍后再试！',
		    						position:'bottom'
		    					});
							}
						)
				}else{
					this.disabled = true;
				}
			}else if(this.maintype == 2){
				let form;
				if(this.allCutisNext == 1){
					form = {
						type:this.maintype,
						page:this.allCutpage + 1
					}
					this.$http.post(httpUrl.newCut,form)
						.then(
							response => {
								this.disabled = false;
								this.allCutpage += 1;
								this.allCutisNext = response.body.isNext;
								let allCutList = response.body.allCutList;
								for(let i=0;i<allCutList.length;i++){
									allCutList[i].name = this.Base64.decode(allCutList[i].name);
									allCutList[i].title = this.Base64.decode(allCutList[i].title);
									allCutList[i].content = this.Base64.decode(allCutList[i].content);
									if(allCutList[i].pic !== ''){
										allCutList[i].pic = allCutList[i].pic.split(',');
										for(let x=0;x<allCutList[i].pic.length;x++){
											allCutList[i].pic[x] = response.body.baseurl + allCutList[i].pic[x];
										}
									}
									this.allCutList.push(allCutList[i]);
								}
							},
							response => {
								Toast({
	    							message:'链接服务器失败，请稍后再试！',
		    						position:'bottom'
		    					});
							}
						)
				}else{
					this.disabled = true;
				}
			}
		},
		loadMore(){
	    	if(this.disabled == false){
	    		this.disabled = true;
	      		this.loadElse();
	    	}
		},
		toDetail(e){
	  		this.$router.push(
	  			{
	  				name:'cutInfo',
	  				params:{
	  					id:e.id,
	  					userId:e.userId
	  				}
	  			}
	  		)
	  	}
	},
	mounted(){
		this.newCut();
	}
}
</script>

<!--UI样式需要使用普通css-->
<style lang="scss">
	/*tab标签*/
	.cutAdvert {
		.van-swipe__indicators {
			display: none;
		}	
	}
	.newkouzi {
		.van-tabs__nav {
			background: #fff;
			width: 50%;
		    margin: 0;
		    padding-left:10px;
		    padding-right: calc(50% - 10px);
		    border-bottom: 1px solid #e8e8e8;
		}
		.van-tab {
			color: #3c3c3c;
		}
		.van-tab:nth-child(2) {
			margin-left: 0;
		}
		.van-tab:nth-child(3) {
			margin-right: 0;
		}
		.van-tabs__nav-bar {
			background-color: #f13e3a;
			bottom: 0px;
		}
		.van-tabs__content {
			padding:0 10px;
		}
		.van-swipe {
			img {
				width: 100%;
				height:55px;
			}
		}
		.loadingsBox {
			display: flex;
			align-items: center;
			justify-content: center;
			padding:10px 0;
			font-size:12px;
		}
	}
</style>
<style lang="scss" scoped>
	.childtabs {
		margin-top:45px;
	}
	.kouziCard {
		color: #333;
	    font-size: 16px;
	    position: relative;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    padding: 15px 15px 5px 15px;
	    border-bottom:1px solid #e8e8e8;
	    .avatar {
	    	top: 15px;
		    left: 15px;
		    width: 40px;
		    height: 40px;
		    position: absolute;
		    img {
		    	width:100%;
		    	border-radius:100%;
		    }
	    }
	    .content {
	    	width: 100%;
	    	.content_name {
			    max-height: 40px;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    display: -webkit-box;
			    -webkit-line-clamp: 1;
			    -webkit-box-orient: vertical;
	        	line-height: 20px;
	    		word-break: break-all;
	    		font-size:14px;
	    		color: #3c3c3c;
	    	}
	    	.content_desc {
			    overflow: hidden;
			    text-overflow: ellipsis;
			    display: -webkit-box;
			    -webkit-line-clamp: 3;
			    -webkit-box-orient: vertical;
	        	line-height: 20px;
				word-break: break-all;
				font-size:14px;
				color: #656565;
				margin-top:10px;
				margin-bottom:10px;
	    	}
	    	.content_img {
	    		img {
	    			width:45%;
	    			margin-right:10px;
	    		}
	    	}
	    }
	    .footer {
	    	height:35px;
	    	line-height: 35px;
	    	div {
	    		position: absolute;
	    	}
	    	.time {
	    		font-size:12px;
	    		color: #b9b9b9;
	    	}
	    	.ctl {
	    		right:15px;
	    		span:first-child {
	    			margin-right:5px;
	    		}
	    		span {
	    			color: #bdbdbd;
	    			font-size:14px;
	    			i {
	    				margin:0 3px;
	    			}
	    		}
	    	}
	    }
	}
</style>