<template>
	<view class="flight">
		<headBar name="航班查询"></headBar>
		<msg-tip ref="toast"></msg-tip>
		<view class="top">
      <view class="row">
        <text class="lableWidth">航班号</text>
        <input class="flight-input" :value="form.carrier" @input="carrierChange" maxlength="2" />
        <input class="flight-input" style="margin-left: 0;border-left: 0;" @input="flightChange" v-model="form.flight" maxlength="4" />
      </view>
			<view class="row2"> 
				<text class="lableWidth">装载截关</text>
				<axb-check-box ref="radio1" class="radio-left" :list="defaultArray" @change="radioChangeType1"></axb-check-box>
			</view>
			<view class="row2">
				<text class="lableWidth">复称截关</text>
				<axb-check-box ref="radio2" class="radio-left"  :list="defaultArray" @change="radioChangeType2"></axb-check-box>
			</view>
			<view class="row2">
				<text class="lableWidth">DLS截关</text>
				<axb-check-box ref="radio3" class="radio-left"  :list="defaultArray" @change="radioChangeType3"></axb-check-box>
			</view>
		</view>
		<view class="btn">
			<button type="primary" plain="true" @click="reset" >重置</button>
			<button type="primary" class="bottom-green-background" @click="getData">筛选</button>
		</view>
		<view class="middle-text">
			<text class="circle">{{'航'}}</text>
			<text class="lableWidth">航班列表</text>
		</view>
		<view class="bottom">
			<view class="left">
				<view class="head">
					<text style="width: 150rpx">操作</text>
				</view>
				<view class="list-item" :class="[(item.isFlightClose === '1') ? 'backgroungBlue': '']" v-for="(item, index) in list" :key="index">
					<button type="primary" v-show="item.isFlightClose !== '1'"  @click="close(item)" plain="true">关闭</button>
					<button type="primary" v-show="item.isFlightClose === '1'" plain="true"></button>
				</view>
			</view>
			<view class="right">
				<view class="head">
					<text style="width: 100rpx;">承运人</text>
					<text style="width: 120rpx;">航班号</text>
					<text style="width: 250rpx;">航线</text>
					<text style="width: 350rpx;">落地时间</text>
					<text style="width: 350rpx;">起飞时间</text>
					<text style="width: 350rpx;">装载截关</text>
					<text style="width: 350rpx;">复称截关</text>
					<text style="width: 350rpx;">DLS截关</text>
				</view>
				<view class="list-item" :class="[isClose(item)? 'backgroungBlue': '']" v-for="(item, index) in list" :key="index">
					<text style="width: 100rpx;">{{item.carrier}}</text>
					<text style="width: 120rpx;">{{item.flight}}</text>
					<text style="width: 250rpx;">{{item.flightLine}}</text>
					
					<text style="width: 350rpx;" :class="[(item.flightStatus === '到达') ? 'green' : ((item.flightStatus === '途中') ? 'blue' : '')]">{{item.arrTime}}</text>
					<text style="width: 350rpx;" :class="[(item.flightStatus === '起飞') ? 'green' : ((item.flightStatus === '延迟' || item.flightStatus === '延误') ? 'blue' : '')]">{{item.depTime}}</text>
					<text style="width: 350rpx;" :class="[(item.loadOffDelayTime < 0) ? 'red': '']">{{format(item.loadOffTime)}}</text>
					<text style="width: 350rpx;" :class="[(item.reweighDelayTime < 0) ? 'red': '']">{{format(item.reweighOffTime)}}</text>
					<text style="width: 350rpx;" :class="[(item.dlsDelayTime < 0) ? 'red': '']">{{format(item.dlsOffTime)}}</text>
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="content"></tui-modal>
<!-- 		<view class="load-progress" :class="loadProgress!=0?'show':'hide'" :style="[{top:CustomBar+'px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-loadProgress) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view> -->
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import axbCheckBox from '@/components/axb-checkbox/axb-checkbox.vue'
	import {getFlightInfo, closeFlight} from  '@/common/api/departure/flight/flight.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import tuiModal from "@/components/modal"
	import msgTip from '@/components/tip/tip.vue'
	export default {
		components: {
			headBar,axbCheckBox,tuiModal,msgTip
		},
		data() {
			return {
				scrollTop: 0,
				content: '',
				rowSelected: null,
				modal: false,
				defaultArray: [{name: '已截关', value: 'pass', check: 0}, {name: '未截关', value: 'close', check: 0}],
				form: {
					isOffTime: '',
					isReweighOff: '',
					isDlsOff: '',
          carrier: '',
          flight: '',
				},
				CustomBar: this.CustomBar,
				loadProgress: 0,
				list: []
			}
		},
		computed: {
			...mapGetters(['dic'])
		},
		/* onPageScroll(e) {
			console.log(e.scrollTop)
			this.scrollTop = e.scrollTop
		}, */
		methods: {
      carrierChange(val) { // 承运人
      	this.form.carrier = val.detail.value.toLocaleUpperCase()
      },
      flightChange (val) {
        this.form.flight = val.detail.value.toLocaleUpperCase()
      },
			isClose (item) {
				return item.isFlightClose === '1'
			},
			hide () {
				this.modal = false
			},
			handleClick (e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					closeFlight({flightId: this.rowSelected.id}).then(res => {
						if (res.status) {
							let options = {
								msg: '关闭成功',
								duration: 2000,
								type: 'green'
							};
							this.getData()
							this.$refs.toast.showTips(options)
						} else {
							this.$message(res.message)
						}
						this.modal = false
					})
				}
			},
			format (val) {
				return val || ''
			},
			radioChangeType1 (val) {
				console.log(val) // 单选时 返回选中项的value, 反选返回null
				if (val === 'pass') {
					this.form.isOffTime = '1'
				} else if (val === 'close') {
					this.form.isOffTime = '0'
				} else {
					this.form.isOffTime = ''
				}
			},
			radioChangeType2 (val) {
				console.log(val) // 单选时 返回选中项的value, 反选返回null
				if (val === 'pass') {
					this.form.isReweighOff = '1'
				} else if (val === 'close') {
					this.form.isReweighOff = '0'
				} else {
					this.form.isReweighOff = ''
				}
			},
			radioChangeType3 (val) {
				console.log(val) // 单选时 返回选中项的value, 反选返回null
				if (val === 'pass') {
					this.form.isDlsOff = '1'
				} else if (val === 'close') {
					this.form.isDlsOff = '0'
				} else {
					this.form.isDlsOff = ''
				}
			},
			reset () {
				this.$refs.radio1.reset()
				this.$refs.radio2.reset()
				this.$refs.radio3.reset()
				this.form = {
          isOffTime: '',
          isReweighOff: '',
          isDlsOff: '',
          carrier: '',
          flight: '',
				}
			},
			getData () {
				this.$loading('加载中')
				getFlightInfo(this.form).then(res => {
					if (res.status) {
						this.list = res.data
						if (this.list.length === 0) {
							this.$message('当前查询数据为空')
						}
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
					console.log(res)
				})
			},
			close (val) {
				this.rowSelected = val
				this.content = '确认关闭航班' + this.rowSelected.carrier + this.rowSelected.flight + '(' + dayjs(this.rowSelected.flightDate).format('YYYY-MM-DD') + ')吗？'
				console.log(this.content)
				this.modal = true
			}
		}
	}
