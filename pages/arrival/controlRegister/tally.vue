<template>
	<view class="controlRegister">
		<headBar name="理货"></headBar>
		<msg-tip ref="toast"></msg-tip>
		<view class="content-top">
			<view style="margin-top: 0px">
				<view class="flex">
					<text class="lableWidth">运单号</text>
					<input class="flight-input" id="wbPrefix" :class="getFlag ? 'disable': ''" :disabled="getFlag" type="text" @input="prefixChange"
					 style="width: 25%;" :value="form.wbPrefix" />
					<cInput type="text" :class="getFlag ? 'disable': ''" :disabled="getFlag" class="wb-input" @input="yunChange"
					 :focus2="wbNoFocus" @clear="yunClear" style="width: 45%;" :value="form.wbNo"></cInput>
				</view>
			</view>
			<view class="row" style="margin-top: 0px">
				<text class="lableWidth">航班号</text>
				<input class="row-input" :class="getFlag ? 'disable': ''" :disabled="getFlag" :value="form.carrier" @input="carrierChange" />
				<input class="row-input" :class="getFlag ? 'disable': ''" :disabled="getFlag" style="margin-left: 0;border-left: 0;"
				 :focus="flightFocus" v-model=" form.flight" />
			</view>
			<view class="row">
				<text class="lableWidth">航班日期</text>
				<picker mode="date" :value="form.flightDate" :class="getFlag ? 'disable': ''" :disabled="getFlag" :start="startDate"
				 :end="endDate" @change="bindDateChange">
					<view class="date">{{form.flightDate}}</view>
				</picker>
			</view>
			<view class="btn">
				<button type="primary" plain="true" @click="reset" style="color:#0ebf9c;border: solid 1px #0ebf9c;background:#fff;">清空</button>
				<button type="primary" plain="true" @click="getData">查询</button>
			</view>
		</view>
		<view class="content-middle" v-if="tableData.length > 0">
			<view class="middle-text">
				<text class="circle"></text>
				<text>库存信息</text>
			</view>
			<view class="bottom">
				<text>件数</text>
				<text>库位号</text>
			</view>
			<view class="list-item" v-for="(item, index) in tableData" v-if="item.num > 0" :key="index" :style="[{color:'#595959'}]">
				<text>{{item.num}}</text>
				<text>{{item.locationId}}</text>
			</view>
		</view>

		<view class="middle-text">
			<text class="circle"></text>
			<text>理货</text>
		</view>
		<view class="content-middle">
			<view style="display: flex;">
				<view class="flex" style="width: 50%;">
					<text class="lableWidth2">件数</text>
					<input type="number" style="width: 50%;text-align: center;border: solid 1px #dbdbdb;height: 80upx;" v-model="formData.numTally" />
				</view>
				<view class="flex" style="width: 50%;" v-if="flightArray.length>1">
					<text class="lableWidth2">始发站</text>
					<picker @change="changeValue" :class="[originDisable ? 'disable' : '']" 
					 :disabled="originDisable" :range="flightArray" style="width: 50%;">
						<view class="reweightInput short bold" style="width: 100%;">{{flightOrigin}}</view>
					</picker>
				</view>
			</view>
			<view class="num">
				<view class="num-left">
					<text class="circle" style="background: #0ebf9c;"></text>
					<text style="margin-left: 5px">舱单件数</text>
					<text style="width: 10%;margin-left: 10px">{{formData.numDoc ? formData.numDoc : '-'}}</text>
				</view>
				<view class="num-right">
					<text class="circle" style="background: #fdb332;margin-right: 5px;"></text>
					<text style="padding-right: 10px;">实际到达件数</text>
					<text class="numColor" :class="equallyFlag? 'red' : '' ">{{formData.storageNum ? formData.storageNum : '-'}}</text>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-top">
				<text class="lableWidth4">库位号</text>
				<view class="search-bar-input">
					<bjx-inputx ref="locationInput" the-style="font-size:35rpx;height: 80rpx;line-height: 80rpx;" :value="form.locationCode || ''"
					 placeholder='请输入内容' @focus="foucsLocation" @list="ListShow" @select='selectCode' overflow="auto"></bjx-inputx>
				</view>
				<text class="lableWidth4">板架号</text>
				<input type="text" class="pick-text" v-model="form.frameCode" />
			</view>
			<view class="bottom-last">
				<text class="lableWidth4">ULD号</text>
				<input class="uld-input" :value="form.uldType" @input="uldTypeChange" />
				<input class="uld-input" style="margin-left: 0;border-left: 0;" :value="form.uldNo" @input="uldNoChange" />
				<input class="uld-input" style="margin-left: 0;border-left: 0;" :value="form.uldNoSuffix" @input="uldNoSuffixChange" />
			</view>
		</view>
		<view class="row-btn">
			<button type="primary" @click="abnormalRegistration" style="color:#fdb332;border: solid 1px #fdb332;" plain="true">异常登记</button>
			<button type="primary" @click="wbClose" style="color:#0ebf9c;border: solid 1px #0ebf9c;margin-left: 0px;" plain="true">CLOSE</button>
		</view>
		<view class="btn">
			<button type="primary" plain="true" @click="put" :loading="loading">入库</button>
			<!-- <button type="primary" plain="true" @click="wbClose" style="color:#0ebf9c;border: solid 1px #0ebf9c;margin-left: 0px;">理货截关</button> -->
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="入库件数超过舱单件数，是否确认入库"></tui-modal>
	</view>
