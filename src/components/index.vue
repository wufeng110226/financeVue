<template>
	<van-tabs class="top_vantabs" @click="handleTabClick" v-waterfall-lower="loadMore" waterfall-disabled="disabled">
		  	<van-tab class="_share" title="分享">
		<van-pull-refresh v-model="isLoading">
			  	<!--二级导航-->
		  		<van-row gutter="20">
				  	<van-col span="8">
				  		<router-link :to="{path:'/newKouzi'}" >
						  	<div class="_shareShild">
						  		<img src="../assets/share_newsicon.png">
						  		<br>
						  		<span>最新口子</span>
						  	</div>
					  	</router-link>
				  	</van-col>
				  	<van-col span="8">
					  	<div class="_shareShild">
					  		<img src="../assets/share_helpicon.png">
					  		<br>
					  		<span>帮助中心</span>
					  	</div>
				  	</van-col>
				  	<van-col span="8">
					  	<div class="_shareShild">
					  		<img src="../assets/share_fabuicon.png">
					  		<br>
					  		<span>发布口子</span>
					  	</div>
				  	</van-col>
				</van-row>
				<!--swipe广告位-->
				<van-swipe class="cutAdvert" :autoplay="0">
				  	<van-swipe-item v-for="(image, index) in share.bannerList" :key="index">
				    	<img :src="baseurl+image.imgurl" />
				  	</van-swipe-item>
				</van-swipe>
				<!--分享-二级导航-->
				<van-tabs class="childtabs" @click="childhandleTabClick">
				  	<van-tab title="最新发表">
					   	<ul class="kouzi">
						  	<li v-for="item in share.recentCutList" @click="toDetail(item)">
							  	<div class="kouziCard">
							  		<div class="avatar"><img :src="baseurl+item.avatar" /></div>
							  		<div class="content">
							  			<div class="content_name">{{item.name}}</div>
							  			<div class="content_desc">{{item.content}}</div>
							  			<div class="content_img"><img v-for="pic in item.pic" :src="pic" v-lazy="pic"></div>
							  		</div>
							  		<div class="footer">
							  			<div class="time">
							  				<span>{{item.createTime}}</span>
							  			</div>
							  			<div class="ctl">
							  				<span><i class="fa fa-thumbs-o-up"></i>{{item.likes}}</span>
		    								<span><i class="fa fa-commenting-o"></i>{{item.comments}}</span>
							  			</div>
							  		</div>
							  	</div>
					  		</li>
						</ul>
						<div class="loadingsBox" v-if="share.isReNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
						<div class="loadingsBox" v-else>没有更多的内容了</div>
				  	</van-tab>
				  	<van-tab title="首发口子">
					  	<ul class="kouzi">
						  	<li v-for="item in share.firstCutList" @click="toDetail(item)">
							  	<div class="kouziCard">
							  		<div class="avatar"><img :src="baseurl+item.avatar" /></div>
							  		<div class="content">
							  			<div class="content_name">{{item.name}}</div>
							  			<div class="content_desc">{{item.content}}</div>
							  			<div class="content_img"><img v-for="pic in item.pic" :src="pic" v-lazy="pic"></div>
							  		</div>
							  		<div class="footer">
							  			<div class="time">
							  				<span>{{item.createTime}}</span>
							  			</div>
							  			<div class="ctl">
							  				<span><i class="fa fa-thumbs-o-up"></i>{{item.likes}}</span>
		    								<span><i class="fa fa-commenting-o"></i>{{item.comments}}</span>
							  			</div>
							  		</div>
							  	</div>
					  		</li>
						</ul>
						<div class="loadingsBox" v-if="share.isFiNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
						<div class="loadingsBox" v-else>没有更多的内容了</div>
				  	</van-tab>
				</van-tabs>
				</van-pull-refresh>
			</van-tab>
			
			
			
		  	<van-tab class="_hotCut" title="热议">
		  		<van-pull-refresh v-model="isLoading">
		  		<!--swipe广告位-->
				<van-swipe class="cutAdvert" :autoplay="0">
				  	<van-swipe-item v-for="(image, index) in hotCutList.bannerList" :key="index">
				    	<img :src="baseurl+image.imgurl" />
				  	</van-swipe-item>
				</van-swipe>
				<ul class="kouzi">
				  	<li v-for="item in hotCutList.hotCutList" @click="toDetail(item)">
					  	<div class="kouziCard">
					  		<div class="avatar"><img :src="baseurl+item.avatar" /></div>
					  		<div class="content">
					  			<div class="content_name">{{item.name}}</div>
					  			<div class="content_desc">{{item.content}}</div>
					  			<div class="content_img"><img v-for="pic in item.pic" :src="pic" v-lazy="pic"></div>
					  		</div>
					  		<div class="footer">
					  			<div class="time">
					  				<span>{{item.createTime}}</span>
					  			</div>
					  			<div class="ctl">
					  				<span><i class="fa fa-thumbs-o-up"></i>{{item.likes}}</span>
									<span><i class="fa fa-commenting-o"></i>{{item.comments}}</span>
					  			</div>
					  		</div>
					  	</div>
			  		</li>
				</ul>
				<div class="loadingsBox" v-if="hotCutList.isNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
				<div class="loadingsBox" v-else>没有更多的内容了</div>
				</van-pull-refresh>
		  	</van-tab>
	</van-tabs>
