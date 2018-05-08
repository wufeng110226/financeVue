<template>
	<div class="cutInfo" v-waterfall-lower="loadMore" waterfall-disabled="disabled">
		<cutnavbars :title="name" @shareTo="shareTo"></cutnavbars>
		<van-pull-refresh v-model="isLoading">
			<div class="_shild">
				<!--主人-->
				<div class="cutContent">
					<div class="kouziCard">
				  		<div class="avatar" @click="userPage(posts)"><img :src="baseurl+posts.avatar" /></div>
				  		<div class="content">
				  			<div class="content_name">{{posts.name}}</div>
				  			<div class="content_time">{{posts.createTime}}</div>
				  			<div class="content_desc">{{posts.content}}</div>
				  			<div class="content_img"><img @click="showImagePreview(posts.pic)" v-for="pic in posts.pic" :src="pic"></div>
				  		</div>
				  	</div>
				  	<!--swipe广告位-->
					<van-swipe class="cutAdvert" :autoplay="0">
					  	<van-swipe-item v-for="(image, index) in bannerList" :key="index">
					    	<img :src="baseurl+image.imgurl" />
					  	</van-swipe-item>
					</van-swipe>
					<!--点赞-->
					<div class="footer">
			  			<div class="ctl">
			  				<span><i class="fa fa-thumbs-o-up"></i>{{posts.likes}}</span>
			  			</div>
			  			<div class="likeList">
			  				<span v-for="(item, index) in likeList" :key="item">{{item}},</span>
			  			</div>
			  		</div>
			  		<!--操作-->
			  		<div class="curCtl" :class="{'active':cutStatus == 'cutOwer'}">
			  			<a class="LorR" @click="activeCurCtl('cutOwer')"><img src="../assets/LorR.png" /></a>
			  			<div class="curCtlBox" >
			  				<a class="curCtl_boxs" @click="jb(posts)">
				  				<van-icon name="question" />
				  				<span>举报</span>
				  			</a>
			  			</div>
			  		</div>
			  		
			  		
			  		
				</div>
				<!--评论列表-->
				<div class="cutComment">
					<ul>
						<li v-for="(item, index) in commentList">
							<div class="kouziCard">
						  		<div class="avatar"><img :src="baseurl+item.avatar" /></div>
						  		<div class="content">
						  			<div>
						  				<div class="content_name floatLeft">{{item.name}}</div>
						  				<div class="louceng">{{index+2}}楼</div>
						  			</div>
						  			<div class="content_time">{{item.createTime}}</div>
						  			<div class="content_desc">{{item.content}}</div>
						  			<div class="content_owerback">
						  				<ul>
						  					<li v-for="(item, value) in item.sonCommentList" :key="value">
						  						<i class="icon"></i>
						  						<p><span>{{item.userName}}</span>回复<span>{{item.toUserName}}</span>：{{item.content}}</p>
						  						<p>{{item.createTime}}</p>
						  					</li>
						  				</ul>
						  			</div>
						  		</div>
						  	</div>
						  	<div class="curCtl" :class="{'active':cutStatus == item.id}">
					  			<a class="LorR" @click="activeCurCtl(item.id)"><img src="../assets/LorR.png" /></a>
					  			<div class="curCtlBox" >
					  				<a class="curCtl_boxs" @click="jb(item)">
						  				<van-icon name="question" />
						  				<span>举报</span>
						  			</a>
						  			<a class="curCtl_boxs" @click="hf(item)">
						  				<van-icon name="chat" />
						  				<span>回复</span>
						  			</a>
					  			</div>
					  		</div>
						</li>
					</ul>
					<div class="loadingsBox" v-if="isNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
					<div class="loadingsBox" v-else>没有更多的内容了</div>
				</div>
			</div>
		</van-pull-refresh>
		
		<!--评论输入-->
		<div class="enter">
			<van-cell-group class="enterInput">
				<div class="van-cell van-hairline van-field van-field--nolabel van-field--has-icon">
				  	<div class="van-cell__value van-cell__value--alone">
				  		<input type="text" :placeholder="defaultPlaceholder" class="van-field__control" v-model="enterValue" ref="enterInput">
				  		<!--@blur="focusState = false" v-focus="focusState" 点击回复input获取焦点 已经废弃-->
				  		<div class="van-field__icon" style="display: none;">
				  			<i class="van-icon van-icon-edit-data"></i>
				  		</div>
				  	</div>
				</div>
			</van-cell-group>
			<div class="enterCtl">
				<span>
					<a class="cutSend" @click="cutSend"></a>
				</span>
				<span>
					<a :class="cutLikes" @click="cutSendlikes"></a>
				</span>
			</div>
		</div>
		<!--<van-popup class="jubaochenggong" v-model="jubaochenggong" position="top" :overlay="false">举报成功，感谢您的支持！</van-popup>-->
		
		<van-popup class="shareContainer" v-model="shareContainer" position="bottom" :overlay="true">
		  	<div class="shareIcon">
		  		<ul class="shareIcon_icon">
		  			<li @click="Selfshare('weixin')">
		  				<p class="bgweixin"><img src="../assets/weixinIcon.png" /></p>
		  				<p>微信</p>
		  			</li>
		  			<li @click="Selfshare('weixintimeline')">
		  				<p class="bgweixintimeline"><img src="../assets/pyqicon.png" /></p>
		  				<p>朋友圈</p>
		  			</li>
		  			<!--<li>
		  				<p><img src="../assets/weixinIcon.png" /></p>
		  				<p>微信</p>
		  			</li>
		  			<li>
		  				<p><img src="../assets/pyqicon.png" /></p>
		  				<p>朋友圈</p>
		  			</li>
		  			<li>
		  				<p><img src="../assets/qqicon.png" /></p>
		  				<p>QQ</p>
		  			</li>
		  			<li>
		  				<p><img src="../assets/qqzongicon.png" /></p>
		  				<p>QQ空间</p>
		  			</li>-->
		  		</ul>
		  	</div>
		  	<div class="cancel" @click="shareContainer = false">取消</div>
		</van-popup>
	</div>