</template>

<script>
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import cInput from '@/components/clearInput.vue'
	import {
		model7,
		deepCopy,
		isEmpty
	} from '@/common/util/util.js'
	import {
		checkUld,existUld
	} from '@/common/api/departure/waitingManager/waitingManager.js'
	import BjxInputx from '@/components/bjx-inputs.vue'
	import {
		mcClose,
		getWarehouse,
		checkFlight,
		wbClose,
		checkFrame,
		putIn,
		checkWayBill,
		getBatch
	} from '@/common/api/arrival/controlRegister/controlRegister.js'
	import msgTip from '@/components/tip/tip.vue'
	import tuiModal from "@/components/modal"
	export default {
		components: {
			headBar,
			cInput,
			BjxInputx,
			msgTip,
			tuiModal
		},
		data() {
			return {
				// 航段相关
				originDisable: false,
				flightOrigin: '',
				flightArray: [],
				// 已入库信息
				tableData: [], // 已入库信息
				loading: false,
				modal: false,
				equallyFlag: false,
				getFlag: false,
				uldFlag: false,
				frameFlag: false,
				position: 476,
				flightFocus: false, // 航班号聚焦iflag
				wbNoFocus: false, // 运单号聚焦flag
				searchResult: [],
				form: {
					carrier: '',
					flight: '',
					flightDate: '',
					flightId: '',
					uldType: '',
					uldNo: '',
					uldNoSuffix: '',
					wbPrefix: '',
					wbNo: '',
					numDoc: '',
					locationCode: '',
					frameCode: '',
					numTally: '',
					storageNum: ''
				},
				formData: {
					numDoc: '',
					numTally: '',
					storageNum: ''
				},
				list: []
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad: function(option) {
			this.form.carrier = option.carrier
			this.form.flight = option.flight
			this.form.flightDate = option.flightDate
			this.form.flightId = option.flightId
			if (option.wbPrefix) { // 有单理货
				// 航段信息
				this.flightOrigin = option.flightOrigin ? option.flightOrigin : '' // 获取目的地
				this.originDisable = !!option.flightOrigin
				// 运单信息
				this.form.wbPrefix = option.wbPrefix
				this.form.wbNo = option.wbNo
				// 控制聚焦
				uni.hideKeyboard() // 隐藏键盘
				this.flightFocus = false
				this.wbNoFocus = false
				if (!model7(option.wbPrefix, option.wbNo)) {
					this.show('请确认输入的运单号是否符合规则')
				} else {
					this.getData()
				}
			} else { // 无单理货
				if (this.form.carrier) {
					checkWayBill({
						carrier: this.form.carrier
					}).then(res => {
						if (res.data) {
							this.form.wbPrefix = res.data
							// 控制聚焦
							this.flightFocus = false
							this.wbNoFocus = true
						}
					})
				}
			}
			// 获取航段信息
			this.flightArray = option.flightArray.split(",") // 获取航段信息
			// 获取库位信息
			getWarehouse().then(res => {
				this.searchResult = res.data
			})
		},
		methods: {
			// *********************************查询运单信息*******************************
			getData() { // 查询运单航班信息
				if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate) && !isEmpty(this.form
						.wbPrefix) && !isEmpty(this.form.wbNo)) {
					let data = deepCopy(this.form)
					if (data.flightDate !== '') {
						data.flightDate = dayjs(data.flightDate).valueOf()
					}
					this.getFlag = true // 禁用运单、航班输入框
					getBatch(data).then(res => {
						if (res.status) {
							if (res.data.batchEntityList.length > 0) {
								this.formData = res.data.batchEntityList[0]
							}
							this.formData.storageNum = res.data.storageNum // 获取理货信息,实际到达件数
							this.formData.isMcClose = res.data.isMcClose // 是否已经mcclose
							this.equallyFlag = this.formData.storageNum !== this.formData.numTally // 实际到达件数标志位，件数 === 实际到达件数
							this.tableData = res.data.doaStorageEntityList // 获取已入库信息
						} else {
							this.formData = {
								numDoc: '',
								numTally: '',
								storageNum: ''
							}
							this.tableData = []
							this.show(res.message, 'warning')
						}
					})
				} else {
					this.show('请填写完整航班信息及运单信息', 'warning')
				}
			},
			// ******************航段相关内容****************************
			changeValue(val) { // 选择航段
				// if (val.target.value === '-1') {
				// 	this.flightOrigin = 0
				// } else {
					this.flightOrigin = this.flightArray[val.target.value]
				// }
				  // this.form.waitLocation = this.numArray[val.detail.value].TYPECODE
				  //       this.index = val.detail.value
			},
			// *********************库位相关内容*************************
			foucsLocation(e) { // 查询库存信息
				if (isEmpty(e.detail.value)) {
					this.$refs.locationInput.setData(this.searchResult)
				}
			},
			// 库位选择列表
			ListShow(e) {
				this.form.locationCode = e.value
				if (!e.value) {
					e.callback(this.searchResult)
				} else {
					let data = []
					this.searchResult.forEach(item => {
						if (item.indexOf(e.value) > -1) {
							data.push(item)
						}
					})
					e.callback(data)
				}
			},
			// 选择库位
			selectCode(item) {
				this.form.locationCode = item
			},
			// ************************弹窗信息相关***************************
			handleClick(e) { // 是否确认入库弹窗按钮
				let index = e.index
				if (index === 0) { // 取消
					this.loading = false
					this.modal = false
				} else { // 确定
					this.putIn()
					this.modal = false
				}
			},
			hide() {
				this.loading = false
				this.modal = false
			},
			// ***************************功能按钮*****************************
			show(val, type) {
				let options = {
					msg: val,
					duration: 2000,
					type: type === 'warning' ? 'warning' : 'green'
				}
				this.$refs.toast.showTips(options)
			},
			reset(val) { // 清空
				// 航段信息
				this.flightOrigin = '' // 清空航段选择
				this.flightArray = [] // 清空航段数组
				this.originDisable = false
				// 其他信息
				this.tableData = []
				this.getFlag = false
				this.equallyFlag = false
				this.uldFlag = false,
					this.frameFlag = false,
					this.form = {
						carrier: '',
						flight: '',
						flightDate: '',
						flightId: '',
						uldType: '',
						uldNo: '',
						uldNoSuffix: '',
						wbPrefix: '',
						wbNo: '',
						numDoc: '',
						locationCode: '',
						frameCode: '',
						numTally: '',
						storageNum: ''
					}
				this.formData = {
					numDoc: '',
					numTally: '',
					storageNum: ''
				}
				let time = this.form.flightDate
				if (val === 'wareHouse') { // 当入库刷新后时间不置空
					this.form.flightDate = time
				} else {
					this.form.flightDate = dayjs().format('YYYY-MM-DD')
				}
			},
			yunClear() { // 清空运单号
				this.form.wbPrefix = ''
				this.form.wbNo = ''
			},
			abnormalRegistration() { // 异常登记
				uni.navigateTo({
					url: `/pages/arrival/abnormalRegister/index?carrier=` + this.form.carrier + '&flight=' + this.form.flight +
						'&flightDate=' + this.form.flightDate + '&wbPrefix=' + this.form.wbPrefix + '&wbNo=' + this.form.wbNo
				})
			},
			close() { // mc close
				if (!isEmpty(this.form.carrier) && !isEmpty(this.form.flight) && !isEmpty(this.form.flightDate)) {
					let data = deepCopy(this.form)
					data.flightDate = dayjs(this.form.flightDate).valueOf()
					mcClose(data).then(res => {
						this.show(res.message)
					})
				} else {
					this.show('请先填写完整航班号以及航班日期', 'warning')
				}
			},
			wbClose() { // 运单理货截关
				if (this.formData.wbId) {
					let data = {
						id: this.formData.wbId
					}
					wbClose(data).then(res => {
						if (res.message) {
							this.show(res.message, res.status === 1 ?
								'green' : 'warning')
						}
					})
				} else {
					this.show('请先提取信息', 'warning')
				}
			},
			// ******************************检验相关信息*****************************
			uldCheck() {
				return new Promise((resolve, reject) => {
					if (this.form.uldType && this.form.uldNo && this.form.uldNoSuffix) {
						existUld(this.form).then(res => {
							if (res.status) {
								this.uldFlag = true
								resolve()
							} else {
								this.uldFlag = false
								reject(res.message)
							}
						})
					} else {
						this.uldFlag = false
						reject('请填写完整的uld信息')
					}
				})
			},
			frameCheck() { // 板架号验证
				return new Promise((resolve, reject) => {
					if (this.form.frameCode !== '') {
						checkFrame({
							uldNo: this.form.frameCode
						}).then(res => {
							if (res.status) {
								this.frameFlag = true
								resolve()
							} else {
								reject('板架号不存在')
							}
						})
					} else {
						reject('请确认是否填写的板架号')
					}
				})
			},
			locationCheck() {
				return new Promise((resolve, reject) => {
					for (let item of this.searchResult) {
						if (this.form.locationCode === item) {
							resolve()
						}
					}
					reject('库位号不存在，请确认')
				})
			},
			flightCheck() { // 航班校验
				return new Promise((resolve, reject) => {
					if (isEmpty(this.form.carrier) || isEmpty(this.form.flight) || isEmpty(this.form.flightDate)) {
						reject('请填写完整航班号以及航班日期')
					} else {
						let data = deepCopy(this.form)
						data.flightDate = dayjs(this.form.flightDate).valueOf()
						checkFlight(data).then(res => {
							if (res.status) {
								resolve(res)
							} else {
								reject(res.message)
							}
						}).catch(() => {
							reject('异常请确认')
						})
					}
				})
			},
			isNormalInteger(str) { // 件数校验
				var n = Math.floor(Number(str));
				return n !== Infinity && String(n) === str && n >= 0
			},
			// ****************************入库操作**********************************
			put() { // 入库操作
				this.flightCheck().then((res) => {
					if (res.data !== '0') {
						this.show('请确认当前航班是否已经mc close', 'warning')
					} else if (isEmpty(this.form.wbNo) || isEmpty(this.form.wbPrefix)) {
						this.show('请填写完整运单号', 'warning')
					} else if (this.formData.isMcClose === '1') {
						this.show('已MC CLOSE，无法入库，请确认', 'warning')
					} else if (this.flightArray.length > 1 && !this.flightOrigin) { // 判断是否选择航段
						this.show('请确认是否选择起始站', 'warning')
					} else if (isEmpty(this.formData.numTally)) {
						this.show('请填写件数', 'warning')
					} else if (!this.isNormalInteger(this.formData.numTally.toString())) {
						this.show('请确认件数为正整数', 'warning')
					} else {
						this.wareHouse()
					}
				}).catch((res) => {
					this.show(res, 'warning')
				})
			},
			wareHouse() {
				// 获取信息
				this.form.numTally = this.formData.numTally
				this.form.uldCode = this.form.uldType + this.form.uldNo + this.form.uldNoSuffix
				let uldFlag = !isEmpty(this.form.uldNo) || !isEmpty(this.form.uldNoSuffix) || !isEmpty(this.form.uldType) // uld正确且存在时为true
				let locationFlag = !isEmpty(this.form.locationCode) // 库位号存在时为true
				let frameFlag = !isEmpty(this.form.frameCode) // 板架号存在时为false
				if ((uldFlag && !locationFlag && !frameFlag) || (!uldFlag && locationFlag && !frameFlag) || (!uldFlag && !
						locationFlag && frameFlag)) {
					if (uldFlag || frameFlag) {
						let flag = uldFlag ? this.uldCheck() : this.frameCheck()
						flag.then(() => {
							this.loading = true
							this.wareHouseApi()
						}).catch((res) => {
							this.show(res, 'warning')
						})
					} else {
						this.locationCheck().then(() => {
							this.loading = true
							this.wareHouseApi()
						}).catch((res) => {
							this.show(res, 'warning')
						})
					}
				} else {
					this.show('uld、板架及座位仅输入一个即可', 'warning')
				}
			},
			wareHouseApi() {
				if (parseFloat(this.form.numTally) > parseFloat(this.form.numDoc)) { // 入库件数超过舱单件数
					this.modal = true
				} else {
					this.putIn()
				}
			},
			putIn() { // 入库
				let data = deepCopy(this.form)
				data.flightDate = dayjs(this.form.flightDate).valueOf()
				this.flightOrigin && (data.origin = this.flightOrigin) // 存在航段的情况
				putIn(data).then(res => {
					this.loading = false
					this.$message(res.message)
					if (res.data) { // 运单号不存在运单表中
						this.reset('wareHouse')
					} else {
						uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
							delta: 1
						});
					}
				}).catch(() => {
					this.loading = false
				})
			},
			// ************************时间相关信息***********************
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
			bindDateChange: function(e) {
				this.form.flightDate = e.target.value
			},
			// *******************************输入信息***************************
			carrierChange(val) { // 承运人
				this.flightFocus = false
				this.form.carrier = val.detail.value.toLocaleUpperCase()
				if (this.form.carrier.length === 2) {
					this.flightFocus = true
				}
			},
			part(val) { // 运单号扫描
				this.form.wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.form.wbNo = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
			},
			prefixChange(val) { // 输入运单前缀
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else {
					this.wbNoFocus = false
					this.form.wbPrefix = val.detail.value.toLocaleUpperCase()
					if (this.form.wbPrefix.length === 3 || this.form.wbPrefix === 'YJ') {
						this.wbNoFocus = true
					}
				}
			},
			yunChange(val) { // 运单号输入
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else {
					this.form.wbNo = val.detail.value.toLocaleUpperCase()
				}
				if (val.detail.value.length == 8) {
					if (!model7(this.form.wbPrefix, this.form.wbNo)) {
						this.$message('运单不符合规则')
						this.form.wbPrefix = ''
						this.form.wbNo = ''
					} else {
						this.getData()
					}
				}
			},
			// **********************uld输入************************************
			uldTypeChange(val) {
				if (val.detail.value.length === 6 || val.detail.value.length === 7) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length)
					this.form.uldNoSuffix = (this.form.uldNoSuffix ? this.form.uldNoSuffix : 'GN')
				} else if (val.detail.value.length >= 8) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length - 2)
					this.form.uldNoSuffix = (val.detail.value.substring(val.detail.value.length - 2, val.detail.value.length)).toLocaleUpperCase()
				} else {
					this.form.uldType = val.detail.value.toLocaleUpperCase()
				}
			},
			uldNoChange(val) {
				if (val.detail.value.length === 6 || val.detail.value.length === 7) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length)
					this.form.uldNoSuffix = (this.form.uldNoSuffix ? this.form.uldNoSuffix : 'GN')
				} else if (val.detail.value.length >= 8) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length - 2)
					this.form.uldNoSuffix = (val.detail.value.substring(val.detail.value.length - 2, val.detail.value.length)).toLocaleUpperCase()
				} else {
					this.form.uldNo = val.detail.value
				}
			},
			uldNoSuffixChange(val) {
				this.form.uldNoSuffix = val.detail.value.toLocaleUpperCase()
			},
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}

	.controlRegister {
		.disable {
			background: #999999;
		}

		.reweightInput {
			// 输入框
			overflow-x: auto;
			text-align: center;
			line-height: 70upx;
			font-size: 35upx;
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
		}

		.red {
			color: #e41c1c;
		}

		.lableWidth {
			width: 150upx;
			text-align: right;
			font-size: 35upx;
			height: 80upx;
			margin-right: 20upx;
			line-height: 80upx;
		}

		.lableWidth2 {
			width: 120upx;
			text-align: left;
			margin-left: 20upx;
			font-size: 35upx;
			height: 80upx;
			line-height: 80upx;
		}

		.lableWidth3 {
			text-align: right;
			height: 80upx;
			line-height: 80upx;
		}

		.flex {
			margin-top: 10upx;
			display: flex;
			flex-direction: row;
			font-size: 35upx;

			// border-bottom: dashed 3upx #e5e5e5;
			button {
				height: 80upx;
				line-height: 80upx;
				margin-right: 30upx;
			}
		}

		.content-top {
			display: flex;
			font-size: 35upx;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx;
			color: #595959;
			padding: 20upx 0;
			border: solid 2upx #e5e5e5;

			.btn {
				display: flex;
				flex-direction: row;
				margin-top: 30upx;
				margin-bottom: 30upx;
				font-size: 35upx;

				button {
					width: 40%;
					color: #FFFFFF;
					background: #0ebf9c;
					border: 1px solid #0ebf9c;
				}
			}

			.row {
				display: flex;
				flex-direction: row;
				padding-top: 30upx;

				.date {
					height: 80upx;
					width: 500upx;
					font-size: 35upx;
					text-align: center;
					line-height: 80upx;
					border: solid 3upx #dbdbdb;
				}
			}

			.flight-input {
				font-size: 35upx;
				text-align: center;
				border: solid 3upx #dbdbdb;
				height: 80upx;
			}

			.row-input {
				font-size: 35upx;
				text-align: center;
				border: solid 3upx #dbdbdb;
				width: 250upx;
				height: 80upx;
			}

			.wb-input {
				font-size: 35upx;
				text-align: center;
				margin-left: 0;
				border: solid 3upx #dbdbdb;
				border-left: 0;

				input {
					font-size: 35upx;
					text-align: center;
					height: 76upx;
				}
			}

			.flight {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-top: 10upx;

				.left {
					display: flex;
					flex-direction: column;

					.text {
						font-size: 35upx;
						padding-left: 30upx;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					text-align: right;

					text {
						font-size: 35upx;
						padding-right: 30upx;
					}
				}
			}
		}

		.middle-text {
			font-size: 32upx;
			font-weight: bold;
			margin-left: 40upx;

			.circle {
				width: 20upx;
				height: 20upx;
				background: #fdb332;
				border-radius: 25upx;
				text-align: center;
				line-height: 20upx;
				font-size: 33upx;
				display: inline-block;
			}
		}

		.content-middle {
			display: flex;
			font-size: 35upx;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx;
			color: #595959;
			padding: 20upx 0 10upx 0;
			border: solid 2upx #e5e5e5;

			.bottom {
				display: flex;
				flex-direction: row;
				text-align: center;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 0;
				background-color: #f7f7f7;
				font-size: 35upx;
				border: solid 0upx #e5e5e5;

				>text {
					margin: auto;
				}
			}

			.list-item {
				background: #ffffff;
				padding: 30upx 0;
				flex-direction: row;
				display: flex;
				text-align: center;
				font-size: 35upx;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 0upx #e5e5e5;

				>text {
					margin: auto;
				}
			}

			.num {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin: 10upx 30upx;

				.circle {
					width: 20upx;
					height: 20upx;
					background: #fdb332;
					border-radius: 25upx;
					text-align: center;
					line-height: 30upx;
					font-size: 33upx;
					display: inline-block;
				}

				.num-right {
					.numColor {
						width: 70upx;
					}
				}

				text {
					height: 80upx;
					line-height: 80upx;
					font-size: 35upx;
				}
			}
		}

		.bottom {
			display: flex;
			font-size: 35upx;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx;
			color: #595959;
			padding: 20upx 0 10upx 0;
			border: solid 2upx #e5e5e5;

			// .search-result::before {
			// 	display: none;
			// }
			// .search-result::after {
			// 	display: none;
			// }
			.tui-list {
				background-color: #fff;
				z-index: 100;
				position: absolute;
				width: 332upx;
				// top: 1150upx;
				// height: 80upx;
				padding-left: 30upx;
				// padding-right: 20upx;
				display: flex;
				flex-direction: column;

				// padding-bottom: env(safe-area-inset-bottom);
				.tui-list-cell {
					display: flex;
					flex-direction: row;
					height: 80upx;
					justify-content: space-between;
					align-items: center;
					width: 100%;
				}

				.tui-list-cell-hover {
					background-color: #eee !important;
				}

				.tui-list-cell-navigate {
					width: 100%;
					position: relative;
					height: 80upx;
					line-height: 80upx;
					text-align: left;
					// padding: 30upx 0 30upx 30upx;
					font-size: 28upx;
					color: #333;
					background: #1CBBB4;
				}
			}

			.bottom-last {
				font-size: 35upx;
				display: flex;
				flex-direction: row;
				margin-top: 30upx;
				margin-bottom: 20upx;

				.uld-input {
					font-size: 35upx;
					text-align: center;
					border: solid 3upx #dbdbdb;
					width: 174upx;
					height: 80upx;
				}
			}

			.lableWidth4 {
				text-align: right;
				height: 80upx;
				margin-left: 30upx;
				margin-right: 20upx;
				line-height: 80upx;
			}

			.bottom-top {
				font-size: 35upx;
				display: flex;
				flex-direction: row;
				margin-top: 10upx;

				.search-bar-input {
					font-size: 35upx;
					text-align: center;
					line-height: 80upx;
					border: solid 3upx #dbdbdb;
					width: 190upx;
					height: 80upx;
				}

				.pick-text {
					font-size: 35upx;
					text-align: center;
					line-height: 80upx;
					border: solid 3upx #dbdbdb;
					width: 185upx;
					height: 80upx;
				}
			}
		}

		.row-btn {
			margin-top: 30upx;
			display: flex;
			flex-direction: row;

			button {
				width: 40%;
			}
		}

		.btn {
			margin-top: 30upx;
			margin-bottom: 30upx;

			button {
				width: 86%;
				background: #0ebf9c;
				color: #FFFFFF;
				border: solid 3upx #0ebf9c;
			}
		}
	}
</style>
