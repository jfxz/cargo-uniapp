<template>
	<view class="flightEnq">
		<headBar name="航班动态"></headBar>
		<view class="top">
			<view class="flex">
				<view class="left">
					航班号
				</view>
				<view class="right">
					<input type="text"  @input="carrierChange" :value="form.carrier" placeholder="承运人"/>
					<input type="text" :focus="flightFocus" @input="flightChange" :value="form.flight" placeholder="航班号"/>
				</view>
			</view>
			<view class="flex">
				<view class="left">
					机位
				</view>
				<view class="right-input">
					<input type="text" @input="aircraChange" :value="form.aircraftLocation" placeholder="请输入机位"/>
				</view>
			</view>
		</view>
		<view class="mid">
			<view class="btn-flex">
				<button type="primary" @tap="resetData" id="btn1" plain="true">重置</button>
				<button type="primary" @tap="getData" id="btn2">筛选</button>
			</view>
		</view>
		<view class="flight">
			<view class="circle">航</view>
			<text>航班列表</text>
		</view>
		<view class="list">
			<view class="left">
				<view class="head">
					<text style="width: 150rpx">操作</text>
				</view>
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<text class="btn-class" @tap="hkJump(item)">航控登记</text>
				</view>
			</view>
			
			<view class="right">
				<view class="head">
					<text style="width: 150rpx;">承运人</text>
					<text style="width: 150rpx;">航班号</text>
					<text style="width: 150rpx;">机位</text>
					<text style="width: 180rpx;">航班状态</text>
					<text style="width: 300rpx;">降落时间</text>
				</view>
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<text style="width: 150rpx;">{{item.carrier}}</text>
					<text style="width: 150rpx;">{{item.flight}}</text>
					<text style="width: 150rpx">{{item.aircraftLocation}}</text>
					<text :style="{width: '180rpx',color: statusColor[item.flightStatus] || '#595959'}">{{item.flightStatus || ''}}</text>
					<text style="width:300rpx">{{item.arrTime || ''}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import {getFlight} from '@/common/api/flightDynamics/api.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		components: {
			headBar
		},
		data() {
			return {
				flightFocus: false,
				statusColor: {
					'途中': '#1890ff',
					'到达': '#52c41a',
					'延误': '#f5222d'
				},
				list: [],
				form: {
					carrier: '',
					flight: '',
					aircraftLocation: ''
				}
			}
		},
		// computed: {
		// 	halfWidth() {
		// 		return uni.upx2px(750 / 2) + 'px';
		// 	}
		// },
		computed: {
			...mapGetters(['dic'])
		},
		onLoad (params) {
		},
		mounted () {
			console.log(this.dic)
			// this.getData()
		},
		methods: {
			carrierChange (val) {
				this.form.carrier = val.detail.value.toLocaleUpperCase()
				this.flightFocus = false
				if (this.form.carrier.length === 2) {
					this.flightFocus = true
				}
			},
			flightChange (val) {
				this.form.flight = val.detail.value
			},
			aircraChange (val) {
				this.form.aircraftLocation = val.detail.value
			},
			formatTime (item) {
				let time = item.arrTimeActual || item.arrTimeEstimate || item.arrTimeSchedule
				if (time) {
					return dayjs(time).format('HH:mm')
				}
				return ''
			},
			hkJump (item) {
				this.$loading('正在跳转到航控登记')
				setTimeout(() => {
					uni.hideLoading()
					uni.navigateTo({
					    url: `/pages/arrival/controlRegister/controlRegister?flightDate=${item.flightDate}&carrier=${item.carrier}&flight=${item.flight}`
					})
				}, 200)
			},
			resetData () {
				this.form = {
					carrier: '',
					flight: '',
					aircraftLocation: ''
				}
				this.getData()
			},
			getData () {
				this.$loading('加载中')
				getFlight(this.form).then(res => {
					if (res.status) {
						this.list = res.data
					}
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}
	.flightEnq {
		.list {
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
					width: 1000rpx;
					text-align: center;
					border: solid 2upx #e5e5e5;
					/* position: sticky;
					top: 90px; */
					>text {
						display: block;
						text-align: center;
						font-size: 32upx;
					}
				}
				.list-item {
					width: 1000rpx;
					background: #ffffff;
					// padding: 30upx 0;
					height: 100rpx;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					border: solid 2upx #e5e5e5;
					>text {
						// height: 100rpx;
						line-height: 100rpx;
						display: block;
						text-align: center;
						font-size: 32upx;
					}
				}
			}
			.left {
				width: 300upx;
				/* #ifdef APP-PLUS */
				// width: 500upx;
				/* #endif */
				.head {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					padding: 30upx 0;
					border: solid 2upx #e5e5e5;
					>text {
						display: block;
						text-align: center;
						font-size: 32upx;
						width: 100%;
					}
				}
				.list-item {
					background: #ffffff;
					// padding: 30upx 0;
					height: 100rpx;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					border: solid 2upx #e5e5e5;
					top: 0px;
					.btn-class {
						color:#0ebf9c;
						line-height: 100rpx;
						text-align:center;
						width:100%;
						font-size: 35upx;
						font-weight: 500;
					}
					button {
						width: 150upx;
						padding: 0;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						color: #0ebf9c;
						font-size: 32upx;
						border: 0;
					}
				}
			}
		}
		.flight {
			background: #FFFFFF;
			padding: 30upx 60upx;
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
			}
		}
		.mid {
			.btn-flex {
				display: flex;
				justify-content: space-between;
				padding: 10upx 50upx 30upx 50upx;
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
					width: 140upx;
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
				.right-input {
					font-size: 35upx;
					border: 3upx solid #dbdbdb;
					width: 100%;
					>input {
						height: 94upx;
						padding-left: 20upx;
					}
				}
			}
			
		}
	}
</style>