</template>

<script>
	import router from '@/router'
	import cutnavbars from '@/components/public/cutnavbar'
	import { ImagePreview } from 'vant'
	import { Toast } from 'vant';
	import soshm from 'soshm';
	import {httpUrl} from '@/api'
	export default {
		components:{
			cutnavbars
		},
		data(){
			return {
				name:'口子交流',
				isLoading:false,       //下拉刷新
				disabled:false,
				enterValue:'',
				defaultPlaceholder:'给楼主回个评论', 
				//focusState:false,	   //input获取焦点的状态 点击回复input获取焦点 已经废弃
				commentId:'',		   //对评论进行评论
				cutStatus:'',  		   //举报回复被激活
				//jubaochenggong:false,//举报弹出层
				isLoading:false,       //下拉刷新
				cutLikes:'cutdisLikes',
				shareContainer:false,  //分享弹出层
				baseurl:'',            //图片地址
				bannerList:[],         //广告图片列表
				isLike:'',             //点赞
				posts:{},              //楼主信息
				commentList:[],        //评论列表
				likeList:[],           //评论人名列表
				isNext:0,
				page:1
			}
		},
		watch:{
			isLoading() {
		      if(this.isLoading){
		        this.getCutInfo();
		      }
		    }
		},
		/*directives:{  点击回复input获取焦点 已经废弃
			focus:{
				update:function(el, {value}){
					if(value){
						//el.focus();
						console.log(el);
						el.click();
					}
				}
			}
		},*/
		methods: {
			Selfshare(type){
				let data = {
					url:window.location.href,
					content:this.posts.content + '|易贷超人',
					describe:"易贷超人易贷超人易贷超人易贷超人"
				}
				data = JSON.stringify(data);
				if(type == 'weixin'){
					try{
						window.share.weixin(data);
					}catch(err){
						console.log("分享到微信");
					}
				}else if(type == 'weixintimeline'){
					try{
						window.share.weixintimeline(data);
					}catch(err){
						console.log("分享到朋友圈");
					}
				}
			},
			hf(item){
				this.defaultPlaceholder = '回复给'+item.name+'：';
				this.commentId = item.id.toString();
				let el = this.$refs.enterInput;
				el.focus();
				//this.focusState = true; 点击回复input获取焦点 已经废弃
			},
			activeCurCtl(par){
				this.resetComment();
				if(this.cutStatus == par){
					this.cutStatus = '';
				}else{
					this.cutStatus = par;
				}
			},
			jb(item){
				this.cutStatus = '';
				/*let timer = null;
				let _this = this
				if(this.jubaochenggong === true){
					clearTimeout(timer);
					this.jubaochenggong = false;
				}else{
					this.jubaochenggong = true;
					timer = setTimeout(function(){
						_this.jubaochenggong = false;
					},3000)
				}*/
				let _getParams = this.$route.params;
				this.$router.push(
					{
						name:'report',
						params:{
							id:_getParams.id,
							userId:_getParams.userId	
						}
					}
				)
			},
			shareTo(){
				this.shareContainer = true;
				soshm('.shareIcon_icon',{
					sites:['qq','qzone']
				});
			},
			showImagePreview(arr){
		  		ImagePreview(arr);
		  	},
			userPage(e){
				this.$router.push({
					name:'userPage',
					params:{
						id:e.userId
					}
				})
			},
			cutSend(){
				let getMyuserid = this.getCookie('userid');
				if(getMyuserid){
					let _getParams = this.$route.params;
					if(this.enterValue !== ''){
						let form;
						if(this.commentId == ''){
							form = {
								postId:_getParams.id,
								comment:this.enterValue,
								userId:getMyuserid
							}
						}else{
							form = {
								postId:_getParams.id,
								commentId:this.commentId,
								comment:this.enterValue,
								userId:getMyuserid
							}
						}
						this.$http.post(httpUrl.setComment,form)
							.then(
				    			response => {
				    				if(response.body.status == '100'){
				    					this.resetComment();
				    					let timer = null;
				    					let _this = this;
				    					this.enterValue = '';
				    					Toast({
				    						message:'评论成功！',
				    						position:'bottom'
				    					});
				    					timer = setTimeout(function(){
				    						_this.getCutInfo();
				    					},3000)
				    				}else{
				    					Toast({
				    						message:'评论失败，请重试！',
				    						position:'bottom'
				    					});
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
						Toast('请不要发送空信息！');
					}	
				}else{
					Toast({
						message:'您还没有登录！',
						position:'bottom'
					});
				}
			},
			getCutInfo(){
				Toast.loading({
					duration: 0,       // 持续展示 toast
					forbidClick: true, // 禁用背景点击
				});
				let _getParams = this.$route.params;
				this.$http.post(httpUrl.cutInfo,_getParams)
					.then(
		    			response => {
		    				this.isLoading = false;
		    				this.isNext = response.body.isNext;
		    				/*base64解码*/
		    				let likeList = response.body.likeList;  //评论人列表
		    				let commentList = response.body.commentList;
		    				let posts = response.body.posts;
		    				for(let i=0;i<commentList.length;i++){
		    					commentList[i].name = this.Base64.decode(commentList[i].name);
		    					commentList[i].content = this.Base64.decode(commentList[i].content);
		    					if(commentList[i].sonCommentList.length > 0){
		    						let scl = commentList[i].sonCommentList
		    						for(let v=0;v<scl.length;v++){
		    							scl[v].content = this.Base64.decode(scl[v].content);
		    						}
		    					}
		    				}
		    				posts.name = this.Base64.decode(posts.name);
		    				posts.content = this.Base64.decode(posts.content);
		    				if(posts.pic !== ''){
		    					posts.pic = posts.pic.split(',');
		    					for(let i=0;i<posts.pic.length;i++){
		    						posts.pic[i] = response.body.baseurl + posts.pic[i];
		    					}
		    				}
		    				for(let i=0;i<likeList.length;i++){
		    					likeList[i] = this.Base64.decode(likeList[i]);
		    				}
		    				Toast.clear();
		    				this.bannerList = response.body.bannerList;
		    				this.baseurl = response.body.baseurl;
		    				this.isLike = response.body.isLike;
		    				if(response.body.isLike == 1){
		    					this.cutLikes = 'cutdisLikes';
		    				}else{
		    					this.cutLikes = 'cutLikes';
		    				}
		    				this.likeList = likeList;
		    				this.posts = posts;
		    				this.commentList = commentList;
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
			cutSendlikes(){
				let __getParams = this.$route.params;
				this.$http.post(httpUrl.likeCut,__getParams)
					.then(
		    			response => {
		    				if(response.body.status == '100'){
		    					if(this.isLike == '0'){
		    						this.isLike = '1';
		    						this.cutLikes = 'cutdisLikes'
		    					}else{
		    						this.isLike = '0';
		    						this.cutLikes = 'cutLikes'
		    					}
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
			resetComment(){
				this.commentId = '';
				this.defaultPlaceholder = '给楼主回个评论';
			},
			loadElse(){
				let form;
				if(this.isNext == 1){
					let _getParams = this.$route.params;
					form = {
						id:_getParams.id,
						userId:_getParams.userId,
						page:this.page + 1
					}
					this.$http.post(httpUrl.cutInfo,form)
						.then(
							response => {
								this.page += 1;
								this.isNext = response.body.isNext;
								let commentList = response.body.commentList;
								for(let i=0;i<commentList.length;i++){
									commentList[i].name = this.Base64.decode(commentList[i].name);
									commentList[i].content = this.Base64.decode(commentList[i].content);
									if(commentList[i].sonCommentList.length > 0){
			    						let scl = commentList[i].sonCommentList
			    						for(let v=0;v<scl.length;v++){
			    							scl[v].content = this.Base64.decode(scl[v].content);
			    						}
			    					}
									this.commentList.push(commentList[i]);
								}
								
								if(response.body.isNext == 0){
									this.disabled = true;
								}else{
									this.disabled = false;
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
			},
			loadMore(){
		    	if(this.disabled == false){
		    		this.disabled = true;
		      		this.loadElse();
		    	}
			}
		},
		mounted(){
			this.getCutInfo()
		}
	}
</script>
<!--UI样式需要使用普通css-->
<style lang="scss">
	.cutAdvert {
		.van-swipe__indicators {
			display: none;
		}	
	}
	.cutInfo {
		.enter {
			.van-cell {
				background: #f8f8f8;
				border:1px solid #d4d4d5;
				border-radius:10px;
				padding:5px 10px 5px 30px;
			}
			.van-field__icon {
				display: block !important;
				left:0;
				right: auto;
			}
			.van-cell-group {
				background: #fff;
				padding-left:0;
			}
			.van-field__control {
				background: #f8f8f8;
				color: #c7c7c7;
			}
			.van-hairline--top-bottom::after {
				border: 0;
			}
		}
	}
	.jubaochenggong {
		background: rgba(0,0,0,0.5);
		padding:10px 0;
		text-align: center;
		font-size:14px;
		color: #fff;
		top:45px;
	}
	.shareContainer {
		.shareIcon {
			background: #f1f1f1;
			padding:10px 0;
			ul {
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				li {
					width: 20%;
					img {
						/*width:65%;*/
					}
					p {
						text-align: center;
					    margin-bottom: 0;
					    margin-top: 0;
					    font-size: 14px;
					    img {
					    	border-radius:5px;
					    	padding: 3px;
					    	width: 50%;
					    }
					}
					p.bgweixin {
						img {
							background: #49b233;
						}
					}
					p.bgweixintimeline {
						img {
							background: #49b233;
						}
					}
					p.bgqq {
						img {
							background: #4081e1;
						}
					}
					p.bgqzone {
						img {
							background: #fdbe3d;
						}
					}
				}
			}
		}
		.cancel {
			width:100%;
			padding:12px 0;
			text-align: center;
		}
	}
</style>
<!--自定义sass样式-->
<style lang="scss" scoped>
	.floatLeft {
		float:left;
	}
	._shild {
		background: #ccc;
		margin-top:45px;
	}
	.cutInfo {
		.van-swipe {
			img {
				width: 100%;
				height:55px;
			}
		}
		.shareContainer {
			.shareIcon {
				background: #f1f1f1;
				padding:10px 0;
				ul {
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					li {
						width: 20%;
						img {
							/*width:65%;*/
						}
						p {
							text-align: center;
						    margin-bottom: 0;
						    margin-top: 0;
						    font-size: 14px;
						}
					}
				}
			}
			.cancel {
				width:100%;
				padding:12px 0;
				text-align: center;
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
	.enter {
		position:fixed;
		bottom:0;
		width:100%;
		background: #fff;
		display: flex;
		display: -webkit-flex;
    	align-items: center;
    	border-top:1px solid #e8e8e8;
		.enterInput {
			width:70%;
			margin:10px;
			float: left;
		}
		.enterCtl {
			width:30%;
			span {
				float: left;
    			width: 50%;
				display:inline-block;
				text-align: center;
			}
			a.cutLikes {
				width: 30px;
				display: inline-block;
				background: url(../assets/cutlikes.png);
				height:30px;
				background-size: 30px 30px;
				margin-top:5px;
			}
			a.cutdisLikes {
				width: 30px;
				display: inline-block;
				background: url(../assets/cutdislikes.png);
				height:30px;
				background-size: 30px 30px;
				margin-top:5px;
			}
			a.cutSend {
				width: 30px;
				display: inline-block;
				background: url(../assets/cutSend.png);
				height:30px;
				background-size: 30px 30px;
				margin-top:5px;
			}
		}
	}
	.cutComment {
		margin-top:10px;
		margin-bottom:55px;
	}
	.cutContent,.cutComment {
		background: #fff;
		padding:0 10px;
		li {
			border-bottom:1px solid #e8e8e8;
		}
		.kouziCard {
			color: #333;
		    font-size: 16px;
		    position: relative;
		    -webkit-box-sizing: border-box;
		    box-sizing: border-box;
		    padding: 15px 0px 5px 55px;
		    background:#fff;
		    .avatar {
		    	top: 15px;
			    left: 0px;
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
				    overflow: hidden;
				    text-overflow: ellipsis;
				    display: -webkit-box;
				    -webkit-box-orient: vertical;
		        	line-height: 20px;
		    		word-break: break-all;
		    		font-size:14px;
		    		color: #3c3c3c;
		    	}
		    	.louceng {
	    		    -webkit-box-flex: 1;
				    -webkit-flex: 1;
				    flex: 1;
				    min-width: 80px;
				    line-height: 20px;
				    text-align: right;
				    font-size:12px;
				    color:#ababab;
		    	}
		    	.content_desc,.content_owerback {
				    font-size: 12px;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    display: -webkit-box;
				    -webkit-box-orient: vertical;
		        	line-height: 20px;
					word-break: break-all;
					font-size:12px;
					color: #656565;
		    	}
		    	.content_time {
		    		color: #ababab;
				    font-size: 12px;
				    max-height: 20px;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    display: -webkit-box;
				    -webkit-line-clamp: 1;
				    -webkit-box-orient: vertical;
				    line-height: 20px;
				    word-break: break-all;
				    font-size: 12px;
		    	}
		    	.content_img {
		    		img {
		    			width:45%;
		    			margin-right:10px;
		    		}
		    	}
		    	.content_owerback {
		    		li {
		    			background: #d4d4d4;
		    			border-radius:5px;
		    			display: inline-block;
		    			padding: 0 10px;
   						width: 90%;
   						margin-top:10px;
   						position: relative;
   						p {
   							margin:5px 0;
   							span {
   								color:#0a4383;
   							}
   						}
   						i.icon {
   							position: absolute;
   							top: -7px;
   							left: 10%;
   							display: inline-block;
   							width: 0;
   							height:0;
   							border-left: 7px solid transparent;
   							border-right: 7px solid transparent;
   							border-bottom: 7px solid #d4d4d4;
   						}
		    		}
		    	}
		    }
		}
		.footer {
	    	height:25px;
	    	line-height: 25px;
	    	background: #e8e8e8;
	    	padding:0 10px;
	    	display: -webkit-box;
	    	overflow: hidden;
	    	.time {
	    		font-size:12px;
	    		color: #227bc7;
	    	}
	    	.ctl {
	    		span:first-child {
	    			margin-right:5px;
	    		}
	    		span {
	    			color: #227bc7;
	    			font-size:12px;
	    			i {
	    				margin:0 3px;
	    			}
	    		}
	    	}
	    	.likeList {
	    		font-size: 12px;
    		    display:inline-block;
			    -webkit-box-orient: vertical;
			    word-break: break-all;
			    overflow: hidden;
			    width: 70%;
			    height:25px;
			    text-overflow: ellipsis;
	    		span {
	    			margin-right:3px;
	    			color: #227bc7;
	    		}
	    	}
	    }
	}
	.curCtl {
    	height:25px;
    	line-height: 25px;
    	display:block;
    	overflow: hidden;
    	position: relative;
    	padding:5px 0;
    	.LorR {
    		float: right;
    		width:20px;
    		vertical-align:middle;
    		img {
    			width:100%;
    		}
    	}
    	.curCtlBox {
    		background: #d4d4d4;
    		display: none;
    		border-radius:5px;
    		position: absolute;
    		right:25px;
    		.curCtl_boxs {
	    		display: inline-block;
	    		width:50px;
	    		text-align: center;
	    		color:#fff;
	    		height:20px;
	    		line-height:25px;
	    		font-size:12px;
	    	}
	    	.curCtl_boxs:nth-child(2) {
	    		border-left: 1px solid #fff;
	    	}
    	}
    }
    .curCtl.active {
    	.curCtlBox {
    		display: inline-block !important;
    	}
    }
</style>