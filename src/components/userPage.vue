<template>
	<div v-waterfall-lower="loadMore" waterfall-disabled="disabled">
		<cutnavbars :title="userName"></cutnavbars>
		<van-pull-refresh v-model="isLoading">
			<div class="userPage">
				<van-cell class="userData">
				    <template slot="title">
				    	<div class="Img"><img style="width:35px;height:35px;" :src="baseurl+userData.avatar" /></div>
				    	<div class="baseData">
					      	<span class="van-cell-text">{{userData.name}}</span>
					      	<van-tag plain type="danger">v{{userData.grade}}</van-tag>
				    	</div>
				    	<div class="hotData">
				    		<span class="van-cell-text">积分：{{userData.integral}}</span>
				    		<span class="van-cell-text">参与：{{userData.parte}}</span>
				    	</div>
				    </template>
			  	</van-cell>
			  	<van-cell class="allPost" title="发表"></van-cell>
			  	<ul class="kouzi">
				  	<li v-for="item in postList" @click="toDetail(item)">
					  	<div class="kouziCard">
					  		<div class="avatar"><img :src="baseurl+item.avatar" /></div>
					  		<div class="content">
					  			<div class="content_name">{{item.name}}</div>
					  			<div class="content_desc">{{item.content}}</div>
					  			<div class="content_img"><img v-for="pic in item.pic" :src="pic"></div>
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
				<div class="loadingsBox" v-if="isNext == 1">正在加载新内容<van-loading type="circle" color="black" /></div>
				<div class="loadingsBox" v-else>没有更多的内容了</div>
			</div>
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
				isLoading:false,   //下拉刷新
				userName:'',
				isNext:0,
				page:1,
				baseurl:'',        //图片地址
				userData:{},       //用户信息
				postList:[],       //帖子列表
				disabled:false
			}
		},
		watch:{
			isLoading(){
				if(this.isLoading){
					this.getUserInfo();
				}
			}
		},
		methods: {
			getUserInfo(){
				Toast.loading({
					duration: 0,       // 持续展示 toast
					forbidClick: true, // 禁用背景点击
				});
				let _getParams = this.$route.params;
				this.$http.post(httpUrl.userInfo,_getParams)
		    		.then(
		    			response => {
		    				this.isLoading = false;
		    				Toast.clear();
		    				/*base64解码*/
		    				let postList = response.body.postList;
		    				let userData = response.body.userData;
		    				for(let i=0;i<postList.length;i++){
		    					postList[i].name = this.Base64.decode(postList[i].name);
		    					postList[i].content = this.Base64.decode(postList[i].content);
		    					if(postList[i].pic !== ''){
			    					postList[i].pic = postList[i].pic.split(',');
			    					for(let a=0;a<postList[i].pic.length;a++){
			    						postList[i].pic[a] = response.body.baseurl + postList[i].pic[a];
			    					}
			    				}
		    				}
		    				for(let v=0;v<userData.length;v++){
		    					userData[v].name = this.Base64.decode(userData[v].name);
		    				}
		    				
		    				
		    				this.postList = postList;
		    				this.userData = userData;
		    				this.baseurl = response.body.baseurl;
		    				this.isNext = response.body.isNext;
		    				this.userName = response.body.userData.name;
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
				let form;
				if(this.isNext == 1){
					let _getParams = this.$route.params;
					form = {
						id:_getParams.id,
						page:this.page + 1
					}
					this.$http.post(httpUrl.userInfo,form)
						.then(
							response => {
								this.disabled = false;
								this.page += 1;
								this.isNext = response.body.isNext;
								let postList = response.body.postList;
								for(let i=0;i<postList.length;i++){
									postList[i].name = this.Base64.decode(postList[i].name);
									postList[i].content = this.Base64.decode(postList[i].content);
									if(postList[i].pic !== ''){
				    					postList[i].pic = postList[i].pic.split(',');
				    					for(let a=0;a<postList[i].pic.length;a++){
				    						postList[i].pic[a] = response.body.baseurl + postList[i].pic[a];
				    					}
				    				}
									this.postList.push(postList[i]);
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
			},
			toDetail(e){
		  		this.$router.push(
		  			{
		  				name:'cutInfo',
		  				params:{
		  					id:e.id,
		  					userId:e.userId,
		  					comments:e.comments,
		  					likes:e.likes
		  				}
		  			}
		  		)
		  	}
		},
		mounted(){
			this.getUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.userPage {
		background: #f8f8f8;
		margin-top:45px;
		.userData {
			padding:10px 20px;
			.hotData {
				text-align: right;
			}
			.hotData,.baseData {
				width:50%;
			}
			.hotData,.baseData,.Img {
				display: table-cell;
				vertical-align: middle;
			}
			.Img {
				padding-right:10px;
				img {
					border-radius:100%;
				}
			}
		}
		.allPost {
			padding:10px 20px;
			margin-top:10px;
			font-size:14px;
		}
		.kouzi {
			background: #fff;
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
						margin-bottom: 5px;
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