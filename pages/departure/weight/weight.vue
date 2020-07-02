<template>
	<view class="weight">
		<headBar name="过磅"></headBar>
		<view class="title-weight">
			<!-- <view class="title">
				<arrow name="过磅"></arrow>
			</view> -->
			<view class="zhan">
				
			</view>
			<view class="tab-class">
				<tab-new :tabList="tabList" :value="currentTab" @change="tabChange">
				</tab-new>
			</view>
		</view>
		<view class="contend">
			<view class="scroll">
				<view class="" v-show="currentTab === 0">
					<fast-weight ref="fast" @jumpWb="jumpWb" @jumpGoods="jumpGoods"></fast-weight>
				</view>
				<view class="" v-if="currentTab === 1">
					<waybill></waybill>
				</view>
				<view class="" v-if="currentTab === 2">
					<goods></goods>
				</view>
				<view v-if="currentTab === 3" >
					<bang></bang>
				</view>
			</view>
		</view>
		<!-- <view class="load-progress" :class="loadProgress!=0?'show':'hide'" :style="[{top:CustomBar+'px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-loadProgress) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view> -->
	</view>
</template>

<script>
	import bang from './bang'
	import fastWeight from './fastWeight'
	import goods from './goods'
	import waybill from './waybill'
	import arrow from '@/components/arrow/arrow.vue'
	import tabNew from '@/components/tab.vue'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import {getWbWeigh} from '@/common/api/weight/api.js'
	export default {
		components: {
			arrow, tabNew, fastWeight, goods, bang, waybill, headBar
		},
		data() {
			return {
				currentTab: 0,
				CustomBar: this.CustomBar,
				loadProgress: 0,
				tabList: ['快速过磅', '运单信息', '货物信息', '过磅记录']
			}
		},
		onLoad (params) {
		},
		onReady () {
		},
		methods: {
			jumpGoods () {
				this.currentTab = 2
			},
			jumpWb () {
				this.currentTab = 1
			},
			// LoadProgress(e) {
			// 	this.loadProgress = this.loadProgress + 3;
			// 	if (this.loadProgress < 100) {
			// 		setTimeout(() => {
			// 			this.LoadProgress();
			// 		}, 100)
			// 	} else {
			// 		this.loadProgress = 0;
			// 	}
			// },
			showModal(e) {
				console.log(e)
				this.modalName = e.currentTarget.dataset.target
			},
			tabChange (val) {
				console.log(val)
				this.currentTab = val.tab
				if (this.currentTab === 0) {
					this.$refs.fast.$emit('flashUld')
					this.$refs.fast.$emit('checkWb')
				}
				// this.LoadProgress()
				/* this.$loading('加载中')
				setTimeout(function () {
						uni.hideLoading();
				}, 1000); */
				console.log(val)
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
				display: flex;
				justify-content: center;
				>text {
					font-size: 35upx;
					display: block;
					position:relative;
					top:20upx;
				}
				.pick-text {
					overflow-x: auto;
					font-size: 36upx;
					font-weight: bold;
					border: solid 5upx #dbdbdb;
					border-radius: 5upx;
					height: 94upx;
					width: 173upx;
					line-height:94upx;
					// padding-top: 13upx;
					margin-left: 20upx;
					white-space: nowrap;
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
				display: flex;
				justify-content: center;
				>text {
					font-size: 35upx;
					display: block;
					position:relative;
					top:20upx;
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
			padding: 20upx 20upx;
			border: solid 2upx #e5e5e5;
			>text {
				display: block;
				width: 20%;
				text-align: center;
				font-size: 32upx;
				
			}
		}
		.list-item {
			padding: 20upx 20upx;
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
	.title {
	}
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
