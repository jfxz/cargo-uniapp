<template>
	<view>
		<msg-tip ref="toast"></msg-tip>
		<view class="waybill">
			<view class="uld-msg">
				<view class="title">
					<text>ULD信息</text>
				</view>
				<view class="contend">
					<view class="flex-class" style="margin-bottom: 10rpx;">
						<text>航班</text>
						<view class="right">
							<input :disabled="editFlag" class="input-num left" @blur="getEndOpt" @input="carrierChange" :value="form.carrier"/>
							<input :disabled="editFlag" :focus="flightFocus" class="input-num right" @blur="getEndOpt" @input="flightChange" :value="form.flight"/>
						</view>
					</view>
					
					<view class="flex-class date">
						<text>航班日期</text>
						<view class="right">
							<picker :disabled="editFlag" mode="date" :value="form.date" @change="dateChange">
								<view class="uni-input">{{form.date}}</view>
							</picker>
						</view>
					</view>
			
					<view class="flex-class">
						<text>起止站</text>
						<view class="right start">
							<input :disabled="editFlag" class="input-num left" @input="startChange" :value="form.start"/>
							<picker :disabled="editFlag" @change="endChange" style="width: 50%" :value="index" :range="endArray">
								<view class="uni-input pick">{{endArray[index]}}</view>
							</picker>
							<!-- <input class="input-num right" :value="form.end"/> -->
						</view>
					</view>
					<view class="btn">
						<button :disabled="editFlag" type="primary" plain="true" @click="save">保存</button>
					</view>
				</view>
			</view>
		<view class="waibill-msg">
			<view class="title">
				<text>运单信息</text>
			</view>
			<view class="contend">
				<view class="left">
					<text>检查项目</text>
				</view>
				<view class="right">
					<checkbox-group style="display: flex;transform:scale(0.9);justify-content: space-between;">
						<view class="check-item">
							<checkbox value="pin" disabled checked="true" />
							<text>品名</text>
						</view>
						<view class="check-item">
							<checkbox value="bao" disabled checked="true" />
							<text>包装</text>
						</view>
						<view class="check-item">
							<checkbox value="jian" disabled checked="true" />
							<text>件数</text>
						</view>
						<view class="check-item">
							<checkbox value="zhong" disabled :checked="uldForm.istransit === '1'" />
							<text>中转</text>
						</view>
					</checkbox-group>
				</view>
				<view class="flex">
					<view class="item">
						<text class="top left">始发站</text>
						<text class="bottom left">{{judgeNull(uldForm.origin)}}</text>
					</view>
					<view class="item">
						<text class="top mid">中转站</text>
						<text class="bottom mid">{{judgeNull(uldForm.transitAirport)}}</text>
					</view>
					<view class="item">
						<text class="top right">目的地</text>
						<text class="bottom right">{{judgeNull(uldForm.destination)}}</text>
					</view>
				</view>
				
				<view class="flex">
					<view class="item">
						<text class="top left">交货代理人</text>
						<text class="bottom left">{{judgeNull(uldForm.proxy)}}</text>
					</view>
					<view class="item">
						<text class="top right">货物品名</text>
						<text class="bottom right">{{judgeNull(uldForm.cargoName)}}</text>
					</view>
				</view>
				
				<view class="flex">
					<view class="item">
						<text class="top left">航班号</text>
						<text class="bottom left">{{judgeNull(uldForm.flight)}}</text>
					</view>
					<view class="item">
						<text class="top right">航班日期</text>
						<text class="bottom right">{{formatDate(uldForm.flightDate)}}</text>
					</view>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>
