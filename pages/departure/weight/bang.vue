<template>
	<view class="bang">
		<msg-tip ref="toast"></msg-tip>
		<view class="head">
			<!-- <checkbox-group @change="allCheck" style="width: 10%;display: inline-block;transform:scale(0.7)">
				<checkbox/>
			</checkbox-group> -->
			<text style="width: 7%;display: inline-block"></text>
			<text style="width:20%">类型</text>
			<text style="width:18%">ULD号</text>
			<text style="width:15%">件数</text>
			<text style="width:15%">重量</text>
			<text style="width:20%">体积</text>
		</view>
		<radio-group @change="tableCheck" class="radio-class" :style="{height: listHeight + 'px'}">
			<view class="list-item" @click="itemClick(index)" v-for="(item, index) in list" :key="index">
				<view style="display: inline-block;width: 7%;">
					<radio :value="index" :checked="index === current"/>
				</view>
				<text class="yun-text" @touchmove="tapStart(index)" @touchend="tapEnd" style="width:20%" v-if="tapCurrentIndex === index || judgeScroll(item.ULD_TYPE, index)">
					{{item.ULD_TYPE || ''}}
				</text>
				<scroll v-else class="yun-text" @click="tapStart(index)" color="#595959" font="32upx" :text="item.ULD_TYPE"></scroll>
				<text style="width:18%">{{item.ULD_NO || ''}}</text>
				<!-- <input v-if="index === current" style="width:15%;text-align: center;" type="number":value="item.num" /> -->
				<text style="width:15%">{{item.NUM}}</text>
				<!-- <input v-if="index === current" style="width:15%;text-align: center;" type="number":value="item.weight" /> -->
				<text style="width:15%">{{item.WGT}}</text>
				<text style="width:20%">{{item.VOL}}</text>
			</view>
		</radio-group>
		<view class="btn">
			<view class="flex-btn">
				<button type="primary" :disabled="current === -1" style="width: 30%;background: #0ebf9c;" @click="editNum()">修改件数</button>
				<button type="primary" :disabled="current === -1" style="width: 30%;background: #0ebf9c;" @click="editVol()">修改体积</button>
				<button type="warn" :disabled="current === -1" style="width: 30%;" @click="del()">删除</button>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="确定删除此条过磅记录吗？"></tui-modal>
		<tui-modal :show="finishModal" @cancel="hide" :custom="true" :fadein="true">
			<view class="tui-modal-custom">
				<view class="tui-prompt-title">{{numModalFlag ? '件数' : '体积'}}</view>
				<input type="number" :placeholder="numModalFlag ? '请输入件数' : '请输入体积'" class="tui-input" v-model="number" />
				<view class="modal-btn">
					<button type="primary" @click="handleNumClick">立即提交</button>
				</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import {deepCopy} from '@/common/util/util.js'
	import scroll from '@/components/notice-bar/uni-notice-bar.vue'
	import msgTip from '@/components/tip/tip.vue'
	import tuiModal from "@/components/modal"
	import {getWbWeigh, putNum, putVol, delData} from '@/common/api/weight/api.js'
	export default {
		components: {
			scroll, msgTip, tuiModal
		},
		data() {
			return {
				listHeight: '',
				numModalFlag: true,
				number: 0,
				finishModal: false,
				modal: false,
				tapCurrentIndex: -1,
				current: -1,
				list: []
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
			// console.log(uni.upx2px(32))
			// console.log(uni.getSystemInfoSync().windowWidth)this.$nextTick(function(){
				let view = uni.createSelectorQuery().in(this).select(".radio-class")
				let clientHeight = uni.getSystemInfoSync().windowHeight
				let that = this
				console.log(view)
				view.boundingClientRect(data => {
					console.log(data)
					that.listHeight = clientHeight - data.top - 50
				}).exec()
			// view.fields({
			// 	size: true,
			// 	scrollOffset: true
			// }, data => {
			// 	console.log(data)
			// }).exec()
		},
		methods: {
			getData () {
				this.current = -1
				let wbInfo = getApp().globalData.wbForm
				console.log('wbInfo', wbInfo)
				if (wbInfo.wbPrefix && wbInfo.wbNo) {
					this.$loading('加载中')
					getWbWeigh({wbPrefix: wbInfo.wbPrefix, wbNo: wbInfo.wbNo}).then(res => {
						this.list = res.data
						uni.hideLoading()
					})
				}
			},
			itemClick (index) {
				this.current = index
			},
			handleNumClick () {
					let form = deepCopy(this.list[this.current])
					if (this.numModalFlag) {
						form.NUM = this.number
						delete form.VOL
					} else {
						form.VOL = this.number
						delete form.NUM
					}
				let putAjax = this.numModalFlag ? putNum : putVol
				putAjax(form).then(res => {
					if (res.status) {
						let options = {
							msg: res.message,
							duration: 2000,
							type: 'green'
						}
						this.getData()
						this.finishModal = false
						this.$refs.toast.showTips(options)
					} else {
						this.$message(res.message)
					}
				})
			},
			hide () {
				this.modal = false
				this.finishModal = false
			},
			handleClick (e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					delData(this.list[this.current]).then(res => {
						if (res.status) {
							let options = {
								msg: '成功删除',
								duration: 2000,
								type: 'green'
							}
							this.getData()
							this.modal = false
							this.$refs.toast.showTips(options)
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			editNum () {
				this.number = this.list[this.current].NUM
				this.numModalFlag = true
				this.finishModal = true
			},
			editVol () {
				this.number = this.list[this.current].VOL
				this.numModalFlag = false
				this.finishModal = true
			},
			del () {
				this.modal = true
			},
			tableCheck (val) {
				console.log(val.target.value)
				this.current = 	Number(val.target.value)
			},
			// allCheck (val) {
			// 	if (val.detail.value.length >= 1) {
			// 		this.all = true
			// 	} else {
			// 		this.all = false
			// 	}
			// },
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
				let valueWidth = value ? uni.upx2px(16) * value.length : 0
				let width = uni.getSystemInfoSync().windowWidth * 0.2
				if (valueWidth - width > 0) {
					return false
				}
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		overflow-y: hidden;
	}
	.modal-btn {
		margin-top: 20upx;
	}
	.tui-modal-custom {
		text-align: center
	}
	.tui-prompt-title {
		padding-bottom: 20upx;
		font-size: 38upx;
		font-weight: 600;
	}
	.tui-input {
		margin: 30upx 40upx;
		border-bottom: 1upx solid #E6E6E6;
		padding-bottom: 20upx;
		font-size: 32upx;
	}
	.radio-class {
		overflow-y: auto;
	}
	.btn {
		width: 100%;
		position: absolute;
		bottom: 20upx;
		z-index: 10;
		// height: 60px;
	}
	.flex-btn {
		width: 100%;
		display: flex;
		
	}
	.yun-text {
		display: block;
		width: 20%;
		text-align: center;
		font-size: 32upx;
		overflow-x: auto;
	}
</style>
