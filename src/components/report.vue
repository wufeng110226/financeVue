<template>
	<div class="report">
		<cutnavbars :title="name"></cutnavbars>
		<van-radio-group class="report-group" v-model="radio">
		  <van-cell-group>
		    <van-cell><van-radio name="1">政治有害</van-radio></van-cell>
		    <van-cell><van-radio name="2">淫秽色情</van-radio></van-cell>
		    <van-cell><van-radio name="3">赌博诈骗</van-radio></van-cell>
		    <van-cell><van-radio name="4">其他</van-radio></van-cell>
		  </van-cell-group>
		</van-radio-group>
		<van-button size="large" @click="submit">提交</van-button>
	</div>
</template>

<script>
	import router from '@/router'
	import cutnavbars from '@/components/public/cutnavbar'
	import { Toast } from 'vant';
	export default {
		components:{
			cutnavbars
		},
		data(){
			return {
				name:'举报',
				radio:"1"
			}
		},
		methods: {
			submit(){
				let _this = this;
				Toast({message:'感谢您的维护与帮助！'});
				let _getParams = this.$route.params;
				setTimeout(function(){
					_this.$router.push(
			  			{
			  				name:'cutInfo',
			  				params:{
			  					id:_getParams.id,
			  					userId:_getParams.userId
			  				}
			  			}
			  		)
				},3000)
			}
		}
	}
</script>
<!--UI样式需要使用普通css-->
<style lang="scss">
	.report {
		margin:10px;
		.report-group {
			margin-top:45px;
			.van-radio .van-icon-checked {
				color:#41acff;
			}	
		}
		.van-button {
			background: #41acff;
			color:#fff;
		}
	}
	
</style>