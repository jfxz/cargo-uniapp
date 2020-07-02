<template>
	<view style="overflow-x: hidden;">
		<msg-tip ref="toast"></msg-tip>
		<view class="weightNum">
			<view class="left">
				<text>磅秤号</text>
				<view class="right">
					<input class="input-num" :focus="wbNumFocus" @focus="weightNumFocus" @blur="weightNumChange" v-model="form.bangNum"/>
					<!-- <picker @change="weightNumChange" :value="form.bangNum" range-key="aisleName" :range="numArray">
						<view class="pick-text">{{numArray[form.bangNum].aisleName}}</view>
					</picker> -->
				</view>
			</view>
			<view class="right">
				<text>磅秤重量</text>
				<input class="input-num" @input="bangwChange" :value="form.bangWeight" type="number" />
			</view>
		</view>
		<view class="san">
			<view class="san-text">
				<text>散货</text>
				<checkbox-group style="display:initial;" @change="sanChange">
					<checkbox :value="form.sanHuo" :checked="sanDisabed" />
				</checkbox-group>
				<view class="uldFlight">
					<text class="label">航班号：</text>
					<text class="value">{{uldFlight ? uldCarrier + uldFlight : ''}}</text>
				</view>
				
			</view>
			
		</view>
		<view class="uldNum">
			<view class="top">
				<text>ULD号</text>
				<input :disabled="sanDisabed" @input="uldTypeChange" @focus="typeFocus" :focus="uldblur" @blur="uldInfoblur" :class="['input-num', sanDisabed ? 'disable' : '']" :value="form.uldType" />
				<input :disabled="sanDisabed" @input="uldNoChange" :focus="uldNumFocus" @focus="noFocus" @blur="uldInfoblur"
				class="input-num num2" :value="form.uldNo" 
				:style="{'margin-left': 0,'border-left': 0,background: sanDisabed ? '#999999' : ''}" />
				<input :disabled="sanDisabed" @input="uldSubPrefixChange" @blur="uldInfoblur" class="input-num num2" :value="form.uldSubPrefix" 
				:style="{'margin-left': 0,'border-left': 0,background: sanDisabed ? '#999999' : ''}" />
			</view>
			<view class="mid">
				<view class="right">
					<text>ULD自重</text>
					<input :disabled="sanDisabed" style="font-weight: bold;" @input="selfWeightChange" type="number" @focus="focus" :class="['input-num', sanDisabed ? 'disable' : '']" :value="form.uldSelfWeight" />
				</view>
				<view class="right">
					<text >整车体积</text>
					<input :disabled="sanDisabed" type="number" @input="zhengwbVolChange" @focus="focus" :class="['input-num', sanDisabed ? 'disable' : '']" :value="form.zhengwbVol" />
				</view>
			</view>
			<view class="bottom">
				<view class="check">
					<checkbox-group style="display:initial;" @change="banChange">
						<checkbox :value="form.banJia" :disabled="sanDisabed" :checked="banDisabed" />
					</checkbox-group>
					<text>板架号码</text>
				</view>
				<input @focus="focus" @input="banJia1Change" @blur="banBlur" :disabled="!banDisabed" :class="['input-num', !banDisabed ? 'disable' : '']" :value="form.banJia1" />
				<input @focus="focus" disabled class="input-num disable" :value="form.banJia2" />
			</view>
		</view>
		<view class="zhan"></view>
		<view class="uldStatus">
			<view class="top">
				<view class="left">
					<text class="title" :value="uldStatus">ULD状态</text>
					<text class="contend">{{formatUldStatus(form.uldStatus)}}</text>
				</view>
				<view class="right">
					<text class="title">皮重</text>
					<text class="contend">{{piWeight}}</text>
				</view>
			</view>
			<view class="top" style="margin-top: 20upx;">
				<view class="left">
					<text class="title">重量</text>
					<text class="contend">{{weight}}</text>
				</view>
				<view class="right">
				</view>
			</view>
		</view>
		<view class="zhan"></view>
		<view class="yun">
			<view class="top">
				<text @tap="jumpWb">运单号</text>
				<input @focus="focus" @blur="yunblur" style="margin-left: 10rpx;" :focus="yunFocus" @input="wbPrefixChange" class="input-num" :value="form.wbPrefix" />
				<!-- <input @focus="focus" class="input-num" @input="wbNoChange" @blur="wbNoBlur" :value="form.wbNo" style="margin-left: 0;border-left: 0;width: 50%" /> -->
			<!-- <cInput type="text" @input="wbNoChange" @blur="wbNoBlur" @clear="clear" :value="form.wbNo" placeholder="请输入运单号"></cInput> -->
				<view class="clearInput">
					<input @focus="focus" class="input-num" @input="wbNoChange" @blur="wbNoBlur" :focus="yunNumFocus" :value="form.wbNo" style="margin-left: 0;border-left: 0;width: 100%"/>
					<view class="uni-icon uni-icon-clear" v-if="form.wbNo" @click="clear"></view>
					<!-- <icon type="clear" v-if="form.wbNo" @tap="clear"/> -->
				</view>
			
			</view>
			<view class="bottom">
				<view class="flex">
					<text >件数</text>
					<input @focus="focus" type="number" @input="wbNumChange" class="input-num" :value="form.wbNum" />
				</view>
				<view class="flex">
					<text >体积</text>
					<input @focus="focus" type="number" @input="wbVolChange" class="input-num" :value="form.wbVol" />
				</view>
			</view>
			<view class="btn-flex">
				<button type="primary" plain="true" @click="next">下一票</button>
				<button type="primary" @click="guobang" :loading="guoLoading" :disabled="guoLoading" plain="true">过磅录入</button>
			</view>
			<view class="zhan"></view>
			<view class="remark">
				<view class="remark_contend">
					<picker @change="remarkTypeChange" :value="typeNum" :range="typeArray" range-key="label" >
						<view class="pick-text">{{typeArray[typeNum].label}}</view>
						<uni-icons type="arrowdown" size="30"></uni-icons>
					</picker>
					<textarea placeholder="请输入ULD备注" @input="remarkChange" :value="form.remark"/>
				</view>
				<!-- <textarea placeholder="请输入ULD备注" @input="remarkChange" :value="form.remark"/> -->
				<button type="primary" plain="true" @click="saveRemark">保存备注</button>
			</view>
			<view class="next print">
				<button type="primary" @click="next('uld')">打印挂签</button>
			</view>
			<view class="next">
				<button type="primary" @click="next('uld')">下一个ULD</button>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="该ULD已复称,是否继续录入?"></tui-modal>
		<tui-modal :show="outModal" @click="handleOutClick" title="提示" content="该ULD为离港状态,是否继续录入?"></tui-modal>
		<tui-modal :show="modalFlight" @click="handleClickFlight" title="提示" content="运单航班与ULD航班不一致！是否继续过磅"></tui-modal>
		<tui-modal :show="numModal" @click="handleClickNumModal" title="提示" content="过磅录入件数大于等于预录入件数"></tui-modal>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import {WebSocket} from '@/common/util/websocket-uni.js'
	import Stomp from "stompjs"
	import msgTip from '@/components/tip/tip.vue'
	import cInput from '@/components/clearInput.vue'
	import { mapGetters } from 'vuex'
	import {model7} from '@/common/util/util.js'
	import tuiModal from "@/components/modal"
	import dayjs from '@/common/util/dayjs.min.js'
	import {delUldPreFlight, getUldRemark, getUld, getUldInfo, getWbInfo, getFrameInfo, judgeAllow, postWeight, saveRemark, getBang} from '@/common/api/weight/api.js'
	export default {
		components: {
			tuiModal, msgTip, uniIcons, cInput
		},
		data() {
			return {
				wbNumFocus: true,
				yunNumFocus: false,
				uldNumFocus: false, 
				numModal: false,
				typeNum: -1,
				typeArray: [],
				exchange: null,
				client: null,
				guoLoading: false,
				modalFlight: false,
				outModal: false,
				uldblur: false,
				yunFocus: false,
				modal: false,
				banDisabed: false,
				sanDisabed: false,
				uldFlight: '',
				uldFlightDate: '',
				uldCarrier: '',
				wbCarrier: '',
				wbFlight: '',
				wbFlightDate: '',
				inputNo: 0,
				form: {
					uldPreFlag: false,
					isSubmit: '',
					isFlight: '',
					curwgt: 0,
					bangNum: '',
					bangWeight: 0,
					sanHuo: '',
					uldSubPrefix: 'GN',
					uldNo: '',
					uldType: 'CAR',
					uldSelfWeight: 0,
					zhengwbVol: 0,
					banJia: '',
					banJia1: '',
					banJia2: 0,
					uldStatus: '',
					wbPrefix: '',
					wbid: '',
					uldid : '',
					packmancode: null,
					proxy: '',
					uldWeight: '',
					wbNo: '',
					wbNum: '',
					wbVol: '',
					remark: '',
					wbOrigin: '',
					wbDestination: '',
					wbTransitAirport: '',
					uldOrigin: '',
					uldDestination: ''
				},
				numArray: []
			}
		},
		computed: {
			...mapGetters(['dic']),
			piWeight () {
				if (this.sanDisabed) {
					return 0
				}
				// car
				if (this.form.uldType === 'CAR') {
					console.log('uldSelfWeight', this.form.uldSelfWeight, 'curwgt', this.form.curwgt)
					return (Number(this.form.uldSelfWeight) + Number(this.form.curwgt)).toFixed(1)
				}
				// !car
				if (this.form.uldType !== 'CAR') {
					return (Number(this.form.banJia2) + Number(this.form.curwgt)).toFixed(1)
				}
				return 0
			},
			weight () {
				// car
				if (this.form.uldType === 'CAR' && this.form.bangWeight !== '') {
					return (Number(this.form.bangWeight) - Number(this.piWeight)).toFixed(1)
				}
				// !car
				if (this.form.uldType !== 'CAR' && this.form.bangWeight !== '') {
					return (Number(this.form.bangWeight) - Number(this.piWeight) - Number(this.form.uldSelfWeight)).toFixed(1)
				}
				return 0
			}
		},
		beforeDestroy () {
			this.wbNumFocus = false
			this.exchange = null
			uni.closeSocket()
		},
		/* onHide () {
			this.exchange = null
			uni.closeSocket()
		}, */
		mounted () {
			this.wbNumFocus = true
			this.$on('flashUld', this.getUldMsg)
			this.$on('checkWb', () => {
				if (!this.form.wbNo) {
					getApp().globalData.wbForm = {}
				}
			})
			getUldRemark().then(res => {
				this.typeArray = res.data.map(item => {
					console.log(item, item.split('：'))
					return {
						label: item.split('：')[0],
						value: item
					}
				})
				console.log(this.typeArray)
			})
			this.resetData()
			// this.connectInit()
			getBang().then(res => {
				this.numArray = res.data
			})
		},
		created() {
			uni.$on('connectFail', this.onFailed)
			// this.connect()
		},
		methods: {
			typeFocus () {
				this.form.uldType = ''
			},
			noFocus () {
				this.form.uldNo = ''
			},
			resetData () {
				getApp().globalData.uldForm = {}
				getApp().globalData.wbForm = {}
			},
			remarkTypeChange (val) {
				if (val.target.value === '-1') {
					this.typeNum = 0
				} else {
					this.typeNum = Number(val.target.value)
				}
				this.form.remark = this.typeArray[this.typeNum].value
			},
			connectInit () {
				console.log(this.exchange)
				this.client = Stomp.client('ws://172.17.6.61:15674/ws')
				// this.client = Stomp.client('ws://10.1.16.50:15674/ws')
				 const headers = {
					login: 'cargo.scale',
					passcode: 'cargo.scale'
					// login: 'root',
					// passcode: 'root'
				};
				this.client.connect(headers.login, headers.passcode, this.onConnected, this.onFailed, 'xmn.scale')	// xmn.scale, cargoWgt
			},
			onConnected(frame) {
				console.log(this.exchange)
					// this.exchange = "ROOT.WGT";
					this.client.subscribe(this.exchange, this.responseCallback, {'auto-delete': false, 'x-max-length': 10});
			},
			onFailed(frame) {
				console.log('error2', frame)
					this.$message('连接mq失败！请检查网络设置')
			},
			responseCallback(frame) {
				/* uni.showModal({
					content: frame.body,
					showCancel: false
				}); */
				this.form.bangWeight = Number(frame.body)
					console.log("得到的消息" + frame.body);
					//接收到服务器推送消息，向服务器定义的接收消息routekey路由rk_recivemsg发送确认消息
					// this.client.send("ROOT.WGT", {"content-type":"text/plain"}, '123123');
			},
			yunblur () {
				this.yunFocus = false
				if (this.form.wbNo.length === 8) {
					this.getWbMsg()
				}
				// uni.hideKeyboard()
			},
			jumpWb () {
				this.$emit('jumpWb')
			},
			save () {
				let para = {
					uldId: this.form.uldid,
					flghtDate: dayjs(this.uldFlightDate).format('YYYY-MM-DD'),
					carrier: this.uldCarrier,
					flight: this.uldFlight,
					packMan: this.form.packmancode,
					uldWeight: this.form.uldWeight,
					loadVol: this.form.zhengwbVol,
					shapeCode: this.form.banJia1,
					origin:  this.form.uldOrigin,
					destination:  this.form.uldDestination,
					remark : this.form.remark
				}
				console.log(222, para)
				getUld(para).then(res => {
					// let options = {
					// 	msg: res.message,
					// 	duration: 2000,
					// 	type: 'green'
					// }
					// this.$refs.toast.showTips(options)
				})
			},
			guobang (flag) {
				console.log(this.form.uldDestination, this.form.wbDestination)
				if (this.weight <= 0) {
					this.$message('重量不能小于0')
					return
				}
				if (this.form.isSubmit === '1') {
					this.$message('运单已交单，无法过磅')
					return
				}
				if (this.form.isFlight === '1') {
					this.$message('运单已运单配上航班，无法过磅')
					return
				}
				if (!this.form.uldid && !this.sanDisabed) {
					this.$message('请输入uld号')
					return
				}
				if (this.form.wbTransitAirport !== this.form.uldDestination) {
					if (!this.sanDisabed && this.form.uldDestination !== this.form.wbDestination) {
						this.$message('运单目的站（中转站）与ULD航班信息不一致，请核实！')
						return
					}
				}
				console.log('sanDisabed', this.sanDisabed)
				if (!this.sanDisabed && this.form.uldStatus !== '2' && this.form.uldStatus !== '1') {
					this.$message('ULD非装货(或正常)状态! 无法过磅')
					return
				}
				console.log(this.form, this.inputNo)
				let flightDate = this.uldFlightDate || this.wbFlightDate
				let para = {
					carrier: this.uldCarrier || this.wbCarrier,
					flight: this.uldFlight || this.wbFlight,
					flightDate:flightDate ? dayjs(flightDate).format('YYYY-MM-DD') : '',
					vol : this.form.wbVol
				}
				if (flag === 'sure') {
					if (!this.sanDisabed) {
						this.save()
					}
					this.judgeAllowFun(para)
				} else {
					if (this.form.bangNum === '') {
						this.$message('磅秤号不能为空！')
					}
					/* if (!this.sanDisabed && (this.uldFlight !== this.wbFlight || this.uldFlightDate !== this.wbFlightDate ||
							this.uldCarrier !== this.wbCarrier)) {
								this.$message('运单目的站（中转站）与ULD航班信息不一致，请核实')
								uni.hideLoading()
					} else */if (this.form.wbNum <= 0) {
						this.$message('过磅录入件数必须大于0')
					} else if (this.form.wbVol <= 0) {
						this.$message('过磅录入体积必须大于0')
					}	else if (this.form.wbNum > this.inputNo) {
						this.numModal = true
					} else {
						if (!this.sanDisabed) {
							this.save()
						}
						this.judgeAllowFun(para)
					}
				}
				
			},
			judgeAllowFun (para) {
				if (this.form.bangNum !== '') {
					// this.guoLoading = true
					this.$loading('录入中...')
					judgeAllow(para).then(res => {
						/* res.data.controlVol = '0'
						res.data.flightControlLock = '0'
						res.data.fourCtrl = '0'
						res.data.isOverCloseTime = '0'
						res.data.isOverCtrlTime = '0'
						res.data.isOverVol = '0' */
						if (res.data.isOverCloseTime === '1') {
							this.$message('已超出过磅截关时间')
						}
						if (res.data.isOverVol === '1') {
							let that = this
							uni.showModal({
								title: '提示',
								showCancel: false,
								content: '航班入库总体积超过标准装货体积一定幅度',
								success: function (res2) {
									if (res2.confirm) {
										if (res.data.controlVol === '1') {
											that.$message('状态为控舱，无法录入')
											that.delUldPre()
											uni.hideLoading()
										} else {
											if (res.data.flightControlLock === '1') {
												that.$message('航班解锁，无法录入')
												that.delUldPre()
												uni.hideLoading()
											} else {
													if (res.data.fourCtrl === '1' && res.data.isOverCtrlTime === '1') {
														that.$message('超过4小时控舱时间，无法过磅')
														that.delUldPre()
														uni.hideLoading()
													} else {
														let para = {
															tareWeigh: this.piWeight,
															wbPrefix: that.form.wbPrefix,
															wbno: that.form.wbNo,
															uldid: that.form.uldid,
															uldRemark: that.form.remark,
															uldtype: that.form.uldType,
															uldnum: that.form.uldNo,
															uldsuffix: that.form.uldSubPrefix,
															isBulk: that.sanDisabed ? 1 : 0,
															wgt: that.weight,
															num: that.form.wbNum,
															vol: that.form.wbVol,
															wgtfee: '',
															chanel: this.form.bangNum,
															uldRemark: that.form.remark
														}
														let getWb = getApp().globalData.wbForm
														para = {...getWb, ...para}
														postWeight(para).then(res => {
															if (res.status) {
																// let options = {
																// 	msg: res.message,
																// 	duration: 1000,
																// 	type: 'green'
																// }
																// that.$refs.toast.showTips(options)
																this.$emit('jumpGoods')
																that.form.wbPrefix = ''
																that.form.wbNo = ''
																that.form.wbNum = ''
																that.form.wbVol = ''
																that.getUldMsg()
															} else {
																that.$message(res.message)
																that.delUldPre()
															}
															uni.hideLoading()
														}).catch(() => {
															uni.hideLoading()
															that.$message('录入失败')
															that.delUldPre()
														})
													}
												
											}
										}
									}
								}
							})
						} else {
								if (res.data.fourCtrl === '1' && res.data.isOverCtrlTime === '1') {
									this.$message('超过4小时控舱时间，无法过磅')
									this.delUldPre()
									uni.hideLoading()
								} else {
									let para = {
										wbPrefix: this.form.wbPrefix,
										wbno: this.form.wbNo,
										uldid: this.form.uldid,
										uldRemark: this.form.remark,
										uldtype: this.form.uldType,
										uldnum: this.form.uldNo,
										uldsuffix: this.form.uldSubPrefix,
										isBulk: this.sanDisabed ? 1 : 0,
										wgt: this.weight,
										num: this.form.wbNum,
										vol: this.form.wbVol,
										wgtfee: '',
										tareWeigh: this.piWeight,
										chanel: this.form.bangNum,
										uldRemark: this.form.remark
									}
									let getWb = getApp().globalData.wbForm
									para = {...getWb, ...para}
									postWeight(para).then(res => {
										uni.hideLoading()
										if(res.status) {
											// let options = {
											// 	msg: res.message,
											// 	duration: 1000,
											// 	type: 'green'
											// }
											// this.$refs.toast.showTips(options)
											this.$emit('jumpGoods')
											this.form.wbPrefix = ''
											this.form.wbNo = ''
											this.form.wbNum = ''
											this.form.wbVol = ''
											this.getUldMsg()
											uni.hideLoading()
										} else {
											uni.hideLoading()
											this.$message(res.message)
											this.delUldPre()
										}
									}).catch(() => {
										uni.hideLoading()
										this.delUldPre()
									})
								}
							
						}
					})
				}
			},
			delUldPre () {
				console.log('uldPreFlag', this.form.uldPreFlag)
				if (!this.form.uldPreFlag) {
					delUldPreFlight({uldId: this.form.uldid}).then(res => {
					})
				}
			},
			banJia1Change (val) {
				console.log(val)
				this.form.banJia1 = val.detail.value
			},
			banBlur () {
				if (this.form.banJia1) {
					getFrameInfo({frameNo: this.form.banJia1}).then(res => {
						if (res.status) {
							this.form.banJia2 = res.data
						} else {
							this.$message(res.message)
						}
					})
				}
				
			},
			clear () {
				this.form.wbNo = ''
				this.form.wbPrefix = ''
				this.form.wbVol = ''
				this.form.wbNum = ''
				this.$set(this.form, 'wbNo', '')
				this.$set(this.form, 'wbPrefix', '')
				getApp().globalData.wbForm = {}
			},
			formatUldStatus (status) {
				let match = this.dic.uldType_dic.find(item =>  item.TYPECODE === status)
				if (match) {
					return match.TYPENAME
				}
				return ''
			},
			part (val) {
				let wbNum = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
				let wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.form.wbPrefix = wbPrefix
				this.form.wbNo = wbNum
			},
			wbPrefixChange (val) {
				this.yunNumFocus = false
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else {
					this.form.wbPrefix = val.detail.value.toLocaleUpperCase()
					let wbPrefix = this.form.wbPrefix
					let flag = wbPrefix === 'YJ' || wbPrefix.length === 3
					if (flag) {
						this.yunFocus = false
						this.yunNumFocus = true
					}
				}
			},
			wbNoChange (val) {
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else if (val.detail.value.length > 8) {
					this.form.wbNo = ''
					setTimeout(() => {
						this.form.wbNo = val.detail.value.substr(0, 8)
					}, 100)
					this.$message('运单号超出8位限制!')
					return
				} else {
					this.form.wbNo = val.detail.value
				}
			},
			uldInfoblur () {
				this.uldNumFocus = false
				if (!this.form.uldType) {
					this.form.uldType = 'CAR'
				}
				this.getUldMsg()
			},
			uldSubPrefixChange (val) {
				this.form.uldSubPrefix = val.detail.value.toLocaleUpperCase()
			},
			uldNoChange (val) {
				console.log(123456, val.detail.value, val.detail.value.length)
				if (val.detail.value.length === 6 || val.detail.value.length === 7) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length)
					this.form.uldSubPrefix = 'GN'
				} else if (val.detail.value.length >= 8) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length - 2)
					this.form.uldSubPrefix = (val.detail.value.substring(val.detail.value.length - 2, val.detail.value.length)).toLocaleUpperCase()
				} else {
					this.form.uldNo = val.detail.value
				}
				console.log('type', this.form.uldType, 'uldNo', this.form.uldNo, 'uldSubPrefix', this.form.uldSubPrefix)
			},
			uldTypeChange (val) {
				console.log('type', val.detail.value)
				if (val.detail.value.length === 3) {
					this.form.uldType = val.detail.value.toLocaleUpperCase()
				}
				if (val.detail.value.length === 6 || val.detail.value.length === 7) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length)
					this.form.uldSubPrefix = 'GN'
				} else if (val.detail.value.length >= 8) {
					this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
					this.form.uldNo = val.detail.value.substring(3, val.detail.value.length - 2)
					this.form.uldSubPrefix = (val.detail.value.substring(val.detail.value.length - 2, val.detail.value.length)).toLocaleUpperCase()
				}
				console.log('type', this.form.uldType, 'uldNo', this.form.uldNo, 'uldSubPrefix', this.form.uldSubPrefix)
			},
			resUld () {
				this.form.uldNo = ''
				this.form.uldSelfWeight = 0
				this.form.zhengwbVol = 0
				this.form.uldStatus = ''
				this.form.uldid  = ''
				this.form.curwgt = 0
				this.uldCarrier = ''
				this.uldFlight = ''
				getApp().globalData.uldForm = {}
			},
			getUldMsg () {
				if (this.form.uldSubPrefix && this.form.uldNo && this.form.uldType) {
					let uldForm = {
						uldSubPrefix: this.form.uldSubPrefix,
						uldNo: this.form.uldNo,
						uldType: this.form.uldType
					}
					getUldInfo(uldForm).then(res => {
						if (!res.data || !res.data.uldinfo) {
							getApp().globalData.uldForm = {}
							this.$message('ULD不存在')
							this.form.uldSelfWeight = 0
							this.form.zhengwbVol = 0
							this.form.uldStatus = ''
							this.uldFlight = ''
							this.uldCarrier = ''
							// this.resUld()
						} else if (res.data.uldinfo) {
							if (res.data.uldinfo.REWEIGH_STATUS === '1') {
								this.modal = true
							}
							this.form.uldPreFlag = Boolean(res.data.uldinfo.FLIGHT)
							this.form.uldSelfWeight = res.data.uldinfo.ULD_WGT
							this.form.curwgt = res.data.uldinfo.CURWGT // 已过磅的重量
							this.form.zhengwbVol = res.data.uldinfo.ULD_VOL || 0
							this.form.uldStatus = res.data.uldinfo.ULD_STATUS
							this.form.uldid = res.data.uldinfo.ULDID
							this.uldFlight = res.data.uldinfo.FLIGHT || this.wbFlight
							this.uldFlightDate = res.data.uldinfo.FLIGHT_DATE || this.wbFlightDate
							this.uldCarrier = res.data.uldinfo.CARRIER || this.wbCarrier
							this.form.remark = res.data.uldinfo.ULD_REMARK
							this.form.packmancode = res.data.uldinfo.PACK_MAN
							this.form.uldWeight = res.data.uldinfo.ULD_WEIGHT
							this.form.uldOrigin = res.data.uldinfo.ULD_ORIGIN || this.form.wbOrigin
							this.form.uldDestination = res.data.uldinfo.ULD_DESTINATION	|| this.form.wbDestination
							getApp().globalData.uldForm = Object.assign({}, this.form, {uldFlight: this.uldFlight, carrier: this.uldCarrier, uldFlightDate: this.uldFlightDate})
							if (this.form.uldStatus === '5') {
								this.outModal = true
							} else {
								if (this.form.uldStatus !== '2' && this.form.uldStatus !== '1') {
									this.$message('ULD非装货(或正常)状态!')
								}
							}
							
							let flag =  (dayjs(res.data.uldinfo.DEP_TIME_SCHEDULE).subtract(res.data.uldinfo.AHEADTIME, 'minute')).isBefore(dayjs().valueOf())
							// let flag =  dayjs(res.data.uldinfo.LOAD_OFF_TIME).isBefore(dayjs().valueOf())
							console.log(flag)
							if (flag && res.data.uldinfo.DEP_TIME_SCHEDULE) {
								this.$message('航班截关时间已到')
							}
							if (this.form.uldStatus !== '5' && res.data.uldinfo.REWEIGH_STATUS !== '1') {
								this.uldNumFocus = false
								this.yunFocus = true
							}
						} else {
							getApp().globalData.uldForm = {}
							// this.$message(res.message)
						}
					})
				} else {
					getApp().globalData.uldForm = {}
					this.resUld()
				}
			},
			hide () {
				// this.modal = false
			},
			handleClickNumModal (e) {
				let index = e.index
				if (index === 0) {
					this.$message('已取消')
				} else {
					this.guobang('sure')
				}
				this.numModal = false
			},
			handleOutClick (e) {
				let index = e.index
				if (index === 0) {
					this.form.uldNo = ''
					this.form.uldType = 'CAR'
					this.form.uldSubPrefix = 'GN'
					this.resUld()
					this.uldblur = true
				} else {
					this.yunFocus = true
				}
				this.outModal = false
			},
			handleClickFlight (e) {
				let index = e.index
				if (index === 0) {
					this.form.wbPrefix = ''
					this.form.wbNo = ''
					getApp().globalData.wbForm = {}
				}
				this.modalFlight = false
			},
			handleClick (e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
					this.form.uldNo = ''
					this.uldblur = true
				} else {
					this.modal = false
					this.yunFocus = true
				}
			},
			next (flag) {
				this.sanDisabed = false
				if (flag === 'uld') {
					this.uldFlight = ''
					this.uldCarrier = ''
					this.uldFlightDate = ''
					this.wbCarrier = ''
					this.wbFlight = ''
					this.inputNo = ''
					this.wbFlightDate = ''
					this.banDisabed = false
					Object.keys(this.form).forEach(item => {
						if (item !== 'bangNum' && item !== 'bangWeight') {
							this.form[item] = ''
						}
					})
					this.form.uldSelfWeight = 0
					this.form.zhengwbVol = 0
					// this.form.bangWeight = 0
					this.form.uldType = 'CAR'
					this.form.uldSubPrefix = 'GN'
					this.uldNumFocus = true
					getApp().globalData.uldForm = {}
					uni.pageScrollTo({
					    scrollTop: 0,
					    duration: 300
					})
				} else {
					Object.keys(this.form).forEach(item => {
						if (flag === 'uld' || (item !== 'bangNum' && item !== 'banJia' && item !== -'banJia1' && item !== 'banJia2'
						&& item !== 'bangWeight' && item !== 'uldSubPrefix' && item !== 'uldNo' && item !== 'uldType' && item !== 'zheng'
						&& item !== 'uldSelfWeight' && item !== 'uldStatus')) {
							this.form[item] = ''
						}
					})
					this.getUldMsg()
				}
				// this.form.zhengwbVol = 0
			},
			saveRemark () {
				if (this.form.uldid) {
					let para = {
						uldid: this.form.uldid,
						uldRemark: this.form.remark
					}
					saveRemark(para).then(res => {
						if (res.status) {
							let options = {
								msg: '保存备注成功',
								duration: 2000,
								type: 'green'
							}
							this.$refs.toast.showTips(options)
						}
						console.log(res)
					})
				}
			},
			wbNoBlur () {
				this.getWbMsg()
			},
			getWbMsg () {
					if (!model7(this.form.wbPrefix, this.form.wbNo) || this.form.wbNo.length !== 8) {
						uni.showToast({
							title: '运单不符合规则',
							duration: 2000,
							icon:'none'
						})
					} else {
						let wbForm = {
							wbPrefix: this.form.wbPrefix,
							wbNo: this.form.wbNo
						}
						getWbInfo(wbForm).then(res => {
							if (!res.data) {
								this.$message('该运单未预录入')
								getApp().globalData.wbForm = {}
							} else if (res.data) {
								console.log(res.data.flight, this.uldFlight)
								if (this.uldFlight) {
									if (res.data.flight !== this.uldFlight || res.data.carrier !== this.uldCarrier || res.data.flightDate !== this.uldFlightDate) {
										this.modalFlight = true
									}
								} else {
									if (this.form.uldid) {
										this.uldFlight = res.data.flight
										this.uldCarrier = res.data.carrier
										this.uldFlightDate = res.data.flightDate
										getApp().globalData.uldForm = Object.assign({}, this.form, {uldFlight: this.uldFlight, carrier: this.uldCarrier, uldFlightDate: this.uldFlightDate})
									}
								}
								
								if (res.data.isSubmit === '1') {
									this.$message('运单已交单，无法过磅')
								}
								if (res.data.meta.isFlight === '1') {
									this.$message('运单已配上航班，无法过磅')
								}
									// this.form.wbNum = res.data.wbNum
									// this.form.wbVol = res.data.wbVol
									this.form.isSubmit = res.data.isSubmit
									this.form.isFlight = res.data.meta.isFlight
									this.form.wbid  = res.data.id
									this.form.proxy = res.data.proxy
									this.wbCarrier = res.data.carrier
									this.wbFlight = res.data.flight
									this.inputNo = res.data.inputNo
									this.wbFlightDate = res.data.flightDate
									this.form.wbDestination = res.data.destination
									this.form.wbOrigin = res.data.origin
									this.form.wbTransitAirport = res.data.transitAirport
									if (!this.form.uldDestination) {
										this.form.uldDestination = this.form.wbDestination
										this.form.uldOrigin = this.form.wbOrigin
									}
									getApp().globalData.wbForm = Object.assign({}, this.form, res.data,{wbCarrier: this.wbCarrier, wbFlight: this.wbFlight, wbFlightDate: this.wbFlightDate})
									console.log('uldFlight', getApp().globalData.wbForm)
								
							}
						})
					}
			},
			bangwChange (val) {
				this.form.bangWeight = val.detail.value
			},
			banChange (val) {
				if (val.detail.value.length >= 1) {
					this.banDisabed = true
				} else {
					this.banDisabed = false
					this.form.banJia1 = ''
					this.form.banJia2 = 0
				}
			},
			sanChange (val) {
				if (val.detail.value.length >= 1) {
					this.sanDisabed = true
					this.banDisabed = false
					this.form.banJia1 = ''
					this.form.banJia2 = 0
					this.resUld ()
				} else {
					this.sanDisabed = false
					this.form.uldSubPrefix = 'GN'
					this.form.uldType = 'CAR'
				}
				this.uldCarrier = ''
				this.uldFlight = ''
				getApp().globalData.uldForm = {}
			},
			focus () {
				// uni.hideKeyboard()
			},
			remarkChange (val) {
				this.form.remark = val.detail.value
			},
			wbNumChange (val) {
				this.form.wbNum = Number(val.detail.value)
				if (this.form.wbNum <= 0) {
					this.$message('件数要大于0')
					this.form.wbNum = ''
				}
				if (!Number.isInteger(this.form.wbNum)) {
					this.$message('件数请输入整数')
					this.form.wbNum = ''
				}
			},
			wbVolChange (val) {
				this.form.wbVol = val.detail.value
			},
			selfWeightChange (val) {
				this.form.uldSelfWeight = val.detail.value
			},
			zhengwbVolChange (val) {
				this.form.zhengwbVol = val.detail.value
			},
			weightNumFocus () {
				this.form.bangNum = ''
				uni.closeSocket()
			},
			weightNumChange (val) {
				// if (val.target.value === '-1') {
				// 	this.form.bangNum = 0
				// } else {
				// 	this.form.bangNum = Number(val.target.value)
				// }
				let match = this.numArray.find(item => item.ip === this.form.bangNum)
				if (match) {
					this.form.bangNum = match.aisleName
					uni.closeSocket()
					this.exchange = match.ip
					this.connectInit()
					this.uldNumFocus = true
				} else if (this.form.bangNum !== '') {
					this.$message('未能匹配对应的磅秤号')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			border: solid 5upx #dbdbdb;
			border-radius: 5upx;
			height: 94upx;
			width: calc(100% - 30upx);
		}
	}
	.next {
		margin: 10upx 0;
		padding: 0 20upx;
		button {
			width: 100%;
			background-color: #0ebf9c;
			border: 0px solid #0ebf9c
		}
		&.print {
			margin-bottom: 25upx;
			button {
				background-color: #555555;
				border: 0px solid #555555
			}
		}
	}
	.remark {
		.remark_contend {
			display: flex;
			justify-content: flex-start;
			font-size: 32upx;
			.pick-text {
				width: calc(100% - 50upx);
				font-size: 32upx;
				line-height:80upx;
				height: 80upx;
				margin-right: 50upx;
				overflow-x: auto;
				white-space: nowrap;
			}
			uni-icons {
				// display: inline-block;
				float: right;
				position: relative;
				top: -70upx;
			}
			picker {
				height: 80upx;
				width: 120upx;
				border:solid 5upx #dbdbdb;
				border-radius:5upx;
				margin-right: 20upx;
				margin-top: 35upx;
			}
		}
		// height: 170upx;
		font-size: 35upx;
		padding: 20upx;
		margin-bottom: 10upx;
		textarea {
			// width: 100%;
			border: solid 5upx #dbdbdb;
			height: 170upx;
		}
		button {
			margin-top: 30upx;
			width: 100%;
			color: #0ebf9c;
			border:1px solid #0ebf9c
		}
	}
	.zhan {
		height: 20upx;
		background: #F4F5F6;
	}
	.yun {
		padding-top: 20upx;
		.btn-flex {
			padding: 20upx 0;
			display: flex;
			justify-content: space-around	;
			button {
				width: 45%;
				color: #0ebf9c;
				border:1px solid #0ebf9c
			}
		}
		.top {
			display: flex;
			justify-content: space-between;
			padding: 0 20upx 20upx 20upx;
			>text {
				display: inline-block;
				width: 120upx;
				font-size: 35upx;
				display: block;
				position:relative;
				top:20upx;
			}
		}
		.bottom {
			display: flex;
			justify-content: space-between;
			padding: 0 20upx;
			.input-num {
				text-align: center;
				display: inline-block;
				font-size: 35upx;
				border: solid 5upx #dbdbdb;
				border-radius: 5upx;
				height: 94upx;
				width: 180upx;
				&.disable {
					background: #999999;
				}
			}
			.flex {
				display: flex;
				justify-content: center;
				>text {
					display: inline-block;
					width: 120upx;
					font-size: 35upx;
					display: block;
					position:relative;
					top:20upx;
				}
			}
		}
		.text {
			display: inline-block;
			width: 140upx;
			position: relative;
			bottom: 30upx;
			font-size: 35upx;
			text-align: right;
		}
		.input-num {
			text-align: center;
			margin-left: 0upx;
			display: inline-block;
			font-size: 35upx;
			border: solid 5upx #dbdbdb;
			border-radius: 5upx;
			height: 94upx;
			width: calc(20% + 100upx);
			&.disable {
				background: #999999;
			}
		}
	}
