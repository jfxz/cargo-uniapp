<template>
	<view class="goods">
		<view class="head">
			<text style="width:230rpx">运单号</text>
			<text style="width:250rpx">件数/总件数</text>
			<text style="width:250rpx">重量/总重量</text>
			<text style="width:100rpx">体积</text>
			<text style="width:150rpx">截关次数</text>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" :content="`是否截关(${item.WBPREFIX + item.WBNO})？`"  :size="32" :button="button"></tui-modal>
		<view class="list" :style="{height: listHeight + 'px'}">
			<view class="list-item" v-for="(item, index) in list" :key="index" @longtap="longtap(item)">
				<text class="yun-text" @touchmove="tapStart(index)" @touchend="tapEnd" style="width:230rpx" v-if="tapCurrentIndex === index || judgeScroll(item.WBNO, index)">
					{{item.WBPREFIX + ' '+ item.WBNO}}
				</text>
				<scroll v-else class="yun-text" @click="tapStart(index)" color="#595959" font="32rpx" :text="item.WBNO"></scroll>
				<text style="width:250rpx">{{item.NUM}}/{{item.BILLNUM}}</text>
				<text style="width:250rpx">{{item.WGT}}/{{item.BILLWGT}}</text>
				<text style="width:100rpx">{{item.VOL}}</text>
				<text :style="{width:'150rpx', color: item.WEIGHCLOSETIMES === 0 ? 'red' : ''}">{{item.WEIGHCLOSETIMES}}</text>
			</view>
			<msg-tip ref="toast"></msg-tip>
		</view>
	</view>
</template>

<script>
	import tuiModal from "@/components/modal"
	import tuiSwipeAction from "@/components/swipe-action"
	import scroll from '@/components/notice-bar/uni-notice-bar.vue'
	import msgTip from '@/components/tip/tip.vue'
	import {getReWgt, postReWgt} from '@/common/api/weight/api.js'
	export default {
		components: {
			scroll, tuiSwipeAction, tuiModal, msgTip
		},
		data() {
			return {
				item: null,
				modal: false,
				button: [{
					text: "取消",
					type: 'gray'
				}, {
					text: "确定"
				}],
				listHeight: '',
				tapCurrentIndex: -1,
				list: [],
				actions: [{
						name: '截关',
						color: '#fff',
						fontsize: 30,//单位upx
						width: 80, //单位px
						//icon: 'like.png',//此处为图片地址
						background: '#ed3f14'
					}
				]
			}
		},
		// computed: {
		// 	halfWidth() {
		// 		return uni.upx2px(750 / 2) + 'px';
		// 	}
		// },
		onReady () {
			this.getData()
		},
		mounted () {
			let view = uni.createSelectorQuery().in(this).select('.list')
			let clientHeight = uni.getSystemInfoSync().windowHeight
			let that = this
			view.boundingClientRect(data => {
			  that.listHeight = clientHeight - data.top
			}).exec();
			// console.log(uni.upx2px(32))
			// console.log(uni.getSystemInfoSync().windowWidth)
			// let view = uni.createSelectorQuery().in(this).selectAll('.yun-text')
			// console.log(view)
			// view.boundingClientRect(data => {
			//   console.log(data)
			// }).exec();
			// view.fields({
			// 	size: true,
			// 	scrollOffset: true
			// }, data => {
			// 	console.log(data)
			// }).exec()
		},
		methods: {
			getData () {
				let uldInfo = getApp().globalData.uldForm
				let wbInfo = getApp().globalData.wbForm
				console.log('wbInfo', wbInfo)
				this.$loading('加载中')
				getReWgt({uldId: uldInfo.uldid || '', wbId: wbInfo.wbid || ''}).then(res => {
					if (res.status) {
						this.list = res.data
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				})
			},
			hide () {
				this.modal = false
			},
			handleClick (e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					postReWgt(this.item).then(res => {
						if (res.status) {
							let options = {
								msg: res.message,
								duration: 2000,
								type: 'green'
							}
							this.modal = false
							this.$refs.toast.showTips(options)
							this.getData()
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			longtap (item) {
				this.modal = true
				this.item = item
				console.log(item)
			},
			handlerButton(e) {
				console.log(e)
				postReWgt(e.item).then(res => {
					if (res.status) {
						let options = {
							msg: res.message,
							duration: 2000,
							type: 'green'
						}
						this.modal = false
						this.$refs.toast.showTips(options)
						this.getData()
					} else {
						this.$message(res.message)
					}
				})
			},
			tapEnd () {
				this.tapCurrentIndex = -1
				console.log(11111, this.tapCurrentIndex)
			},
			tapStart (index) {
				this.tapCurrentIndex = index
				console.log(222, index)
			},
			// 判断是否滚动 font-size === 32uxp 换算成16
			judgeScroll (value, index) {
				let valueWidth = uni.upx2px(16) * value.length
				let width = uni.getSystemInfoSync().windowWidth * 0.3
				console.log(233, valueWidth, width)
				if (valueWidth - width > 0) {
					return false
				}
				return true
			}
		}
	}
</script>

<style lang="less">
	.goods {
		overflow-x: auto;
		.head {
			// display: inline-flex !important;
			width: 1100rpx;
			white-space: nowrap;
		}
		.list {
			overflow-y: auto;
			width: 1100rpx;
			white-space: nowrap;
			.list-item {
				line-height: 90rpx;
				font-size: 34rpx;
			}
		}
	}
	.yun-text {
		display: block;
		width: 30%;
		text-align: center;
		font-size: 32upx;
		overflow-x: auto;
	}
</style>
