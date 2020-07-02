<template>
	<view class="reweightClass">
		<msg-tip ref="toast"></msg-tip>
		<!-- 查询条件 -->
		<view class="reweightContent middle bottom">
			<view class="middle-data">
				<text class="lableWidth right">航班号</text>
				<input class="reweightInput" @input="carrierChange" :value="form.carrier" maxlength="3" style="width:30%;" />
				<input class="reweightInput" :focus="flightFocus" v-model="form.flight" maxlength="4" type="number" style="margin-left: 0;border-left: 0;width:30%;" />
			</view>
			<view class="middle-data">
				<text class="lableWidth right">航班日期</text>
				<picker mode="date" :value="form.flightDate" class="flex-date" @change="dateChange">
					<view class="reweightInput left" style="width:210%;">{{form.flightDate}}</view>
				</picker>
			</view>
			<view class="content bottom" style="margin-top:20upx;">
				<button class="weightBottom short" plain="true" @click="clearInfo">清空</button>
				<button class="weightBottom short" plain="true" @click="pickInfo('1')">提取信息</button>
			</view>
		</view>
		<!-- uld信息 -->
		<view class="reweightContent">
			<view class="head">
				<text style="width: 25%">uld号</text>
				<text>复称重量</text>
				<text>舱单毛重</text>
				<text>调整重量</text>
				<text style="width: 15%">差异额</text>
			</view>
			<view class="list-item" v-for="(item, index) in list" v-show="index < 3" :key="index">
				<text style="width: 25%" :style="[{'color': item.uldInfo.reweighStatus !== '1' ? 'red' : ''}]">{{item.uld ? item.uld: '-'}}</text>
				<text>{{item.uldInfo.wgtReweigh ? item.uldInfo.wgtReweigh : '-'}}</text>
				<text>{{item.wgt.wgtManifest ? item.wgt.wgtManifest : '-'}}</text>
				<text>{{item.uldInfo.wgtAdjust ? item.uldInfo.wgtAdjust:'-'}}</text>
				<text style="width: 15%">{{item.wgt.wgtDiff ? item.wgt.wgtDiff: '-'}}</text>
			</view>
			<view class="list-item" @click="checkMore" style="text-align: center;">
				<text style="width: 200upx;margin: auto;">查看详情</text>
			</view>
		</view>
		<!-- uld详情 -->
		<view class="reweightContent bottom">
			<view class="content">
				<text class="lableWidth right gray long">ULD</text>
				<text class="lableWidth uld">{{uldType.box ? uldType.box : '-'}}</text>
				<text class="lableWidth left gray short">箱</text>
				<text class="lableWidth uld">{{uldType.car ? uldType.car : '-'}}</text>
				<text class="lableWidth gray short left">车</text>
				<text class="lableWidth uld">{{uldType.board ? uldType.board : '-'}}</text>
				<text class="lableWidth gray  short left">板</text>
			</view>
		</view>
		<!-- uld详情 -->
		<view class="reweightContent bottom" v-if="indUldSummary.isCargoExist">
			<view class="content">
				<text class="lableWidth right gray long">国际货</text>
				<text class="lableWidth uld">{{indUldSummary.boxNum ? indUldSummary.boxNum : '-'}}</text>
				<text class="lableWidth left gray short">箱</text>
				<text class="lableWidth uld">{{indUldSummary.carNum ? indUldSummary.carNum : '-'}}</text>
				<text class="lableWidth gray short left">车</text>
				<text class="lableWidth uld">{{indUldSummary.plateNum ? indUldSummary.plateNum : '-'}}</text>
				<text class="lableWidth gray  short left">板</text>
			</view>
		</view>
		<!-- 复称情况 -->
		<view class="reweightContent bottom">
			<view class="content">
				<text class="lableWidth 190 right gray">复称总计</text>
				<text class="lableWidth left">{{uldInfo.WGTREWEIGH ? uldInfo.WGTREWEIGH : '-'}}</text>
				<text class="lableWidth 190 right gray">舱单总计</text>
				<text class="lableWidth left">{{uldInfo.WEG ?uldInfo.WEG : '-'}}</text>
			</view>
			<view class="content">
				<text class="lableWidth 190 right gray">差异额</text>
				<text class="lableWidth left">{{uldInfo.WGTDIFF ?uldInfo.WGTDIFF : '-'}}</text>
				<text class="lableWidth 190 right gray">差异率</text>
				<text class="lableWidth left">{{uldInfo.WGTDIFFRATE ?uldInfo.WGTDIFFRATE : '-'}}</text>
			</view>
		</view>
		<!-- 复称交接、复称截关 -->
		<view class="reweightContent head middle">
			<view class="middle-data">
				<text class="lableWidth">复称交接</text>
				<input class="reweightInput short disable" v-model="info.reweighHandoverOp" style="margin-left: 0upx;margin-right: 10upx;"
				 disabled />
				<view class="reweightInput left disable" style="width:340upx;font-size: 30upx;">{{info.reweighHandoverTime ? dayjs(info.reweighHandoverTime).format('YYYY-MM-DD HH:mm:ss') : ''}}</view>
				<!-- <view class="reweightInput left disable" style="width:350upx;">2019-12-03 11:11:11</view> -->
			</view>
			<view class="middle-btn" style="height: 120upx;">
				<button class="weightBottom middle" plain="true" @click="handleOver">复称交接</button>
			</view>
			<view class="middle-data">
				<text class="lableWidth">复称截关</text>
				<input class="reweightInput short disable" v-model="info.reweighOffOp" style="margin-left: 0upx;margin-right: 10upx;"
				 disable />
				<view class="reweightInput left disable" style="width:340upx;font-size: 30upx;">{{info.reweighOffTime ? dayjs(info.reweighOffTimes).format('YYYY-MM-DD HH:mm:ss') : ''}}</view>
			</view>
			<view class="middle-btn" style="display: flex; height: 120upx;">
				<button class="weightBottom half" plain="true" @click="cutOff()" style="margin:auto;">复称截关</button>
				<button class="weightBottom half" plain="true" @click="cancelCutOff()" style="margin:auto;">复称解锁</button>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import {
		getReWeighInfo,
		reWgtHandover,
		cancelReWgtClose,
		reWgtClose
	} from '@/common/api/departure/reWeight/reWeightApi.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import {
		deepCopy
	} from '@/common/util/util.js'
	import tuiModal from "@/components/modal"
	import msgTip from '@/components/tip/tip.vue'
	export default {
		components: {
			msgTip,
			tuiModal
		},
		data() {
			return {
				flightFocus: false,
				flightId: '', // 航班id
				list: [], // uld列表
				uldInfo: {
					WEG: '',
					WGTDIFF: '',
					WGTDIFFRATE: '',
					WGTREWEIGH: ''
				}, /// ULD详情
				// 弹窗提示
				modal: false,
				dialogMsg: '',
				form: { // 查询条件
					flightDate: dayjs().format('YYYY-MM-DD'),
					carrier: '',
					flight: ''
				},
				uldType: {
					box: '', // 箱
					board: '', // 板
					car: '' // 车
				},
				indUldSummary: { // 国际货信息
					carNum: 0,
					boxNum: 0,
					isCargoExist: false,
					plateNum: 0,
				},
				info: { // 交接信息
					reweighHandoverOp: '',
					reweighHandoverTime: '',
					reweighOffTime: '',
					reweighOffOp: '',
				}
			}
		},
		onLoad(params) {
			console.log(params, 'onload')
		},
		methods: {
			dayjs,
			pickInfo(flag) { // 查询航班信息
				let row = {
					carrier: this.form.carrier,
					flight: this.form.flight,
					flightDate: this.form.flightDate
				}
				if (row.carrier && row.flight && row.flightDate) {
					getReWeighInfo(row).then(res => {
						if (res.data) {
							this.flightId = res.data.flightId ? res.data.flightId : '' // 获取航班id
							this.info = res.data.reweighInfo ? res.data.reweighInfo : this.setInfoEmpty() // 获取交接截关信息
							this.list = res.data.uldInfo ? res.data.uldInfo : [] // uld信息
							this.uldInfo = res.data.wgtSummary[0] ? res.data.wgtSummary[0] : this.setuldInfoEmpty() // 复称信息
							this.uldType = res.data.uldSummary ? this.handleType(res.data.uldSummary) : this.setuldTypeEmpty() // uld数量
							this.indUldSummary = res.data.indUldSummary ? res.data.indUldSummary : this.setIndUldSummaryEmpty() // 国际货信息
							if (flag === '1') {
								this.msg('查询成功', 'green')
							}
						} else {
							this.flightId = ''
							this.list = []
							this.info = this.setInfoEmpty()
							this.uldInfo = this.setuldInfoEmpty()
							this.indUldSummary = this.setIndUldSummaryEmpty()
							this.uldType = this.setuldTypeEmpty()
							this.msg('未查询到相关信息，请确认', 'warning')
						}
					})
				} else {
					this.msg('请确认是否正确输入查询信息', 'danger')
				}
			},
			handleType(row) {
				let a = {
					box: '', // 箱
					board: '', // 板
					car: '' // 车
				}
				for (var item of row) {
					// if (item.ULD_TYPE === '0') {
					// 	a.box = item.SUM
					// }
					item.ULD_TYPE === '0' ? a.box = item.SUM : (item.ULD_TYPE === '1' ? a.board = item.SUM : (item.ULD_TYPE === '2' ?
						a.car = item.SUM : ''))
				}
				return a
			},
			msg(msg, type) {
				let message = msg
				let options = {
					msg: message,
					duration: 2000,
					type: type
				}
				this.$refs.toast.showTips(options);
			},
			clearInfo() { // 清空按钮
				this.form.carrier = ''
				this.form.flight = ''
				this.form.flightDate = dayjs().format('YYYY-MM-DD')
				this.flightId = ''
				this.list = []
				this.info = this.setInfoEmpty()
				this.uldInfo = this.setuldInfoEmpty()
				this.indUldSummary = this.setIndUldSummaryEmpty()
				this.uldType = this.setuldTypeEmpty()
			},
			checkMore() { // 查看更多复称信息
				if (this.list.length > 0) {
					uni.navigateTo({
						url: '/pages/departure/reWeight/tableForReWeight?item=' + encodeURIComponent(JSON.stringify(this.list))
					})
				} else {
					this.msg('请先提取信息', 'warning')
				}
			},
			handleOver() { // 复称交接
				this.close('handover')
			},
			cancelCutOff() { // 复称解锁
				this.close('cutOff')
			},
			cutOff() { // 复称截关
				let row = deepCopy(this.list)
				if (row.length > 0) {
					let flag = true // 复称交接标志位
					let flag2 = true // 航班差异率标志位
					let flag3 = true
					let msg = ''
					if (Math.abs(parseFloat(this.info.wgtDiffRate)) > 2) { // 若航班的差异率的绝对值＞2%
						flag2 = false
					}
					for (var item of row) {
						if (!item.uldInfo.reweighOp || !item.uldInfo.reweighTime) { // 若有车还没有复称人/复称时间
							flag3 = false
						}
						if (item.uldInfo.reweighStatus !== '1') { // 复称状态为已复称才可复称截关
							flag = false
							msg = '存在信息尚未复称，请确认'
							break
						}
						if (Math.abs(parseFloat(item.wgt.wgtDiff)) > 30) { // ULD的差异额若超过±30不可复称截关。
							flag = false
							msg = '存在信息差异额超过30，请确认'
							break
						}
					}
					if (!flag) {
						this.msg(msg, 'warning')
					} else if (!flag2 || !flag3) { // 弹窗提示
						this.dialogMsg = (flag2 ? '' + (flag3 ? '' : '存在未复称的uld信息，') : ('航班的差异率大于要求范围，' + (flag3 ? '' : '存在未复称的uld信息，'))) +
							'是否继续操作'
						this.modal = true
					} else {
						this.close('close')
					}
				} else {
					this.close('close')
				}
			},
			handleClick(e) { // 点击确认复称截关
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					this.close('close')
					this.modal = false
				}
			},
			close(type) { // 访问复称截关接口
				if (this.flightId !== '') {
					let handle = type === 'handover' ? reWgtHandover : (type === 'close' ? reWgtClose : cancelReWgtClose)
					let data = {
						flightId: this.flightId,
					}
					handle(data).then(res => {
						if (res.message) {
							this.pickInfo(true)
							this.msg(res.message, res.status === 1 ?
								'green' : 'warning')
						}
					})
				} else {
					this.msg('请先提取信息', 'warning')
				}
			},
			hide() {
				this.modal = false
			},
			// *******************信息输入*********************
			carrierChange(val) {
				this.flightFocus = false
				this.form.carrier = val.detail.value.toLocaleUpperCase()
				if (this.form.carrier.length === 2) {
					this.flightFocus = true
				}
			},
			dateChange(val) { // 时间选择
				this.form.flightDate = val.detail.value
			},
			// ************************信息置空*************************
			setInfoEmpty() {
				let info = { // 交接信息
					reweighHandoverOp: '',
					reweighHandoverTime: '',
					reweighOffTime: '',
					reweighOffOp: '',
					wgtDiffRate: ''
				}
				return info
			},
			setuldInfoEmpty() { // uld信息置空
				let uldInfo = {
					WEG: '',
					WGTDIFF: '',
					WGTDIFFRATE: '',
					WGTREWEIGH: ''
				}
				return uldInfo
			},
			setuldTypeEmpty() { // uld类型置空
				let uldType = {
					box: '', // 箱
					board: '', // 板
					car: '' // 车
				}
				return uldType
			},
			setIndUldSummaryEmpty() { // 国际货信息置空
				let indUldSummary = { // 国际货信息
					carNum: 0,
					boxNum: 0,
					isCargoExist: false,
					plateNum: 0,
				}
				return indUldSummary
			}
		}
	}
