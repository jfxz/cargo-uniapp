<template>
	<view class="transfer">
		<msg-tip ref="toast"></msg-tip>
		<headBar name="出港中转货交接"></headBar>
		<view class="top">
			<view class="flex">
				<view class="left">
					航班号
				</view>
				<view class="right">
					<input type="text" :value="form.carrier" placeholder="请输入前缀"/>
					<input type="text" :value="form.flight" placeholder="请输入航班号"/>
				</view>
			</view>
			<view class="flex">
				<view class="left">
					运单号
				</view>
				<view class="right">
					<input type="text" :value="form.wbPrefix" placeholder="请输入前缀"/>
					<input type="text" @input="yunChange" :value="form.wbNo" placeholder="请输入运单号"/>
				</view>
			</view>
			<view class="flex">
				<view class="left">
					航班日期
				</view>
				<view class="rightDate">
					 <picker mode="date" :value="form.flightDate" @change="dateChange">
							<view class="uni-input">{{form.flightDate}}</view>
						</picker>
				</view>
			</view>
		</view>
		<view class="mid">
			<view class="btn-flex">
				<button type="primary" id="btn1" plain="true">清空</button>
				<button type="primary" @tap="getData" id="btn2">查询</button>
			</view>
		</view>
		<view class="flight">
			<view class="circle">进</view>
			<text>进港清单异常表</text>
		</view>
		<view class="list">
			<view class="head">
				<text style="width:35%">运单号</text>
				<text style="width:20%">批次号</text>
				<text style="width:15%">品名</text>
				<text style="width:15%">件数</text>
				<text style="width:15%;">操作</text>
			</view>
			<view class="contend-list">
				<view class="item-list" v-for="(item, index) in doaList" :key="index">
					<text style="width:35%">{{item.wbNum}}</text>
					<text style="width:20%">{{item.batchNo}}</text>
					
					<text class="yun-text" @touchmove="tapStart('doa', 'cargoName', index)" @touchend="tapEnd('doa', 'cargoName', index)" style="width:15%"
					v-if="(doaCurrentIndex === index && currentCol === 'cargoName')  || judgeScroll(item.cargoName, index, 0.15)">
						{{item.cargoName}}
					</text>
					<scroll v-else class="yun-text" style="width:15%" @click="tapStart('doa', 'cargoName', index)" color="#595959" font="36rpx" :text="item.cargoName"></scroll>
					
					<!-- <text style="width:15%">{{item.cargoName}}</text> -->
					<text style="width:15%">{{item.num}}</text>
					<text style="width:15%;color:#0ebf9c" @tap="handover(item)">交接</text>
				</view>
			</view>
		</view>
		
		<view class="flight">
			<view class="circle out">出</view>
			<text>出港清单异常表</text>
		</view>
		<view class="list">
			<view class="head">
				<text style="width:25%">运单号</text>
				<text style="width:20%">批次号</text>
				<text style="width:15%">品名</text>
				<text style="width:15%">件数</text>
				<text style="width:25%;">操作</text>
			</view>
			<view class="contend-list">
				<view class="item-list" v-for="(item, index) in dodList" :key="index">
					<text class="yun-text" @touchmove="tapStart('dod', 'wbNum', index)" @touchend="tapEnd('dod', 'wbNum', index)" style="width:25%"
					v-if="(dodCurrentIndex === index && currentCol === 'wbNum') || judgeScroll(item.wbNum, index, 0.25)">
						{{item.wbNum}}
					</text>
					<scroll v-else class="yun-text" style="width:25%" @click="tapStart('dod', 'wbNum', index)" color="#595959" font="36rpx" :text="item.wbNum"></scroll>
					
					<!-- <text style="width:25%">{{item.item.wbNum}}</text> -->
					<text style="width:20%">{{item.batchNo}}</text>
					
					<text class="yun-text" @touchmove="tapStart('dod', 'cargoName', index)" @touchend="tapEnd('dod', 'cargoName', index)" style="width:15%"
					v-if="(dodCurrentIndex === index && currentCol === 'cargoName') || judgeScroll(item.cargoName, index, 0.15)">
						{{item.cargoName}}
					</text>
					<scroll v-else class="yun-text" style="width:15%" @click="tapStart(index)" color="#595959" font="36rpx" :text="item.cargoName"></scroll>
					
					<!-- <text style="width:15%">{{item.cargoName}}</text> -->
					<text style="width:15%">{{item.num}}</text>
					<view style="width:25%;">
						<text class="cancel" @tap="cancel(item)">取消</text>
						<text class="pei" @tap="vehicle(item)">配车</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import msgTip from '@/components/tip/tip.vue'
	import scroll from '@/components/notice-bar/uni-notice-bar.vue'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import {getAbnormal, transitCommit, transitCancel} from '@/common/api/transfer/api.js'
	import {model7, deepCopy} from '@/common/util/util.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		components: {
			headBar, scroll, msgTip
		},
		data() {
			return {
				currentCol: '',
				doaCurrentIndex: -1,
				dodCurrentIndex: -1,
				doaList: [],
				dodList: [],
				form: {
					flightDate: '2018-02-25',
					carrier: 'SC',
					flight: '4770',
					wbPrefix: '',
					wbNo: ''
				}
			}
		},
		onLoad (params) {
		},
		mounted () {
		},
		methods: {
			yunChange (val) {
				if (val.detail.value.length == 8) {
					if (!model7(val.detail.value)) {
						uni.showToast({
							title: '运单不符合规则',
							duration: 2000,
							icon:'none'
						})
					}
				}
			},
			getData () {
				let form = deepCopy(this.form)
				form.flightDate = dayjs(form.flightDate).valueOf()
				uni.showLoading({title: '加载中'})
				console.log(form)
				getAbnormal(form).then(res => {
					console.log(res)
					this.doaList = res.data.doaList
					this.dodList = res.data.dodList
					uni.hideLoading()
				})
			},
			handover (item) {
				uni.showLoading({title: '加载中'})
				transitCommit(item).then(res => {
					if (res.status) {
						let options = {
							msg: '交接成功',
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
					}
					uni.hideLoading()
				})
			},
			cancel (item) {
				uni.showLoading({title: '加载中'})
				transitCancel(item).then(res => {
					if (res.status) {
						let options = {
							msg: '取消成功',
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
					}
					uni.hideLoading()
				})
			},
			vehicle (item) {
				let options = {
					msg: '配车成功',
					duration: 2000,
					type: 'green'
				}
				this.$refs.toast.showTips(options)
			},
			tapEnd (tableName, col, index) {
				if (tableName === 'doa') {
					this.doaCurrentIndex = -1
				} else {
					this.dodCurrentIndex = -1
				}
				this.currentCol = col
			},
			tapStart (tableName, col, index) {
				if (tableName === 'doa') {
					this.doaCurrentIndex = index
				} else {
					this.dodCurrentIndex = index
				}
				this.currentCol = col
			},
			dateChange (e) {
				this.form.flightDate = e.target.value
			},
			judgeScroll (value, index, scale) {
				console.log(value)
				if (value) {
					let valueWidth = uni.upx2px(32) * value.length
					let width = uni.getSystemInfoSync().windowWidth * scale
					if (valueWidth - width > 0) {
						return false
					}
					return true
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
	.transfer {
		.list {
			>text {
				display: inline-block;
			}
			.item-list {
				.yun-text {
					display: block;
					text-align: center;
					font-size: 36upx;
					overflow-x: auto;
					white-space:nowrap;
				}
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 20upx 20upx;
				border-top: 3upx solid #e5e5e5;
				font-size: 36upx;
				background: #FFFFFF;
				>text {
					text-align: center;
					display: inline-block;
				}
				.pei {
					font-size: 36upx;
					color: #1890ff;
					display: inline-block;
					margin-left: 20upx;
				}
				.cancel {
					font-size: 36upx;
					color: #0ebf9c;
					display: inline-block;
				}
			}
			.head {
				>text {
					text-align: center;
				}
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				font-size: 35upx;
				padding: 30upx 20upx;
			}
		}
		.flight {
			background: #FFFFFF;
			padding: 30upx 60upx;
			margin-top: 20upx;
			>text {
				font-size: 36upx;
				color: #595959;
				font-weight: bold;
				margin-left: 20upx;
			}
			.circle {
				width: 50upx;
				height: 50upx;
				border-radius: 25upx;
				background: #fdb332;
				text-align: center;
				line-height: 50upx;
				color: #FFFFFF;
				font-size: 33upx;
				display: inline-block;
				&.out {
					background: #0ebf9c;
				}
			}
		}
		.mid {
			.btn-flex {
				display: flex;
				justify-content: space-between;
				padding: 10upx 50upx 10upx 50upx;
				#btn1 {
					color: #0ebf9c;
					border: 3upx solid #0ebf9c;
					width: 100%;
					margin-right: 40upx;
					height: 100upx;
					line-height: 100upx;
					font-size: 38upx;
				}
				#btn2 {
					border: 3upx solid #0ebf9c;
					background: #0ebf9c;
					width: 100%;
					height: 100upx;
					line-height: 100upx;
					font-size: 38upx;
				}
			}
		}
		.top {
			color: #595959;
			margin: 30upx 0;
			background: #FFFFFF;
			width: 100%;
			padding: 30upx 60upx;
			.flex {
				margin-bottom: 20upx;
				.left {
					font-size: 35upx;
					width: 200upx;
					line-height: 94upx;
				}
				.right {
					display: flex;
					justify-content: flex-start;
					border: 3upx solid #dbdbdb;
					border-left: 0;
					width: 100%;
					input {
						font-size: 35upx;
						text-align: center;
						border-left: 3upx solid #dbdbdb;
						height: 94upx;
					}
				}
				.rightDate {
					font-size: 35upx;
					border: 3upx solid #dbdbdb;
					width: 100%;
					.uni-input {
						font-size: 35upx;
						height:94upx;
						padding: 0;
						line-height:94upx;
					}
					>picker {
						height: 94upx;
						padding-left: 20upx;
					}
				}
			}
			
		}
	}
</style>