<script>
	import { mapGetters } from 'vuex'
	import msgTip from '@/components/tip/tip.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import {validatenull} from '@/common/util/validate.js'
	import {getUld, getEnd} from '@/common/api/weight/api.js'
	export default {
		components: {
			msgTip
		},
		data() {
			return {
				flightFocus: false,
				editFlag: false,
				index: -1,
				endArray: [],
				form: {
					start: 'XMN',
					end: '',
					carrier: '',
					flight: '',
					date: ''
					// date: dayjs().format('YYYY-MM-DD')
				},
				uldForm: {
					istransit: '',
					origin: '',
					transitAirport: '',
					destination: '',
					carrier: '',
					flight: '',
					proxy: '',
					cargoName: '',
					flightDate: ''
				}
			}
		},
		computed: {
			...mapGetters(['dic'])
		},
		onReady () {
			let uldInfo = getApp().globalData.uldForm
			let wbInfo = getApp().globalData.wbForm
			if (!validatenull(uldInfo)) {
				if (uldInfo.uldStatus) {
					let match = this.dic.uldType_dic.find(item =>  item.TYPECODE === uldInfo.uldStatus)
					if (match.TYPENAME === '正常状态' || match.TYPENAME === '装货状态') {
						this.editFlag = false
					} else {
						this.editFlag = true
					}
				}
				if (uldInfo.carrier) {
					this.form.carrier = uldInfo.carrier
				} else {
					if (wbInfo && wbInfo.wbCarrier) {
						this.form.carrier = wbInfo.wbCarrier
					}
				}
				
				if (uldInfo.uldFlight) {
					this.form.flight = uldInfo.uldFlight
				} else {
					if (wbInfo && wbInfo.wbFlight) {
						this.form.flight = wbInfo.wbFlight
					}
				}
				
				if (uldInfo.uldFlightDate) {
					this.form.date = dayjs(uldInfo.uldFlightDate).format('YYYY-MM-DD')
				} else {
					if (wbInfo && wbInfo.wbFlightDate) {
						this.form.date = dayjs(wbInfo.wbFlightDate).format('YYYY-MM-DD')
					}
				}
			}
			if (!validatenull(wbInfo)) {
				this.uldForm = {...wbInfo}
			}
			if (!validatenull(uldInfo) && !validatenull(wbInfo) && uldInfo.uldDestination && 
			wbInfo.wbDestination && uldInfo.uldDestination !== wbInfo.wbDestination) {
						console.log('uldInfo', uldInfo)
						console.log('wbInfo', wbInfo)
						this.$message('航班目的站和运单的目的站不一致')
			}
			this.getEndOpt()
			console.log('uldInfo', uldInfo)
			console.log('wbInfo', wbInfo)
		},
		methods: {
			judgeNull (val) {
				if (!val) {
					return ''
				}
				return val
			},
			formatDate (date) {
				if (date) {
					return dayjs(date).format('YYYY-MM-DD')
				}
				return ''
			},
			getEndOpt () {
				if (this.form.carrier && this.form.flight && this.form.date) {
					let para = {
						carrier: this.form.carrier,
						flight : this.form.flight,
						flightDate: dayjs(this.form.date).valueOf()
					}
					getEnd(para).then(res => {
						this.endArray = res.data.map(item => item.STATIONS)
						this.index = 0
						this.form.end = this.endArray[this.index]
					})
				}
			},
			carrierChange (val) {
				this.flightFocus = false
				this.form.carrier = val.detail.value.toLocaleUpperCase()
				if (this.form.carrier.length === 2) {
					this.flightFocus = true
				}
			},
			startChange (val) {
				this.form.start = val.detail.value
			},
			flightChange (val) {
				this.form.flight = val.detail.value
			},
			save () {
				console.log(!validatenull(getApp().globalData.uldForm), this.form.flight, this.form.carrier, this.form.date, this.form.start, this.form.end)
				if (!validatenull(getApp().globalData.uldForm) && this.form.flight && this.form.carrier
					&& this.form.date && this.form.start && this.form.end) {
						this.$loading('提交保存中')
						let form = getApp().globalData.uldForm
						let para = {
							uldId: form.uldid,
							flghtDate: this.form.date,
							carrier: this.form.carrier,
							flight: this.form.flight,
							packMan: form.packmancode,
							uldWeight: form.uldWeight,
							loadVol: form.zhengwbVol,
							shapeCode: form.banJia1,
							origin:  this.form.start,
							destination:  this.form.end,
							remark : form.remark
						}
						getUld(para).then(res => {
							let options = {
								msg: res.message,
								duration: 2000,
								type: 'green'
							}
							uni.hideLoading()
							this.$refs.toast.showTips(options)
						})
					}
			},
			endChange (val) {
				if (val.target.value === '-1') {
					this.index = 0
				} else {
					this.index = Number(val.target.value)
				}
				this.form.end = this.endArray[val.detail.value]
			},
			dateChange (val) {
				this.form.date = val.detail.value
				this.getEndOpt()
			}
		}
	}