</script>

<style lang="scss">
	.reweightClass {
		background-color: #F4F5F6;

		.lableWidth {
			width: 150upx;
			font-size: 35upx;
			line-height: 80upx;
			padding: 0 0 0 30upx;

			&.short {
				width: 90upx;
			}

			&.left {
				padding: 0 0 0 0upx;
			}

			&.uld {
				width: 130upx;
				text-align: right;
				padding-right: 10upx;

			}

			&.long {
				width: 200upx;
			}

			&.190 {
				width: 190upx;
			}

			&.long {
				width: 200upx;
			}

			&.right {
				text-align: right;
				padding: 0 30upx 0 30upx;
			}

			&.gray {
				color: #a3a3a3;
			}

			&.thin {
				line-height: 60upx;
			}
		}

		.reweightInput {
			text-align: center;
			line-height: 70upx;
			border: solid 5upx #dbdbdb;
			font-size: 35upx;
			width: 180upx;
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

			&.left {
				text-align: left;
				padding-left: 30upx;
			}

			&.reduceLeft {
				margin-left: 0;
				border-left: 0;
			}
		}

		.weightBottom {
			width: 100%;
			// height: 80upx;
			vertical-align: center;
			color: #0ebf9c;
			font-size: 35upx;
			border-radius: 10upx;
			border: 1px solid #0ebf9c;

			&.short {
				width: 40%
			}

			&.moreShort {
				width: 25%;
				font-size: 25upx;
			}

			&.middle {
				width: 100%
			}

			&.half {
				width: 45%
			}

			&.long {
				color: white;
				background-color: #0ebf9c;
			}

		}

		.reweightContent {
			display: flex;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx 10upx;
			color: #595959;

			// padding: 30upx 0;
			&.middle {
				.middle-data {
					display: flex;
					flex-wrap: wrap;
					margin-top: 20upx;

					.uld-date {
						height: 80upx;
						width: 535upx;
						text-align: center;
						line-height: 80upx;
						border: solid 5upx #dbdbdb;
					}

					&.bottom {
						margin-left: 30upx;

						.check {
							display: inline-block;
							font-size: 35upx;
						}
					}
				}

				.saveBottom {
					padding: 0upx 0upx 0 90upx;
					width: 300upx;
				}

				.middle-btn {
					padding: 30upx 35upx 0 30upx;
				}

			}

			&.bottom {
				font-size: 25upx;
				padding: 20upx 0;

				.content {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					margin-top: 30upx;

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

			&.buttom {
				background-color: #F4F5F6;
				border: 0;
			}

			.head {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 0;
				border: solid 2upx #e5e5e5;

				>text {
					display: block;
					width: 20%;
					text-align: center;
					font-size: 32upx;
				}
			}

			.list-item {
				padding: 30upx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 2upx #e5e5e5;

				// border-top:0;
				>text {
					display: block;
					width: 20%;
					text-align: center;
					font-size: 32upx;
				}
			}
		}
	}
</style>
