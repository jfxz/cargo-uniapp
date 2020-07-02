<template>
	<view class="tableForReWeight">
		<headBar name="uld出库信息"></headBar>
		<view class="table" style="overflow:scroll;display: -webkit-box;overflow-x: scroll;-webkit-overflow-scrolling: touch;">
			<view class="reweightContent" style="padding-top:0;padding-bottom: 0;width:2600upx;padding: 20upx 20upx;">
				<view class="head list" style="border:0;">
					<text>ULD号</text>
					<text>复称重量</text>
					<text>舱单毛重</text>
					<text>调整重量</text>
					<text>差异额</text>
					<text>差异率</text>
					<text>区位</text>
					<text>板架重量</text>
					<text>复称人</text>
					<text  style="width: 35%">复称时间</text>
					<text>磅秤编号</text>
				</view>
				<view class="list-item center" v-for="(item, index) in list" :key="index" @click="handleClick(item)" style="background-color:expression((index%2==0) ? 'red':'blue'">
					<text class="yun-text" @touchmove="tapStart(index)" @touchend="tapEnd" v-if="tapCurrentIndex === index || judgeScroll(item.uld, index)">
						{{item.uld}}
					</text>
					<scroll v-else class="yun-text" @click="tapStart(index)" color="#595959" font="32rpx" :text="item.uld"></scroll>
					<text  :style="[{color: item.uldInfo.reweighOp ? '#595959' : 'red'}]">{{item.uldInfo.wgtReweigh ? item.uldInfo.wgtReweigh : '-'}}</text>
					<text>{{item.wgt.wgtManifest ? item.wgt.wgtManifest : '-'}}</text>
					<text>{{item.uldInfo.wgtAdjust ? item.uldInfo.wgtAdjust : '-'}}</text>
					<text>{{item.wgt.wgtDiff ? item.wgt.wgtDiff : '-'}}</text>
					<text>{{item.uldInfo ?  (Math.round(item.wgt.wgtDiff / item.wgt.wgtManifest * 10000) / 100.00) + "%" : '-'}}</text>
					<text>{{item.uldInfo.waitLocation ? item.uldInfo.waitLocation: '-'}}</text> 
					<text>{{item.wgt.frameWgt ? item.wgt.frameWgt: '-'}}</text>
					<text>{{item.uldInfo.reweighOp ? item.uldInfo.reweighOp : '-'}}</text>
					<text  style="width: 35%">{{reweighTimeFormat( item.uldInfo.reweighTime)}}</text>
					<text>{{item.uldInfo.scaleNo ? item.uldInfo.scaleNo : '-'}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import scroll from '@/components/notice-bar/uni-notice-bar.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		components: {
			headBar,
			scroll
		},
		data() {
			return {
				listHeight: '',
				tapCurrentIndex: -1,
				list: [],
			}
		},
		mounted() {
			let view = uni.createSelectorQuery().in(this).select('.list')
			let clientHeight = uni.getSystemInfoSync().windowHeight
			let that = this
			view.boundingClientRect(data => {
				that.listHeight = clientHeight - data.top
			}).exec();
		},
		onLoad(options) {
			const data = JSON.parse(decodeURIComponent(options.item))
			this.list = data
		},
		methods: {
			reweighTimeFormat (data) {
				if (data) {
					return dayjs(data).format('YYYY-MM-DD hh:mm')
				} else {
					return '-'
				}
			},
			handleClick(item) {
				console.log(item)
			},
			longtap(item) {
				console.log(item)
			},
			handlerButton(e) {
				console.log(e)
			},
			tapEnd() {
				this.tapCurrentIndex = -1
				console.log(11111, this.tapCurrentIndex)
			},
			tapStart(index) {
				this.tapCurrentIndex = index
				console.log(222, index)
			},
			// 判断是否滚动 font-size === 32uxp 换算成16
			judgeScroll(value, index) {
				let valueWidth = uni.upx2px(16) * value.length
				let width = uni.getSystemInfoSync().windowWidth * 0.3
				if (valueWidth - width > 0) {
					return false
				}
				return true
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}
	
	.tableForReWeight {
		.reweightContent {
			display: flex;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx 10upx;
			color: #595959;
			padding: 30upx 0;
			.head {
				display: flex;
				color: #595959;
				padding: 30upx 30upx;
				border: solid 2upx #e5e5e5;
				&.list {
					padding: 30upx 0;
				}

				>text {
					display: block;
					width: 30%;
					text-align: center;
					font-size: 32upx;
				}
			}

			.list-item {
				padding: 30upx 0;
				display: flex;
				vertical-align: center;
				border: solid 2upx #e5e5e5;
				&.center {
					border: 0;
					border-top: solid 2upx #e5e5e5;
				}
				>text {
					display: block;
					width: 30%;
					text-align: center;
					font-size: 32upx;
				}
			}
		}
	}
</style>
