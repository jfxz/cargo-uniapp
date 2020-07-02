<template>
	<view class="weight">
		<headBar name="出港复称"></headBar>
		<view class="title-weight">
			<view class="zhan">
			</view>
			<tab-new :tabList="tabList" :value="currentTab" @change="tabChange">
			</tab-new>
		</view>
		<view class="contend">
			<view class="scroll">
				<view class="" v-show="currentTab === 0">
					<entry></entry>
				</view>
				<view class="" v-show="currentTab === 1">
					<cutOff></cutOff>
				</view>
			</view>
		</view>
		<view class="load-progress" :class="loadProgress!=0?'show':'hide'" :style="[{top:CustomBar+'px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-loadProgress) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>
	</view>
</template>

<script>
	import entry from './entry'
	import cutOff from './cutOff'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import arrow from '@/components/arrow/arrow.vue'
	import tabNew from '@/components/tab.vue'
	export default {
		components: {
			arrow,
			tabNew,
			entry,
			cutOff,
			headBar
		},
		data() {
			return {
				currentTab: 0,
				CustomBar: this.CustomBar,
				loadProgress: 0,
				tabList: ['复称录入', '复称截关']
			}
		},
		onLoad(params) {},
		onReady() {},
		methods: {
			LoadProgress(e) {
				this.loadProgress = this.loadProgress + 30;
				if (this.loadProgress < 100) {
					setTimeout(() => {
						this.LoadProgress();
					}, 100)
				} else {
					this.loadProgress = 0;
				}
			},
			showModal(e) {
				console.log(e)
				this.modalName = e.currentTarget.dataset.target
			},
			tabChange(val) { // 选择tab
				this.currentTab = val.tab
				this.LoadProgress()
				uni.showLoading({
					title: '正在加载'
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 300);
			}
		}
	}
</script>

<style lang="scss">
	.weight {
		.title-weight {
			position: fixed;
			top: 150upx;
			width: 100%;
			z-index: 10;
		}

		.contend {
			.scroll {
				background: #ffffff;
				margin-top: 240upx;
				color: #595959;
				padding-bottom: 20upx;
				// height: calc(100vh - 275upx);
				// overflow-y: auto;
			}

			.weightNum {
				display: flex;
				justify-content: space-between;
				color: #595959;
				height: 111upx;
				padding: 20upx 0 110upx 0;

				.left {
					width: 40%;
					text-align: center;

					>text {
						font-size: 35upx;
						display: inline-block;
						position: relative;
						bottom: 30upx;
					}

					.pick-text {
						font-size: 36upx;
						font-weight: bold;
						border: solid 5upx #dbdbdb;
						border-radius: 5upx;
						height: 94upx;
						width: 123upx;
						padding-top: 13upx;
					}

					>picker {
						display: inline-block;
						margin-left: 20upx;
					}
				}

				.right {
					width: 60%;
					text-align: center;
					font-size: 35upx;

					.text {
						display: inline-block;
						position: relative;
						top: -35upx;
					}

					.input-num {
						margin-left: 20upx;
						display: inline-block;
						// overflow: auto;
						width: calc(100% - 120upx);
						border: solid 5upx #dbdbdb;
						border-radius: 5upx;
						height: 94upx;
						width: 200upx;

						&.disable {
							background: #999999;
						}
					}
				}
			}

			.head {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 20upx;
				border: solid 2upx #e5e5e5;

				>text {
					display: block;
					width: 20%;
					text-align: center;
					font-size: 32upx;

				}
			}

			.list-item {
				padding: 30upx 20upx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 2upx #e5e5e5;
				color: #595959;

				>text {
					display: block;
					width: 20%;
					text-align: center;
					font-size: 32upx;
					overflow-x: auto;
				}
			}
		}

		.title {}
.zhan {
		width: 100%;
		z-index: 10;
		height: 20upx;
		/* #ifdef MP-WEIXIN */
		margin-top: -10upx;
		/* #endif */
		/* #ifdef APP-PLUS */
		margin-top: -20upx;
		/* #endif */
		background: #F4F5F6;
	}
		.tab-class {
			margin-top: 0upx;
		}
	}
</style>