</script>

<style lang="scss">
page {
	padding-top: 140upx;
}
.flight {
	.backgroungBlue {
		background: #00BFFF !important;
	}
	.red {
		background: #FF8888 !important;
	}
	.green {
		color: green;
	}
	.blue {
		color: blue;
	}
	.lableWidth {
		width: 150upx;
		height: 90upx;
		line-height: 90upx;
		padding: 0 0 0 30upx;
		font-size: 35upx;
	}
	.btn {
		display: flex;
		flex-direction: row;
		margin-top: 30upx;
		button {
			width: 42%;
			color: #0ebf9c;
			font-size: 35upx;
			border:1px solid #0ebf9c
		}
    .bottom-green-background {
      color: #FFFFFF;
      background-color: #0ebf9c;
    }
	}
	.top {
		display: flex;
		font-size: 35upx;
		background: #ffffff;
		flex-direction: column;
		margin-top: 10upx;
		color: #595959;
		padding: 30upx 0;
		border: solid 2upx #e5e5e5;
		.row {
			display: flex;
			flex-direction: row;
			.radio-left {
				padding-left: 30upx;
			}
      
      .flight-input {
      	font-size: 35upx;
      	text-align: center;
      	border: solid 3upx #dbdbdb;
      	width: 265upx;
      	height: 94upx;
      }
		}
		.row2 {
			display: flex;
			flex-direction: row;
			margin-top: 20upx;
			.radio-left {
				padding-left: 30upx;
			}
		}
	}
	.middle-text {
		background: #ffffff;
		display: flex;
		flex-direction: row;
		margin-top: 30upx;
		font-weight: bold;
		padding-left: 30upx;
		.circle {
			width: 50upx;
			height: 50upx;
			border-radius: 25upx;
			background: #fdb332;
			text-align: center;
			line-height: 50upx;
			color: #FFFFFF;
			margin-top: 20upx;
			font-size: 33upx;
			display: inline-block;
		}
	}
	.bottom {
		color: #595959;
		display: flex;
		justify-content: flex-start;
		.right {
			overflow-x: auto;
			overflow-y: hidden;
			.head {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 0;
				width: 2450upx;
				text-align: center;
				border: solid 2upx #e5e5e5;
				/* &.stick {
					position: absolute;
					top: calc(var(--status-bar-height) + var(--status-bar-height));
				} */
				>text {
					display: block;
					text-align: center;
					font-size: 32upx;
				}
			}
			.list-item {
				width: 2450upx;
				background: #ffffff;
				// padding: 30upx 0;
				height: 130upx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 2upx #e5e5e5;
				>text {
					// height: 130upx;
					line-height: 130upx;
					display: block;
					text-align: center;
					font-size: 32upx;
				}
			}
		}
		.left {
			width: 300upx;
			/* #ifdef APP-PLUS */
			width: 500upx;
			/* #endif */
			.head {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 0;
				border: solid 2upx #e5e5e5;
				/* &.stick {
					position: absolute;
					top: calc(var(--status-bar-height) + var(--status-bar-height));
				} */
				>text {
					display: block;
					text-align: center;
					font-size: 32upx;
				}
			}
			.list-item {
				background: #ffffff;
				// padding: 30upx 0;
				height: 130upx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 2upx #e5e5e5;
				button {
					width: 150upx;
					padding: 0;
					height: 130upx;
					line-height: 130upx;
					text-align: center;
					color: #0ebf9c;
					font-size: 32upx;
					border: 0;
				}
			}
		}
	}
}
</style>