.uldStatus {
	padding: 30upx 0;
	.top {
		display: flex;
	}
	.left {
		width: 50%;
	}
	.title {
		display: inline-block;
		width: 180upx;
		text-align: right;
		font-size: 35upx;
		color: #999999;
	}
	.contend {
		font-size: 35upx;
		color: #595959;
		margin-left: 30upx;
	}
	.right {
		width: 50%;
	}
}
.uldNum {
	font-size: 35upx;
	padding-top: 20upx;
	.bottom {
		display: flex;
		justify-content: space-between;
		padding: 0 20upx 20upx 0;
		.check {
			font-size: 35upx;
			display: block;
			position:relative;
			top:20upx;
			text-align: right;
			width: 220upx;
			>text {
				margin-left: 20upx;
			}
		}
		.input-num {
			text-align: center;
			margin-left: 20upx;
			display: inline-block;
			font-size: 35upx;
			border: solid 5upx #dbdbdb;
			border-radius: 5upx;
			height: 94upx;
			width: 220upx;
			&.disable {
				background: #999999;
			}
		}
	}
	.mid {
		display: flex;
		justify-content: space-between;
		padding-right: 20upx;
		margin: 20upx 0;
		.right {
			text-align: center;
			font-size: 35upx;
			display: flex;
			justify-content: center;
			>text {
				font-size: 35upx;
				display: block;
				position:relative;
				top:20upx;
				width: 140upx;
				text-align: right;
			}
			
			.input-num {
				margin-left: 20upx;
				display: inline-block;
				border: solid 5upx #dbdbdb;
				border-radius: 5upx;
				height: 94upx;
				width: 200upx;
				&.disable {
					background: #999999;
				}
			}
		}
	}
	.top {
		display: flex;
		justify-content: space-between;
		padding-right: 20upx;
		>text {
			font-size: 35upx;
			display: block;
			position:relative;
			top:20upx;
			width: 140upx;
			text-align: right;
			// width: 140upx;
			// display: inline-block;
			// position: relative;
			// top: -35upx;
			// font-size: 35upx;
			// text-align: right;
		}
		.input-num {
			text-align: center;
			font-size: 35upx;
			margin-left: 20upx;
			display: inline-block;
			border: solid 5upx #dbdbdb;
			border-radius: 5upx;
			height: 94upx;
			width: 190upx;
			&.disable {
				background: #999999;
			}
		}
	}
}
.san {
	padding: 20upx 0;
	background: #F4F5F6;
	.uldFlight {
		display: inline-block;
		font-size: 34upx;
		position: relative;
		top: 3upx;
		.label {
			margin-left: 20upx;
		}
		.value {
			margin-left: 20upx;
		}
	}
	.san-text {
		width: 100%;
		// text-align: left;
		font-size: 35upx;
		margin-left: 30upx;
		>text {
			margin-right: 20upx;
			position: relative;
			top: 3upx;
		}
	}
}
</style>
