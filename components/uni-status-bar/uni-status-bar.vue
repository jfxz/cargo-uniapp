<template>
	<view class="status-title">
		<view class="uni-status-bar" @tap="back">
			<image class="image-nav" :src="require('../../static/back.png')" mode="aspectFit"></image>
			<text>{{name}}</text>
		<slot/></view>
	</view>
</template>

<script>
export default {
  name: 'UniStatusBar',
	props: {
		name: {
			type: String,
			default: () => ''
		}
	},
  data () {
    return {
    }
  },
	methods: {
		back () {
			uni.navigateBack({delta: 1})
		}
	}
}
</script>

<style lang="scss">
	page {
		overflow-x: hidden;
	}
.status-title {
	position: fixed;
	top: 0;
	width: 100%;
	background: #776f6f;
	z-index: 10;
}
.uni-status-bar {
	display: block;
	background: #FFFFFF;
	width: 100%;
	/* #ifdef MP */
	margin-top: calc(var(--status-bar-height) + 10px) ;
	/* #endif */
	/* #ifdef APP-PLUS */
	margin-top: var(--status-bar-height);
	/* #endif */
	
	height:80upx ;
	// padding: 20upx 0 0upx 20upx;
	line-height: 80upx;
	padding-left: 20upx;
	>text {
		line-height: 80upx;
		display: inline-block;
		padding-left: 30upx;
		font-size: 40upx;
		line-height: 80upx;
		font-weight: 600;
		position: relative;
		// bottom: 5upx;
	}
	>image {
		height: 40upx;
		width: 40upx;
		position: relative;
		top: 5upx;
	}
}
</style>