</template>

<script>
import { Toast } from 'vant';
import router from '@/router'
import {httpUrl} from '@/api'
export default {
  	data () {
	    return {
	    	isLoading:false,       //下拉刷新
	    	disabled: false,       //分页
	      	maintype:'00',     	   //页面默认传入类型
	      	childMainType:'01',    //share下子tabs
	      	baseurl:'',		       //图片地址
	      	share:{                //maintype == 00
	      		bannerList:[],     //广告列表
	      		firstCutList:[],   //最新发表
	      		FCcurrentPage:1,   //firstCutList当前页
	      		recentCutList:[],  //首发口子
	      		RCcurrentPage:1,   //recentCutList当前页
	      		isReNext:0,        //最新发表是否下一页0：否，1：是
	      		isFiNext:0         //首发口子是否下一页0：否，1：是
	      	},
	      	hotCutList:{           //maintype == 11
	      		bannerList:[],     //广告列表
	      		hotCutList:[],     //热议
	      		isNext:0,          //是否下一页0：否，1：是
	      		HCcurrentPage:1    //hotCutList当前页
	      	}
	    }
  	},
  	watch:{
		isLoading(){
			if(this.isLoading){
				this.getInterflow();
			}
		}
	},
  	methods: {
	  	toDetail(e){  //访问详情
	  		this.$router.push(
	  			{
	  				name:'cutInfo',
	  				params:{
	  					id:e.id,
	  					userId:e.userId
	  				}
	  			}
	  		)
	  	},
	  	childhandleTabClick(index){  //share下子tabs切换
  			if(index == 0){
  				this.childMainType = '01'
  			}else{
  				this.childMainType = '02'
  			}
  		},
	  	handleTabClick(index) {  //顶部tabs切换
	  		if(index == 0){
	  			this.maintype = '00';
	  		}else{
	  			this.maintype = '11';
	  		}
	  		this.getInterflow();
	    },
	    getInterflow(){  //默认加载
	    	Toast.loading({
				duration: 0,       // 持续展示 toast
				forbidClick: true, // 禁用背景点击
			});
	    	let form = {
	    		type:this.maintype,
	    		page:1
	    	}
	    	this.$http.post(httpUrl.interflow,form)
	    		.then(
	    			response => {
	    				Toast.clear();
	    				this.isLoading = false;
	    				this.baseurl = response.body.baseurl;
	    				if(this.maintype == '00'){
	    					/*base64解码*/
	    					let share_recentCutList = response.body.share.recentCutList;
	    					let share_firstCutList = response.body.share.firstCutList;
	    					for(let i=0;i<share_recentCutList.length;i++){
	    						share_recentCutList[i].name = this.Base64.decode(share_recentCutList[i].name);
	    						share_recentCutList[i].content = this.Base64.decode(share_recentCutList[i].content);
	    						if(share_recentCutList[i].pic !== ''){
	    							share_recentCutList[i].pic = share_recentCutList[i].pic.split(',');
	    							for(let v=0;v<share_recentCutList[i].pic.length;v++){
	    								share_recentCutList[i].pic[v] = response.body.baseurl + share_recentCutList[i].pic[v];
	    							}
	    						}
	    					}
	    					for(let v=0;v<share_firstCutList.length;v++){
	    						share_firstCutList[v].name = this.Base64.decode(share_firstCutList[v].name);
	    						share_firstCutList[v].content = this.Base64.decode(share_firstCutList[v].content);
	    						if(share_firstCutList[v].pic !== ''){
	    							share_firstCutList[v].pic = share_firstCutList[v].pic.split(',');
	    							for(let c=0;c<share_firstCutList[v].pic.length;c++){
	    								share_firstCutList[v].pic[c] = response.body.baseurl + share_firstCutList[v].pic[c];
	    							}
	    						}
	    					}
	    					
	    					this.share.bannerList = response.body.bannerList;
	    					this.share.firstCutList = share_firstCutList;
	    					this.share.recentCutList = share_recentCutList;
	    					this.share.isReNext = response.body.share.isReNext;
	    					this.share.isFiNext = response.body.share.isFiNext;
	    					this.share.FCcurrentPage = 1;
	    					this.share.RCcurrentPage = 1;
	    				}else if(this.maintype == '11'){
	    					/*base64解码*/
	    					let hotCutList = response.body.hotCutList;
	    					for(let z=0;z<hotCutList.length;z++){
	    						hotCutList[z].name = this.Base64.decode(hotCutList[z].name);
	    						hotCutList[z].content = this.Base64.decode(hotCutList[z].content);
	    						if(hotCutList[z].pic !== ''){
	    							hotCutList[z].pic = hotCutList[z].pic.split(',')
	    							for(let x=0;x<hotCutList[z].pic.length;x++){
	    								hotCutList[z].pic[x] = response.body.baseurl + hotCutList[z].pic[x];
	    							}
	    						}
	    					}
	    					
	    					this.hotCutList.bannerList = response.body.bannerList;
	    					this.hotCutList.hotCutList = hotCutList;
	    					this.hotCutList.isNext = response.body.isNext;
	    					this.hotCutList.HCcurrentPage = 1;
	    				}
	    			},
	    			response => {
	    				Toast({
    						message:'链接服务器失败，请稍后再试！',
    						position:'bottom'
    					});
	    			}
	    		)
	    },
	    loadElse(){   //上滑加载更多
	    	if(this.maintype == '00'){  //share分享
	    		let form;
	    		if(this.childMainType == '01'){  //recentCutList最新发表
	    			if(this.share.isReNext == 1){
	    				form = {
		    				type:this.childMainType,
		    				page:this.share.FCcurrentPage + 1
		    			}
		    			this.$http.post(httpUrl.interflow,form)
			    			.then(
			    				response => {
			    					this.disabled = false;
			    					this.share.FCcurrentPage += 1;
			    					this.share.isReNext = response.body.share.isReNext;
			    					/*base64解码*/
			    					let recentCutList = response.body.share.recentCutList;
			    					for(let i=0;i<recentCutList.length;i++){
			    						recentCutList[i].name = this.Base64.decode(recentCutList[i].name);
			    						recentCutList[i].content = this.Base64.decode(recentCutList[i].content);
			    						if(recentCutList[i].pic !== ''){
			    							recentCutList[i].pic = recentCutList[i].pic.split(',')
			    							for(let x=0;x<recentCutList[i].pic.length;x++){
			    								recentCutList[i].pic[x] = response.body.baseurl + recentCutList[i].pic[x];
			    							}
			    						}
			    						this.share.recentCutList.push(recentCutList[i]);
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
	    		}else if(this.childMainType == '02'){  //firstCutList首发口子
	    			if(this.share.isFiNext == 1){
	    				form = {
		    				type:this.childMainType,
		    				page:this.share.RCcurrentPage + 1
		    			}
	    				this.$http.post(httpUrl.interflow,form)
	    					.then(
	    						response => {
	    							this.disabled = false;
	    							this.share.RCcurrentPage += 1;
	    							this.share.isFiNext = response.body.share.isFiNext;
	    							/*base64解码*/
	    							let firstCutList = response.body.share.firstCutList;
	    							for(let i=0;i<firstCutList.length;i++){
	    								firstCutList[i].name = this.Base64.decode(firstCutList[i].name);
	    								firstCutList[i].content = this.Base64.decode(firstCutList[i].content);
	    								if(firstCutList[i].pic !== ''){
	    									firstCutList[i].pic = firstCutList[i].pic.split(',');
	    									for(let x=0;x<firstCutList[i].pic.length;x++){
	    										firstCutList[i].pic[x] = response.body.baseurl + firstCutList[i].pic[x];
	    									}
	    								}
	    								this.share.firstCutList.push(firstCutList[i]);
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
	    	}else if(this.maintype == '11'){  //hotCutList热议
	    		let form
	    		if(this.hotCutList.isNext == 1){
	    			form = {
	    				type:this.maintype,
	    				page:this.hotCutList.HCcurrentPage
	    			}
	    			this.$http.post(httpUrl.interflow,form)
	    				.then(
	    					response => {
	    						this.disabled = false;
	    						this.hotCutList.HCcurrentPage += 1;
	    						this.hotCutList.isNext = response.body.isNext;
	    						let hotCutList = response.body.hotCutList;
	    						for(let i=0;i<hotCutList.length;i++){
	    							hotCutList[i].name = this.Base64.decode(hotCutList[i].name);
	    							hotCutList[i].content = this.Base64.decode(hotCutList[i].content);
	    							if(hotCutList[i].pic !== ''){
	    								hotCutList[i].pic = hotCutList[i].pic.split(',');
	    								for(let x=0;x<hotCutList[i].pic.length;x++){
	    									hotCutList[i].pic[x] = response.body.baseurl + hotCutList[i].pic[x]
	    								}
	    							}
	    							this.hotCutList.hotCutList.push(hotCutList[i]);
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
	    loadMore(loadtype) { //加载下一页
	    	if(this.disabled == false){
	    		this.disabled = true;
	      		this.loadElse();
	    	}
	    }
  	},
	mounted(){
  		this.getInterflow();
  	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--top-nav样式reset-->
<!--
	页面的样式如果不加scoped会影响到其他的页面 
	也就是说router跳转之后样式是不销毁的
	依照这个特性 可以在index页面里把全局的reset样式加上
-->
<style lang="scss">
	.cutAdvert {
		.van-swipe__indicators {
			display: none;
		}
	}
	.top_vantabs {
		.van-tabs__nav {
			/*width:50%;*/
			margin:0 auto;
			background: #41acff;
			z-index: 9999;
			.van-tab::after {
				border-width:0;
			}
		}
		.van-tab {
			color: #fff;
			background:rgba(0,0,0,0);
		}
		.van-tabs__nav-bar {
			background: #fff;
			bottom:2px;
		}
		.van-tab:nth-child(2) {
			margin-left:20%;
		}
		.van-tab:nth-child(3) {
			margin-right:20%;
		}
		/*分享tab*/
		.childtabs {
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
				/*padding:0 10px;*/
			}
		}
	}
</style>
<!--sass样式-->
<style lang="scss" scoped="scoped">
	.top_vantabs {
		._share {
			background: #ccc;
			._shareShild {
				margin:0 auto;
				text-align: center;
				img {
					width:50%;
				}
				span {
					width:100%;
					display:inline-block;
					text-align: center;
					font-size:14px;
					color:#2c3e50;
				}
			}
			.van-row {
				padding-top:20px;
				margin-left:0 !important;
				margin-right:0 !important;
				padding-bottom:10px;
				background: #fff;
			}
			.van-swipe {
				img {
					width: 100%;
					height:55px;
				}
			}
		}
		._hotCut {
			background: #ccc;
			.van-swipe {
				img {
					width: 100%;
					height:55px;
				}
			}
			.kouzi {
				background: #fff;
			}
		}
		.childtabs {
			background: #fff;
		}
		.loadingsBox {
			display: flex;
			align-items: center;
			justify-content: center;
			padding:10px 0;
			font-size:12px;
		}
	}
	.kouziCard {
		color: #333;
	    font-size: 16px;
	    position: relative;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    padding: 15px 15px 5px 70px;
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
			    -webkit-line-clamp: 2;
			    -webkit-box-orient: vertical;
	        line-height: 20px;
	    		word-break: break-all;
	    		font-size:14px;
	    		color: #3c3c3c;
	    	}
	    	.content_desc {
	    		color: #666;
			    font-size: 12px;
			    max-height: 20px;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    display: -webkit-box;
			    -webkit-line-clamp: 1;
			    -webkit-box-orient: vertical;
	        	line-height: 20px;
				word-break: break-all;
				font-size:12px;
				color: #656565;
				margin-bottom:5px;
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