</script>

<style lang="scss" scoped>
.waybill {
	.flex-class {
		display: flex;
		justify-content: flex-end;
		margin-bottom:20rpx;
		// &.date {
		// 	margin-bottom: 20upx;
		// }
		>text {
			display: block;
			font-size: 35upx;
			color: #595959;
			position: relative;
			top: 20upx;
			right: 20upx;
		}
		.right {
			picker {
				height: 84upx;
			}
			&.start {
				display: flex;
				justify-content: flex-start;
			}
			// margin-left: 30upx;
		}
	}
	.waibill-msg {
		.flex {
			display: flex;
			justify-content: space-between;
			margin-top: 20upx;
			.item {
				font-size: 35upx;
				width: 50%;
				.top {
					display: block;
					color: #999999;
					width: 100%;
					&.left {
						text-align: left;
					}
					&.mid {
						text-align: center;
					}
					&.right {
						text-align: right;
					}
				}
				.bottom {
					display: block;
					color: #595959;
					width: 100%;
					&.left {
						text-align: left;
					}
					&.mid {
						text-align: center;
					}
					&.right {
						text-align: right;
					}
				}
			}
		}
		.contend {
			padding: 0 30upx;
			.check-item {
				width: 30%;
				font-size: 35upx;
				margin-right: 18upx;
				>text {
					position: relative;
					top: 5upx;
				}
			}
			.left {
				width: 20%;
				display: inline-block;
				font-size: 35upx;
			}
			.right {
				width: 80%;
				display: inline-block;
			}
		}
		.title {
			padding: 10upx;
			font-size: 35upx;
			font-weight: bold;
			color: #595959;
			// line-height: 80upx;
			background: #F7F7F7;
			padding-bottom: 10upx;
		}
	}
	.uld-msg {
		.btn {
			/* position: relative;
			top: 20upx; */
			margin-top: 20upx;
			button {
				display: block;
				color: #0ebf9c;
				border:1px solid #0ebf9c
			}
		}
		.contend {
			padding: 20upx;
		}
		.title {
			padding: 0upx 10upx;
			font-size: 35upx;
			font-weight: bold;
			color: #595959;
			background: #F7F7F7;
			margin-top: -30upx;
			// padding-bottom: 10upx;
		}
		.left {
			width: 30%;
			text-align: right;
			display: block;
			font-size: 35upx;
			color: #595959;
			>text {
				position: relative;
				top: -35upx;
				right: 30upx;
				&.startEnd {
					top: 45upx;
				}
			}
		}
		.right {
			display: inline-block;
			width: 75%;
			.uni-input {
				width: 100%;
				text-align: center;
				// margin-left: 40upx;
				display: inline-block;
				font-size: 35upx;
				border: solid 5upx #dbdbdb;
				border-radius: 5upx;
				height: 84upx;
				line-height: 84upx;
				padding: 0;
				&.pick {
					border-left: 0;
				}
			}
			.input-num {
				text-align: center;
				// margin-left: 40upx;
				display: inline-block;
				font-size: 35upx;
				border: solid 5upx #dbdbdb;
				border-radius: 5upx;
				height: 84upx;
				&.left {
					width: 50%;
				}
				&.right {
					width: 50%;
					border-left: 0;
				}
				&.disable {
					background: #999999;
				}
			}
		}
	}
}
</style>
