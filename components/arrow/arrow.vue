<template>
	<view class="arrow">
		<image src="/static/arrow_left.png" @click="back" class="arrow_left" mode="aspectFit"></image>
		<text @click="back">{{name}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: () => ''
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			back () {
				console.log(1)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
.arrow {
	background-color: #ffffff;
	height: 96upx;
	padding: 25upx 0 0 30upx;
	.arrow_left {
		width: 30upx;
		height: 38upx;
	}
	text {
		font-size: 38upx;
		color: #404040;
		// font-weight: bold;
		margin-left: 30upx;
		display: inline-block;
		transform: translateY(-5upx);
	}
}
</style>
