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
					<input type="text" @input="carrierChange" :value="form.carrier" placeholder="请输入前缀"/>
					<input type="text" @input="flightChange" :focus="flightFocus" :value="form.flight" placeholder="请输入航班号"/>
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
			<view class="flex">
				<view class="left">
					运单号
				</view>
				<view class="right">
					<input type="text" @input="prefixChange" @blur="yunblur" :value="form.wbPrefix" placeholder="请输入前缀"/>
					<view class="clearInput">
						<input :focus="yunNumFocus" @input="yunChange" @blur="wbBlur" v-model="form.wbNo" placeholder="请输入运单号"/>
						<view class="uni-icon uni-icon-clear" v-if="form.wbNo" @click="yunClear"></view>
						<!-- <icon type="clear" v-if="form.wbNo" @tap="clear"/> -->
					</view>
					<!-- <cInput type="text" :focus="yunNumFocus" @input="yunChange" @blur="wbBlur" @clear="yunClear" :value="form.wbNo" placeholder="请输入运单号"></cInput> -->
					<!-- <input type="text" @input="yunChange" :value="form.wbNo" placeholder="请输入运单号"/> -->
				</view>
			</view>
		</view>
		<view class="mid">
			<view class="btn-flex">
				<button type="primary" @tap="resetData" id="btn1" plain="true">清空</button>
				<button type="primary" @tap="getData" id="btn2">查询</button>
			</view>
		</view>
		<view class="flight">
			<view class="circle">进</view>
			<text>进港中转运单表</text>
		</view>
		<view class="fixed">
			<view class="left">
				<view class="head">
					<text>操作</text>
				</view>
				<view class="item-list" v-for="(item, index) in doaList" :key="index">
					<text style="color:#0ebf9c;margin-left: 80rpx;" @tap="handover(item)">交接</text>
				</view>
			</view>
			<view class="right">
				<view class="list">
					<view class="head">
						<!-- <text style="width:100rpx;">操作</text> -->
						<text style="width:200rpx;">是否换单</text>
						<text style="width:250rpx;">新运单号</text>
						<text style="width:150rpx;">批次号</text>
						<text style="width:200rpx;">品名</text>
						<text style="width:100rpx;">件数</text>
						<text style="width:100rpx;">重量</text>
						<text style="width:150rpx;">起点站</text>
						<text style="width:150rpx;">目的地</text>
						<text style="width:150rpx;">航班</text>
						<text style="width:250rpx;">日期</text>
					</view>
					<view class="contend-list">
						<view class="item-list" v-for="(item, index) in doaList" :key="index">
							<!-- <text style="width:100rpx;color:#0ebf9c" @tap="handover(item)">交接</text> -->
							<text style="width:200rpx;">{{item.isChange === '0' ? '否' : '是'}}</text>
							<text style="width:250rpx;">{{item.lastWb || item.wbNum}}</text>
							<text style="width:150rpx;">{{item.batchNo}}</text>
							
							<text class="yun-text" @touchmove="tapStart('doa', 'cargoName', index)" @touchend="tapEnd('doa', 'cargoName', index)" style="width:200rpx"
							v-if="(doaCurrentIndex === index && currentCol === 'cargoName')  || judgeScroll(item.cargoName, index, 200)">
								{{item.cargoName}}
							</text>
							<scroll v-else class="yun-text" style="width:200rpx" @click="tapStart('doa', 'cargoName', index)" font="36rpx" :text="item.cargoName"></scroll>
							
							<!-- <text style="width:200rpx">{{item.cargoName}}</text> -->
							<text style="width:100rpx;">{{item.num}}</text>
							<text style="width:100rpx;">{{item.wgt}}</text>
							<text style="width:150rpx;">{{item.origin}}</text>
							<text style="width:150rpx;">{{item.dest}}</text>
							<text style="width:150rpx;">{{item.flight}}</text>
							<text style="width:250rpx;">{{formatDate(item.flightTTime)}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="flight">
			<view class="circle out">出</view>
			<text>出港中转运单表</text>
		</view>
		<view class="fixed">
			<view class="left">
				<view class="head out">
					<text>操作</text>
				</view>
				<view class="item-list out" v-for="(item, index) in dodList" :key="index">
					<text class="cancel" @tap="cancel(item)">取消</text>
					<text class="pei" @tap="vehicle(item)">配车</text>
				</view>
				
			</view>
			<view class="right">
				<view class="list">
					<view class="head out">
						<!-- <text style="width:200rpx;">操作</text> -->
						<text style="width:250rpx;">运单号</text>
						<!-- <text style="width:150rpx;">批次号</text> -->
						<text style="width:200rpx;">品名</text>
						<text style="width:100rpx;">件数</text>
						<text style="width:100rpx;">重量</text>
						<text style="width:150rpx;">起点站</text>
						<text style="width:150rpx;">目的地</text>
						<text style="width:150rpx;">承运人</text>
						<text style="width:150rpx;">航班号</text>
						<text style="width:250rpx;">航班日期</text>
					</view>
					<view class="contend-list">
						<view class="item-list out" v-for="(item, index) in dodList" :key="index">
				
							<!-- <text class="cancel" style="width:100rpx;" @tap="cancel(item)">取消</text>
							<text class="pei" style="width:100rpx;" @tap="vehicle(item)">配车</text> -->
				
							<text style="width:250rpx;">{{item.wbPrefix + item.wbNo}}</text>
							<!-- <text style="width:150rpx;">{{item.batchNo}}</text> -->
							<text class="yun-text" @touchmove="tapStart('dod', 'cargoName', index)" @touchend="tapEnd('dod', 'cargoName', index)" style="width:200rpx"
							v-if="(dodCurrentIndex === index && currentCol === 'cargoName') || judgeScroll(item.cargoName, index, 200)">
								{{item.cargoName}}
							</text>
							<scroll v-else class="yun-text" style="width:200rpx" @click="tapStart('dod', 'cargoName', index)" font="36rpx" :text="item.cargoName"></scroll>
							<text style="width:100rpx;">{{item.wbNum}}</text>
							<text style="width:100rpx;">{{item.weight}}</text>
							<text style="width:150rpx;">{{item.origin}}</text>
							<text style="width:150rpx;">{{item.destination}}</text>
							<text style="width:150rpx;">{{item.carrier}}</text>
							<text style="width:150rpx;">{{item.flight}}</text>
							<text style="width:250rpx;">{{formatDate(item.flightDate)}}</text>
						</view>
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
	import cInput from '@/components/clearInput.vue'
	export default {
		components: {
			headBar, scroll, msgTip, cInput
		},
		data() {
			return {
				yunNumFocus: false,
				flightFocus: false,
				currentCol: '',
				doaCurrentIndex: -1,
				dodCurrentIndex: -1,
				doaList: [],
				dodList: [],
				form: {
					flightDate: '',
					carrier: '',
					flight: '',
					wbPrefix: '',
					wbNo: ''
				}
			}
		},
		onLoad (params) {
		},
		mounted () {
			// this.getData()
		},
		methods: {
			formatDate (date) {
				if (date) {
					return dayjs(date).format('YYYY-MM-DD')
				}
				return ''
			},
			yunClear () {
				this.form.wbPrefix = ''
				this.form.wbNo = ''
			},
			resetData () {
				this.form = {
					flightDate: '',
					carrier: '',
					flight: '',
					wbPrefix: '',
					wbNo: ''
				}
				this.getData()
			},
			carrierChange (val) {
				this.flightFocus = false
				this.form.carrier = val.detail.value.toLocaleUpperCase()
				if (this.form.carrier.length === 2) {
					this.flightFocus = true
				}
			},
			flightChange (val) {
				this.form.flight = val.detail.value
			},
			yunblur () {
				if (this.form.wbNo.length === 8) {
					this.wbBlur()
				}
				// uni.hideKeyboard()
			},
			wbBlur () {
				if (!model7(this.form.wbPrefix, this.form.wbNo) || this.form.wbNo.length !== 8) {
					this.$message('运单不符合规则')
				}
			},
			part (val) {
				let wbNum = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
				let wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.form.wbPrefix = wbPrefix
				this.form.wbNo = wbNum
			},
			prefixChange (val) {
				this.yunNumFocus = false
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else {
					this.form.wbPrefix = val.detail.value.toLocaleUpperCase()
					let wbPrefix = this.form.wbPrefix
					let flag = wbPrefix === 'YJ' || wbPrefix.length === 3
					if (flag) {
						this.yunNumFocus = true
					}
				}
			},
			yunChange (val) {
				console.log(val.detail.value.length)
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else if (val.detail.value.length > 8) {
					// this.form.wbNo = ''
					setTimeout(() => {
						this.form.wbNo = val.detail.value.substr(0, 8)
					}, 100)
					
					this.$message('运单号超出8位限制!')
				} else {
					this.form.wbNo = val.detail.value
				}
			},
			
			getData () {
				if (this.form.wbPrefix && this.form.wbNo && !model7(this.form.wbPrefix, this.form.wbNo)) {
					this.$message('运单不符合规则')
				}else if (!this.form.carrier || !this.form.flight) {
					this.$message('请输入航班号')
				} else if (!this.form.flightDate) {
					this.$message('请输入航班日期')
				} else {
					let form = deepCopy(this.form)
					form.flightDate = form.flightDate ? dayjs(form.flightDate).valueOf() : ''
					this.$loading('加载中')
					getAbnormal(form).then(res => {
						this.doaList = res.data.doaList
						this.dodList = res.data.dodList
						uni.hideLoading()
					}).catch(() => {
						uni.hideLoading()
					})
				}
			},
			handover (item) {
				let form = deepCopy(item)
        form['lastWbPrefix'] = form.lastWb.split('-')[0]
        form['lastWbNo'] = form.lastWb.split('-')[1]
				form['wbPrefix'] = form.wbNum.split('-')[0]
				form['wbNo'] = form.wbNum.split('-')[1]
				form['wbNum'] = form.num
        form['flightDate'] = this.form.flightDate ? dayjs(this.form.flightDate).valueOf() : ''
        form['carrier'] = this.form.carrier
        form['flight'] = this.form.flight
        
        
				this.$loading('加载中')
				transitCommit(form).then(res => {
					if (res.status) {
						let options = {
							msg: res.message,
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
						this.getData()
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				})
			},
			cancel (item) {
				let form = deepCopy(item)
				// form['wbPrefix'] = form.wbNum.split('-')[0]
				// form['wbNo'] = form.wbNum.split('-')[1]
				// form['wbNum'] = form.num
				this.$loading('加载中')
				transitCancel(form).then(res => {
					if (res.status) {
						let options = {
							msg: res.message,
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
						this.getData()
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				})
			},
			vehicle (item) {
				let form = deepCopy(item)
				uni.showLoading({title: '正在跳转到uld配载界面'})
				setTimeout(() => {
					uni.hideLoading()
					uni.navigateTo({
					    url: `/pages/departure/uld/uld?wbPrefix=${item.wbPrefix}&wbNo=${item.wbNo}`
					})
				}, 200)
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
				console.log(tableName, col, index)
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
					let valueWidth = 50 * value.length
					let width = scale
					console.log(value, valueWidth, scale)
					if (valueWidth - width >= 0) {
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
		.uni-icon {
			position: absolute;
			right: 0;
			z-index: 999;
			/* #ifdef APP-PLUS */
			top: 50%;
			transform: translateY(-50%);
			/* #endif */
		}
		.clearInput {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			// padding-right: 20upx;
			icon {
				z-index: 999;
				// display: initial;
				position: absolute;
				right: 0;
				/* #ifdef APP-PLUS */
				top: 50%;
				transform: translateY(-50%);
				/* #endif */
			}
			input {
				text-align: center;
				margin-left: 0upx;
				display: inline-block;
				font-size: 35upx;
				// border: solid 5upx #dbdbdb;
				border-radius: 5upx;
				height: 94upx;
				width: calc(100% - 30upx);
			}
		}
		.contend-list {
			margin-left: 20upx;
		}
		.fixed {
			display: flex;
			justify-content: flex-start;
			.left {
				border-right:  3upx solid #e5e5e5;
				width: 300upx;
				/* #ifdef APP-PLUS */
				width: 800upx;
				/* #endif */
				// padding: 30upx 20upx 20upx 20upx;
				.head {
					padding: 30upx 20upx 20upx 20upx;
					border-bottom: 3upx solid #e5e5e5;
					>text {
						font-size: 35upx;
						width: 200rpx;
						display: inline-block;
						text-align: center;
					}
				}
				.pei {
					font-size: 36upx;
					color: #1890ff;
					display: inline-block;
					margin-left: 40upx;
				}
				.cancel {
					font-size: 36upx;
					color: #0ebf9c;
					display: inline-block;
					margin-left: 30upx;
				}
				
				.item-list {
					background: #FFFFFF;
					height: 100upx;
					border-bottom: 3upx solid #e5e5e5;
					>text {
						display: inline-block;
						font-size: 36upx;
						text-align: center;
						margin-top: 20upx;
						
					}
				}
				
			}
			.right {
				overflow-x: auto;
			}
			.list {
				background: #FFFFFF;
				>text {
					display: inline-block;
					text-align: center;
				}
				.item-list {
					width: 1700rpx;
					height: 100upx;
					&.out {
						width: 1500rpx;
					}
					.yun-text {
						display: inline-block;
						text-align: center;
						font-size: 36upx;
						overflow-x: auto;
						white-space:nowrap;
						position: relative;
						top: 22upx;
					}
					// display: flex;
					// justify-content: space-between;
					// flex-wrap: wrap;
					white-space:nowrap;
					border-top: 3upx solid #e5e5e5;
					font-size: 36upx;
					background: #FFFFFF;
					>text {
						position: relative;
						top: 0upx;
						text-align: center;
						display: inline-block;
					}
				}
				.head {
					border-bottom: 3upx solid #e5e5e5;
					>text {
						display: inline-block;
						text-align: center;
					}
					// display: flex;
					// justify-content: space-between;
					// flex-wrap: wrap;
					width: 1700rpx;
					&.out {
						width: 1500rpx;
					}
					white-space:nowrap;
					font-size: 35upx;
					padding: 30upx 20upx 20upx 20upx;
					background: #F7F7F7;
				}
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
					// cInput {
					// 	font-size: 35upx;
					// 	text-align: center;
					// 	border-left: 3upx solid #dbdbdb;
					// 	height: 94upx;
					// }
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
