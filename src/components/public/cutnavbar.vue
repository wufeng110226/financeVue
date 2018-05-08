<template>
	<van-nav-bar class="cut_navbar" :title="title" leftArrow fixed>
		<van-icon @click="historyback" class="arrow" name="arrow" slot="left" />
		<span v-if="thisrouterName == 'cutInfo'" slot="right" @click="clicks">分享</span>
	</van-nav-bar>
</template>

<script>
import router from '@/router'
export default {
	props:["title"],
	data(){
		return {
			thisrouterName:''
		}
	},
	methods: {
		clicks(){
			this.$emit('shareTo');
		},
		historyback(){
			this.$router.go(-1);
		}
	},
	mounted(){
		this.thisrouterName = router.history.current.name
	}
}
</script>

<style lang="scss">
	.cut_navbar {
		background-color: #41acff;
		color: #fff;
		z-index: 9999;
		.van-icon {
			color: #fff;
		}
		.arrow {
		    transform: rotate(180deg);
		    transform: -webkit-ratate(180deg);
		}
		.van-hairline--top-bottom::after {
			border:none;
		}
	}
</style>