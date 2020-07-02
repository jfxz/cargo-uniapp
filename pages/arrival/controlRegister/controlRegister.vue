<template>
	<view class="controlRegister">
		<headBar name="航控登记"></headBar>
		<msg-tip ref="toast"></msg-tip>
		<view class="content-top">
			<view class="row" style="margin-top: 0px">
				<text class="lableWidth">航班号</text>
				<view class="right">
					<input class="flight-input" :value="form.carrier" @input="carrierChange" maxlength="2" />
					<!-- <input class="flight-input" style="margin-left: 0;border-left: 0;" v-model="form.flight" maxlength="4" :focus="flightFocus" /> -->
					<cInput class="flight-input" style="margin-left: 0;border-left: 0;" @clear="clear" :focus2="flightFocus" :value="form.flight"
					 @input="flightChange" maxlength="4" />
				</view>
			</view>
			<view class="row">
				<text class="lableWidth">航班日期</text>
				<picker mode="date" :value="form.flightDate" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="date">{{form.flightDate}}</view>
				</picker>
			</view>
		</view>
		<view class="btn">
			<!-- <button type="primary" plain="true" @click="reset" >重置</button> -->
			<button type="primary" plain="true" @click="getData('getData')">查询</button>
		</view>
		<view class="middle">
			<view class="row-btn">
				<button type="primary" style="color:#0ebf9c;border: solid 1px #0ebf9c;width: 44%;" plain="true">一键催单</button>
				<button type="primary" @click="sendMessage" style="color:#fdb332;border: solid 1px #fdb332;width: 44%;margin-left: 0px;;"
				 plain="true">预警提示</button>
			</view>
			<view class="date">
				<view class="left">
					<view class="left-top">
						<text class="circle" style="background: #999999;"></text>
						<text style="margin-left: 10px">MI CLOSE</text>
					</view>
					<text class="left-bottom">{{format(formData.miCloseTime)}}</text>
				</view>
				<view class="right">
					<view class="right-top">
						<text class="circle" style="background: #1890ff;margin-right: 10px"></text>
						<text @click="close">MC CLOSE</text>
					</view>
					<view class="right-bottom">
						<text>{{format(formData.mcCloseTime)}}</text>
					</view>
				</view>
			</view>
			<view class="row">
				<text class="lableWidth2">运单号</text>
				<input type="text" class="flight-input2 short" :value="form.wbPrefix" @input="prefixChange" @blur="yunblur" />
				<!-- <input type="text" class="flight-input2 long" :value="form.wbNo" @input="yunChange" @blur="wbBlur" v-model="form.wbNo" :focus="yunNumFocus" /> -->
				<view class="clearInput flight-input2 long">
					<input :focus="yunNumFocus" @input="yunChange" @blur="wbBlur" v-model="form.wbNo" />
					<view class="uni-icon uni-icon-clear" v-if="form.wbNo" @click="yunClear"></view>
				</view>
				<button type="primary" @click="getData()" class="searchBottom" plain="true">检索</button>
			</view>
		</view>
		<view :style="[{'margin-top':'10upx;'},{'width':tabWidth}]" v-if="tabList.length>0">
			<tab-new :tabList="tabList" :value="currentTab" @change="tabChange">
			</tab-new>
		</view>
		<view class="tableForReWeight2">
			<view class="table" style="overflow:scroll;display: -webkit-box;overflow-x: scroll;-webkit-overflow-scrolling: touch;">
				<view class="reweightContent3" style="width:1800upx;">
					<view class="head list" style="border:0;">
						<text style="width: 17%;">运单号</text>
						<!-- <text>总件数</text> -->
						<text>舱单件数</text>
						<text>理货件数</text>
						<text>收货人</text>
						<text>货物品名</text>
						<text>始发站</text>
						<text>目的站</text>
						<text>舱单重量</text>
					</view>
					<view class="list-item" v-for="(item, index) in list" :key="index" @click="rowClick(item)" :style="[{color:'#595959'},{'background-color':item.meta.isWaybillClose ? 'rgba(14, 191, 156, 0.1)': ''}
					]">
						<!--  -->
						<view style="width: 17%;display: flex;font-size: 35upx;">
							<text style="margin:auto;">
								{{item.wbPrefix + item.wbNo}}
							</text>
							<image v-if="item.meta.isTransit === '1'" :src="require('../../../static/isTrans.png')" mode="aspectFit" style="width: 50upx;height: 50upx;margin:auto 0;"></image>
						</view>
						<!-- <text>{{item.totalNum ? item.totalNum :''}}</text> -->
						<text>{{item.numDoc ? item.numDoc: '-'}}</text>
						<text>{{item.numTally ? item.numTally :'-'}}</text>
						<text>{{item.meta.receiverName ? item.meta.receiverName : '-'}}</text>
						<text>{{item.meta.cargoName ? item.meta.cargoName : '-'}}</text>
						<text>{{item.meta.origin ? item.meta.origin : '-'}}</text>
						<text :style="[{'color':item.meta.isTransit === '1' ? 'red': ''}]">{{item.meta.destination ? item.meta.destination : '-'}}</text>
						<text>{{item.meta.wgtTotal ? item.meta.wgtTotal : '-'}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 	<view class="bottom">
			<text style="width: 30%;">运单号</text>
			<text style="width: 25%;">总件数</text>
			<text style="width: 23%;">舱单件数</text>
			<text style="width: 22%;">理货件数</text>
		</view> -->
		<!-- 	<view class="list-item" v-for="(item, index) in list" :key="index" @click="rowClick(item)" :style="[{color:'#595959'},{'background-color':item.numTally ? 'rgba(14, 191, 156, 0.1)': ''}]">
			<text style="width: 30%;">{{item.wbPrefix + item.wbNo}}</text>
			<text style="width: 25%;">{{item.totalNum ? item.totalNum :''}}</text>
			<text style="width: 23%;">{{item.numDoc ? item.numDoc: ''}}</text>
			<text style="width: 22%;">{{item.numTally ? item.numTally :''}}</text>
		</view> -->
		<view class="btn">
			<button type="primary" style="background: #FFFFFF;color:#0ebf9c;border: solid 1px #0ebf9c;width: 92%;" plain="true"
			 @click="goTo">无单理货</button>
			<!-- <button type="primary" style="background: #0ebf9c;color:#ffffff;border: solid 0px #0ebf9c;width: 40%;" plain="true"
			 @click="allClose">理货截关</button> -->
		</view>
		<tui-modal :show="modal" @cancel="hide" :custom="true" :fadein="true">
			<view class="tui-modal-custom">
				<view class="tui-prompt-title">{{'请输入需要提醒的号码'}}</view>
				<input type="number" :placeholder='"请输入手机号码"' class="tui-input" v-model="number" />
				<view class="modal-btn">
					<button type="primary" @click="handleClick">发送</button>
				</view>
			</view>
		</tui-modal>
		<tui-modal :show="modalClose" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import tabNew from '@/components/tab.vue'
	import cInput from '@/components/clearInput.vue'
	import {
		getWayBill,
		matchWayBillNo,
		sendMsg,
		flightWbClose,
		mcClose
	} from '@/common/api/arrival/controlRegister/controlRegister.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import {
		deepCopy,
		model7,
		isEmpty
	} from '@/common/util/util.js'
	import tuiModal from "@/components/modal"
	import msgTip from '@/components/tip/tip.vue'
	export default {
		components: {
			headBar,
			tuiModal,
			tabNew,
			cInput,
			msgTip
		},
		data() {
			return {
				tabNum: '',
				flightFocus: false,
				yunNumFocus: false,
				currentTab: 0,
				tabList: [], // 表格信息
				flightArray: [], // 航段信息
				// 弹窗相关信息
				modal: false,
				dialogMsg: '',
				modalClose: false,
				number: '',
				form: {
					// carrier: 'HO',
					// flight: '1105',
					// flightDate: dayjs('2020-01-03').format('YYYY-MM-DD'),
					carrier: '',
					flight: '',
					flightDate: dayjs().format('YYYY-MM-DD'),
					wbPrefix: '',
					wbNo: ''
				},
				formData: {
					miCloseTime: '',
					mcCloseTime: ''
				},
				mainInfo: [], // 保存所有运单信息
				newMainInfo: {}, // 保存分类后的运单信息
				list: []
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			tabWidth() {
				return this.tabList.length === 1 ? '30%;' : (this.tabList.length === 2 ? '60%;' : '90%;')
			}
		},
		onLoad(options) {
			if (options && options.carrier) {
				this.form.carrier = options.carrier
				this.form.flight = options.flight
				this.form.flightDate = options.flightDate
			}
		},
		onShow() {
			if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate)) {
				this.getData()
			}
		},
		methods: {
			tabChange(val) { // 选择tab
				this.currentTab = val.tab
				this.list = this.handleInfo(val.tab, this.newMainInfo)
				this.$store.commit('SET_CONTROINFO', val) // 更新缓存中的tab信息
			},
			// 相关功能按钮
			getData(val) { // 查询信息
				return new Promise((resolve, reject) => {
					if (val === 'getData') {
						this.form.wbPrefix = ''
						this.form.wbNo = ''
						this.$store.commit('SET_CONTROINFO', {
							tab: 0
						}) // 重置tab信息
					}
					if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate)) {
						let data = deepCopy(this.form)
						if (data.flightDate !== '') {
							data.flightDate = dayjs(data.flightDate).valueOf()
						}
						matchWayBillNo(data).then(res => {
							if (res.status) {
								this.formData = res.data.doaFlightBizEntity // close相关
								this.mainInfo = res.data.batchEntityList // 保存所有运单信息
								this.newMainInfo = res.data.billByOriginMap // 保存所有运单信息
								this.handleTabList(res.data.flightInfo).then(() => { // 航班信息
									let data = this.$store.getters.dic.controInfo
									this.tabChange((data && data.tab && data.tab < this.tabList.length) ? data : {
										tab: 0
									})
									resolve()
								})
							} else {
								this.show(res.message, 'warning')
								reject()
							}
						})
					} else {
						this.show('请填写完整航班号以及航班日期')
					}
				})
			},
			handleTabList(data) { // 生成tablist
				return new Promise((resolve, reject) => {
					this.tabList = []
					this.flightArray = []
					data.origin && this.tabList.push("起始站: " + data.origin)
					data.origin && this.flightArray.push(data.origin)
					data.pass1 && this.tabList.push("中转站: " + data.pass1)
					data.pass1 && this.flightArray.push(data.pass1)
					data.pass2 && this.tabList.push("中转站: " + data.pass2)
					data.pass2 && this.flightArray.push(data.pass2)
					data.pass3 && this.tabList.push("中转站: " + data.pass3)
					data.pass3 && this.flightArray.push(data.pass3)
					data.pass4 && this.tabList.push("中转站: " + data.pass4)
					data.pass4 && this.flightArray.push(data.pass4)
					resolve()
				})
			},
			handleInfo(type, data) { // 处理运单信息
				if (!data) {
					return []
				}
				let filterInfo = this.tabList[type].substr(5, 10)
				let row = []
				// for (let item of data) {
				// 	if (item.meta.origin === filterInfo) {
				// 		row.push(item)
				// 	}
				// }
				for (let key in data) {
					if (filterInfo === key) {
						row = data[key]
					}
				}
				return row
			},
			close() { // mc 截关
				if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate)) {
					if (!isEmpty(this.formData.miCloseTime)) {
						// if (this.mainInfo.length > 0) { // 存在uld信息，
						let flag = false
						let wbno = []
						for (let item of this.mainInfo) {
							if (item.numDoc !== item.numTally) {
								flag = true
								wbno.push(item.wbPrefix + item.wbNo)
							}
						}
						if (flag) { // 存在运单理货件数与舱单件数不同
							let msg
							if (wbno.length > 2) {
								msg = wbno[0] + ',' + wbno[1] + '等信息'
							} else {
								msg = wbno
							}
							this.dialogMsg = '运单号' + msg + '理货件数与舱单件数不符，是否继续截关？'
							this.modalClose = true
						} else {
							let data = {
								flightId: this.formData.flightId,
								carrier: this.form.carrier,
								flight: this.form.flight,
								flightDate: this.form.flightDate
							}
							data.batchList = deepCopy(this.mainInfo)
							flightWbClose(data).then(res => {
								this.getData() // 重新查询当前信息
								this.$message(res.message)
							})
						}
						// } else {
						// 	this.$message('请先填写完整航班号以及航班日期')
						// }
						// let data = deepCopy(this.form)
						// data.flightDate = dayjs(this.form.flightDate).valueOf()
						// mcClose(data).then(res => {
						// 	this.getData() // 重新查询当前信息
						// 	this.$message(res.message)
						// })
					} else {
						this.$message('请确认是否已经MI CLOSE')
					}
				} else {
					this.$message('请先填写完整航班号以及航班日期')
				}
			},
			allClose() { // 航班截关
				if (this.mainInfo.length > 0) {
					let flag = false
					let wbno = ''
					for (let item of this.mainInfo) {
						if (item.numDoc !== item.numTally) {
							flag = true
							wbno = item.wbPrefix + item.wbNo
							break
						}
					}
					if (flag) { // 存在运单理货件数与舱单件数不同
						this.dialogMsg = '运单号' + wbno + '理货件数与舱单件数不符，是否继续截关？'
						this.modalClose = true
					} else {
						let data = deepCopy(this.mainInfo)
						flightWbClose(data).then(res => {
							this.$message(res.message)
						})
					}
				} else {
					this.$message('请先填写完整航班号以及航班日期')
				}
			},
			// 弹窗相关方法
			sendMessage() { // 一键预警弹窗
				if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate)) {
					this.modal = true
					this.number = ''
				} else {
					this.$message('请先填写完整航班号以及航班日期')
				}
			},
			handleClick(e) { // 是否确认入库弹窗按钮
				let index = e.index
				if (index === 0) { // 取消
					this.modal = false
					this.modalClose = false
				} else { // 确定
					if (this.modal) { // 预警提醒发短信确认
						if (this.number) {
							let regular = /^[1][3,4,5,6,7,8,9][0-9]{9}$/; // 增加对手机号的验证
							if (regular.test(this.number)) {
								let numberList = []
								numberList.push(this.number)
								let data = {
									carrier: this.form.carrier,
									flight: this.form.flight,
									telPhoneNoList: numberList,
								}
								sendMsg(data).then(res => {
									this.show(res.message)
									this.modal = false
								}).catch(() => {
									this.modal = false
									this.show('异常，请确认')
								})
							} else {
								this.$message('请填写正确的号码')
							}
						} else {
							this.show('请确认是否正确输入号码')
						}
					} else if (this.modalClose) { // MC CLOSE 弹窗点击确认
						let data = {
							flightId: this.formData.flightId,
							carrier: this.form.carrier,
							flight: this.form.flight,
							flightDate: this.form.flightDate
						}
						data.batchList = deepCopy(this.mainInfo)
						flightWbClose(data).then(res => {
							this.modalClose = false
							this.getData() // 重新查询当前信息
							this.$message(res.message)
						}).catch(() => {
							this.modalClose = false
							this.show('异常，请确认')
						})
					}
				}
			},
			hide() {
				this.modal = false
				this.modalClose = false
			},
			// **********************输入信息*************************
			part(val) {
				let wbNum = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
				let wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.form.wbPrefix = wbPrefix
				this.form.wbNo = wbNum
			},
			yunblur() {
				if (this.form.wbNo.length === 8) {
					this.wbBlur()
				}
			},
			wbBlur() {
				if (!model7(this.form.wbPrefix, this.form.wbNo) || this.form.wbNo.length !== 8) {
					this.$message('运单不符合规则')
				}
			},
			yunClear() {
				this.form.wbPrefix = ''
				this.form.wbNo = ''
			},
			prefixChange(val) {
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
			yunChange(val) {
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
			// ********航班信息输入******8
			carrierChange(val) { // 承运人
				this.flightFocus = false
				this.form.carrier = val.detail.value.toLocaleUpperCase()
				if (this.form.carrier.length === 2) {
					this.flightFocus = true
				}
			},
			flightChange(val) {
				this.form.flight = val.detail.value
			},
			// 工具函数
			bindDateChange: function(e) {
				this.form.flightDate = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			show(val, type) {
				let options = {
					msg: val,
					duration: 2000,
					type: type === 'warning' ? 'warning' : 'green'
				}
				this.$refs.toast.showTips(options)
			},
			format(val) {
				if (val !== null && val !== '') {
					return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
				}
			},
			reset() { // 清空
				this.form = {
					ULD1: '',
					ULD2: ''
				}
			},
			clear() {
				this.form.carrier = ''
				this.form.flight = ''
			},
			// 理货
			rowClick(val) { // 有单理货
				uni.navigateTo({
					url: `/pages/arrival/controlRegister/tally?carrier=` + this.form.carrier + '&flight=' + this.form.flight +
						'&flightDate=' +
						this.form.flightDate + '&wbPrefix=' + val.wbPrefix + '&wbNo=' + val.wbNo + '&flightId=' + this.formData.flightId +
						'&flightArray=' + this.flightArray + '&flightOrigin=' + val.meta.origin
				})
			},
			goTo() { // 无单理货
				if (this.flightArray.length > 0) {
					if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate)) {
						uni.navigateTo({
							url: `/pages/arrival/controlRegister/tally?carrier=` + this.form.carrier + '&flight=' + this.form.flight +
								'&flightDate=' + this.form.flightDate + '&flightArray=' + this.flightArray
						})
					} else {
						this.show('请填写完整航班号以及航班日期')
					}
				} else {
					this.show('请先查询航班信息')
				}

			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}

	.controlRegister {

		.uni-tab-item {
			background-color: #f4f5f6 !important;
			color: #595959 !important;
			font-size: 35upx !important;
			line-height: 94upx !important;
		}

		.tableForReWeight2 {
			.reweightContent3 {
				display: flex;
				background: #ffffff;
				flex-direction: column;
				margin: 10upx 10upx;
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
						margin: auto;
						width: 10%;
						text-align: center;
						font-size: 32upx;
					}
				}

				.list-item {
					display: flex;
					vertical-align: center;
					border: 0;
					border-top: solid 2upx #e5e5e5;

					>text {
						display: block;
						margin: auto;
						width: 10%;
						text-align: center;
						font-size: 32upx;
					}
				}
			}
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

		.lableWidth {
			width: 138upx;
			height: 94upx;
			text-align: right;
			line-height: 94upx;
			padding: 0 20upx 0 30upx;
			font-size: 35upx;
		}

		.lableWidth2 {
			width: 130upx;
			height: 94upx;
			text-align: right;
			line-height: 94upx;
			padding: 0 20upx 0 0upx;
			font-size: 35upx;
		}

		.row {
			display: flex;
			flex-direction: row;
			margin-top: 30upx;

			.searchBottom {
				color: #0ebf9c;
				border: solid 1px #0ebf9c;
			}

			button {
				height: 94upx;
				line-height: 94upx;
			}

			.right {
				display: flex;
				justify-content: flex-start;
				border: 3upx solid #dbdbdb;
				border-left: 0;
				// width: 75%;

				input {
					font-size: 35upx;
					text-align: center;
					border-left: 3upx solid #dbdbdb;
					height: 94upx;
					width: 265upx;
				}
			}

			.clearInput {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 35upx;
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
					// font-size: 35upx;
					// border: solid 5upx #dbdbdb;
					border-radius: 5upx;
					// height: 94upx;
					// width: calc(100% - 30upx);
				}
			}

			.flight-input2 {
				font-size: 35upx;
				text-align: center;
				border: solid 3upx #dbdbdb;
				width: 265upx;
				height: 94upx;

				&.short {
					width: 20%;
				}

				&.long {
					width: 35%;
					margin-left: 0;
					border-left: 0;
				}
			}

			.date {
				height: 94upx;
				width: 528upx;
				font-size: 35upx;
				text-align: center;
				line-height: 94upx;
				border: solid 3upx #dbdbdb;
			}
		}

		.content-top {
			display: flex;
			font-size: 35upx;
			background: #ffffff;
			flex-direction: column;
			margin-top: 10upx;
			color: #595959;
			padding: 30upx 0;
			border: solid 2upx #e5e5e5;
		}

		.btn {
			display: flex;
			flex-direction: row;
			margin-top: 30upx;
			margin-bottom: 30upx;
			font-size: 35upx;

			button {
				width: 92%;
				color: #FFFFFF;
				background: #0ebf9c;
				border: 1px solid #0ebf9c;
			}
		}

		.row-btn {
			margin-top: 30upx;
			margin-bottom: 30upx;
			display: flex;
			flex-direction: row;
		}

		.middle {
			margin-top: 30upx;
			padding-bottom: 30upx;
			display: flex;
			flex-direction: column;
			font-size: 35upx;
			background: #ffffff;

			.row-btn {
				margin-top: 30upx;
				display: flex;
				flex-direction: row;
			}

			.date {
				margin-top: 50upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				border-bottom: dashed 1px #e5e5e5;
				padding-bottom: 30upx;

				.circle {
					width: 30upx;
					height: 30upx;
					margin-top: 5upx;
					border-radius: 25upx;
					text-align: center;
					line-height: 30upx;
					font-size: 33upx;
					display: inline-block;
				}

				.left {
					margin-left: 30upx;
					display: flex;
					flex-direction: column;
					font-size: 35upx;

					.left-top {
						display: flex;
						font-size: 35upx;
						flex-direction: row;
						height: 40upx;
						color: #999999;
						line-height: 40upx;
					}

					.left-bottom {
						margin-top: 20upx;
						font-size: 35upx;
					}
				}

				.right {
					margin-right: 30upx;
					font-size: 35upx;

					.right-top {
						text-align: right;
						font-size: 35upx;
						color: #1890ff;
						height: 40upx;
						line-height: 40upx;
					}

					.right-bottom {
						margin-top: 20upx;
						text-align: right;
						font-size: 35upx;
					}

					>text {
						text-align: right;
					}
				}
			}
		}

		.bottom {
			display: flex;
			text-align: center;
			justify-content: space-between;
			flex-wrap: wrap;
			padding: 30upx 0;
			font-size: 35upx;
			border: solid 2upx #e5e5e5;
		}

		.list-item {
			background: #ffffff;
			padding: 30upx 0;
			display: flex;
			text-align: center;
			font-size: 35upx;
			justify-content: space-between;
			flex-wrap: wrap;
			border: solid 2upx #e5e5e5;
		}
	}
</style>
