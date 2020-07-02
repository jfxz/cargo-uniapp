<template>
	<view class="tableForStock">
		<headBar :name="flag  ? '运单清仓异常表' : 'ULD清仓异常表'"></headBar>
		<view class="reweightContent" style="padding-top:0;padding-bottom: 0;margin-top:120upx;">
			<view class="head" style="border-top:0;">
				<text>入库时间</text>
			</view>
			<view class="list-item">
				<view class="flight">
					<view class="circle out">从</view>
				</view>
				<view @click="dateShow('start')" class="flex-date">
					<!-- <picker mode="datetime" :value="form.from" @change="dateChangeFrom"> -->
					<view style="font-size:35upx;">{{form.from}}</view>
					<!-- </picker> -->
				</view>
			</view>
			<view class="list-item">
				<view class="flight">
					<view class="circle ">到</view>
				</view>
				<!-- <picker mode="date" :value="form.end" @change="dateChangeEnd"> -->
				<view @click="dateShow('end')" class="flex-date">
					<view style="font-size:35upx;">{{form.end}}</view>
				</view>
				<!-- </picker> -->
			</view>
		</view>
		<view class="reweightContent bottom buttom">
			<view class="content bottom">
				<button class="weightBottom short short2" @click="clearInfo" plain="true">清空</button>
				<button class="weightBottom short delete" @click="getData" plain="true">查询</button>
			</view>
		</view>
		<view v-show="listFlag">
			<view class="tab-class">
				<view class="lableWidth long bold thin" style="margin-right: 30upx;width: 100%;">{{flag ? '出港清单异常表(运单)' : '出港清单异常表(ULD)'}}</view>
				<view v-if="!flag" class="lableWidth long bold thin" style="margin-right: 30upx;width: 100%;">
					{{ ' 总数: ' }} <text style="color: #0ebf9c;">{{totalNum}}</text>
					{{ ' 已盘点: ' }} <text style="color: #0ebf9c;">{{checkedNum}}</text>
					{{ ' 未盘点: ' }} <text style="color: #0ebf9c;">{{unCheckedNum}}</text>
				</view>
			</view>
			<view class="table" style="overflow:scroll;display: -webkit-box;overflow-x: scroll;-webkit-overflow-scrolling: touch;">
				<view class="reweightContent" :style="[{padding: '10px 10px', width: flag ? '1800px' : '1800px'}]">
					<view v-if="flag" class="head list" style="border:0;">
						<text>运单号</text>
						<text>总件数</text>
						<text>航班号</text>
						<text>航班日期</text>
						<text>目的地</text>
						<text>代理</text>
						<text>总重量</text>
						<text>总体积</text>
						<text>库位</text>
						<text>库位件数</text>
						<text>库存重量</text>
						<text>库存体积</text>
						<text>是否清仓</text>
						<text>备注(处理)</text>
						<text>异常信息备注</text>
					</view>
					<view v-else class="head list" style="border:0;">
						<text>ULD号</text>
						<text>航班号</text>
						<text>ULD件数</text>
						<text>ULD重量</text>
						<text>ULD体积</text>
						<text>仓库</text>
						<text>库位</text>
						<text>配载状态</text>
						<text>盘点状态</text>
						<text>盘点时间</text>
						<text>盘点人姓名</text>
						<text>是否清仓</text>
						<text>备注(处理)</text>
						<text>备注(异常)</text>
					</view>
					<view v-if="flag">
						<view class="list-item center" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
							<!-- 	<text class="yun-text" @touchmove="tapStart(index)" @touchend="tapEnd" v-if="tapCurrentIndex === index || judgeScroll(item.yunNum, index)">
						</text>
						<scroll v-else class="yun-text" @click="tapStart(index)" color="#595959" font="32rpx" :text="item.yunNum"></scroll> -->
							<text>{{item.wbPrefix +'-'+ item.wbNo }}</text>
							<text>{{ item.wbNum }}</text>
							<text>{{item.carrier? (item.carrier + item.flight) : '-'}}</text>
							<text>{{item.flightDate ? format(item.flightDate, 'date') : '-'}}</text>
							<text>{{item.destination ? item.destination :'-'}}</text>
							<text>{{item.financeCode ? item.financeCode :'-'}}</text>
							<text>{{item.weight}}</text>
							<text>{{item.wbVol}}</text>
							<text>{{item.meta.locationCode}}</text>
							<text>{{item.meta.num}}</text>
							<text>{{item.meta.mgt}}</text>
							<text>{{ item.meta.vol }}</text>
							<text>{{item.meta ? (item.meta.isClear === '1' ? '已清仓' : '未清仓' ): '-'}}</text>
							<text>{{item.remark ? item.remark : '-'}}</text>
							<text>{{ item.exceptionMsg ?  item.exceptionMsg : '-'}}</text>
						</view>
					</view>
					<view v-else>
						<view class="list-item center" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
							<text>{{item.ULD_TYPE + item.ULD_NO + item.ULD_NO_SUFFIX  }}</text>
							<text>{{item.CARRIER? (item.CARRIER + item.FLIGHT ): '-'}}</text>							
							<text>{{item.ULD_NUM}}</text>
							<text>{{item.ULD_WGT}}</text>
							<text>{{item.ULD_VOL}}</text>
							<text>{{item.WAREHOUSE_CODE ? item.WAREHOUSE_CODE :'-'}}</text>
							<text>{{item.LOCATION_CODE ? item.LOCATION_CODE :'-'}}</text>
							<text>{{item.IS_ULD_LOAD ? item.IS_ULD_LOAD :'-'}}</text>
							<!-- 盘点信息 -->
							<text>{{item.CHECK_ULD ? item.CHECK_ULD :'-'}}</text>
							<text>{{item.CHECK_TIME ? format(item.CHECK_TIME, 'dataTime') : '-'}}</text>
							<text>{{item.CHECK_USER ? item.CHECK_USER :'-'}}</text>
							<!-- 其他信息 -->
							<text>{{item.IS_ULD_CLEAR ? item.IS_ULD_CLEAR : '-'}}</text>
							<text>{{item.REMARK ? item.REMARK : '-'}}</text>
							<text>{{item.EXCEPTION ? item.EXCEPTION : '-'}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<tui-datetime ref="dateTime" :type="1" cancelColor="#888" color="#5677fc" :setDateTime="setDateTime" @confirm="dateChange"></tui-datetime>
	</view>
</template>

<script>
	import tabNew from '@/components/tab.vue'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import scroll from '@/components/notice-bar/uni-notice-bar.vue'
	import tuiDatetime from "@/components/dateTime/dateTime"
	import dayjs from '@/common/util/dayjs.min.js'
	import {
		getExceptionWayBill,
		getUldException
	} from '@/common/api/departure/stock/stockApi.js'
	export default {
		components: {
			tabNew,
			headBar,
			tuiDatetime,
			scroll
		},
		data() {
			return {
				// totalNum总数，checkedNum已盘点，unCheckedNum未盘点
				totalNum: 0,
				checkedNum: 0,
				unCheckedNum: 0,
				setDateTime: dayjs().second(0).minute(0).hour(0).format('YYYY-MM-DD HH:mm'),
				flagDate: '',
				flag: true,
				form: {
					// from: dayjs('2018-03-01 17:00').format('YYYY-MM-DD HH:mm'),
					// end: dayjs('2018-03-01 17:00').format('YYYY-MM-DD HH:mm')
					from: dayjs().second(0).minute(0).hour(0).format('YYYY-MM-DD HH:mm'),
					end: dayjs().add(1, 'day').second(0).minute(0).hour(0).format('YYYY-MM-DD HH:mm')
				},
				listHeight: '',
				tapCurrentIndex: -1,
				list: []
			}
		},
		mounted() {
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
		onLoad(options) {
			this.flag = JSON.parse(options.index)
		},
		computed: {
			flagClass() {
				let style = [{
					padding: `20upx 20upx`,
					width: `${this.flag ? 2000 : 1000}upx`
				}]
				return style
			},
			listFlag() {
				return this.list.length > 0
			},
		},
		methods: {
			format(val, type) {
				if (!!val) {
					if (type === 'date') {
						return dayjs(val).format('YYYY-MM-DD')
					} else if (type === 'dataTime') {
						return dayjs(val).format('YYYY-MM-DD hh:mm:ss')
					}
					return dayjs(val).format('YYYY-MM-DD hh:mm')
				}
				return '-'
			},
			getData() { // 查询信息
				let row = {
					from: dayjs(this.form.from).valueOf(),
					end: dayjs(this.form.end).valueOf()
				}
				this.$loading('')
				let handle = this.flag ? getExceptionWayBill : getUldException
				handle(row).then(res => {
					uni.hideLoading();
					if ((res.data.length > 0) || (res.data.resultList.length > 0)) {
						if (this.flag) {
							this.list = res.data
						} else {
							this.totalNum = res.data.totalNum
							this.checkedNum = res.data.checkedNum
							this.unCheckedNum = res.data.unCheckedNum
							this.list = res.data.resultList
						}
					} else {
						this.$message('未查询到需要的信息，请确认查询条件是否有误')
					}
				}).catch(res => {
					uni.hideLoading()
					this.$message('未查询到需要的信息，请确认查询条件是否有误')
				})
			},
			clearInfo() { // 清空信息
				this.form = {
					from: dayjs().second(0).minute(0).hour(0).format('YYYY-MM-DD HH:mm'),
					end: dayjs().add(1, 'day').second(0).minute(0).hour(0).format('YYYY-MM-DD HH:mm')
				}
				this.list = []
				this.$message('已清空数据信息')
			},
			dateChangeFrom(val) {
				this.form.from = val.detail.value
			},
			dateChangeEnd(val) {
				this.form.end = val.detail.value
			},
			dateChange(val) { // 选择时间节点
				this.flagDate === 'start' ? this.form.from = val.result : this.form.end = val.result
				this.setDateTime = val.result
			},
			dateShow(flag) { // 显示时间选择框
				this.flagDate = flag === 'start' ? 'start' : 'end'
				this.$refs.dateTime.show()
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
	.yun-text {
		display: block;
		width: 30%;
		text-align: center;
		font-size: 32upx;
		overflow-x: auto;
	}

	.reweightInput {
		text-align: center;
		line-height: 70upx;
		border: solid 5upx #dbdbdb;
		width: 160upx;
		// width:20%;
		height: 80upx;

		&.bold {
			font-weight: bold;
		}

		&.short {
			width: 139upx;
		}

		&.long {
			width: 400upx;
		}

		&.tiny {
			width: 119upx;
		}

		&.267 {
			width: 267upx;
		}

		&.disable {
			background: #dbdbdb;
		}

		&.reduceLeft {
			margin-left: 0;
			border-left: 0;
		}
	}

	.weightBottom {
		width: 100%;
		vertical-align: center;
		color: #595959;
		border-radius: 10upx;
		border: solid 1px #0ebf9c;

		&.short {
			width: 40%;
			background-color: #0ebf9c;
			color: white;
			border: solid 1px #0ebf9c;
		}

		&.short2 {
			color: #0ebf9c;
			background-color: white;
			border: solid 1px #0ebf9c;
		}
	}

	.flight {
		padding: 0 60upx;

		// margin-top: 20upx;
		>text {
			font-size: 36upx;
			color: #595959;
			font-weight: bold;
			margin-left: 20upx;
		}

		.circle {
			width: 50upx;
			height: 50upx;
			border-radius: 10upx;
			background: #fdb332;
			text-align: center;
			line-height: 50upx;
			color: #ffffff;
			font-size: 33upx;
			display: inline-block;

			&.out {
				background: #0ebf9c;
			}
		}
	}

	.lableWidth {
		width: 150upx;
		font-size: 35upx;
		line-height: 80upx;
		padding: 0 0 0 30upx;

		&.long {
			width: 250upx;
		}

		&.bold {
			font-size: 35upx;
			color: #595959;
			font-weight: bold;
		}

		&.thin {
			line-height: 60upx;
		}
		&.small {
			padding: 0;
			font-size: 30upx;
		}
	}

	.tableForStock {
		.title-tableForStock {
			position: fixed;
			top: 100upx;
			width: 100%;
			z-index: 10;
		}

		.tab-class {
			margin-top: 10upx;
		}

		.reweightContent {
			display: flex;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx 10upx;
			color: #595959;
			padding: 30upx 0;

			&.bottom {
				font-size: 25upx;
				padding: 20upx 0;
				background-color: #f4f5f6;

				.content {
					font-size: 25upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					&.bottom {
						margin: 0;
					}
				}

				.bottomButtom {
					margin: auto;
					margin-top: 20upx;
					width: 90%;
				}
			}

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
