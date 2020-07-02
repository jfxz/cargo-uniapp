<template>
	<view>
		<msg-tip ref="toast"></msg-tip>
		<view class="weightNum">
			<view class="left">
				<text>磅秤号</text>
				<view class="">
					<picker @change="weightNumChange" :value="form.bangNum" :range="numArray">
						<view class="pick-text">{{numArray[form.bangNum]}}</view>
					</picker>
				</view>
			</view>
			<view class="right">
				<text>磅秤重量</text>
				<input disabled class="input-num disable" @input="bangwChange" :value="form.bangWeight" type="number" />
			</view>
		</view>
		<view class="san">
			<view class="san-text">
				<text>散货</text>
				<checkbox-group style="display:initial;" @change="sanChange">
					<checkbox :value="form.sanHuo" :checked="sanDisabed" />
				</checkbox-group>
			</view>
		</view>
		<view class="uldNum">
			<view class="top">
				<text>ULD号</text>
				<input :disabled="sanDisabed" @input="uldTypeChange" :focus="uldblur" @blur="uldInfoblur" :class="['input-num', sanDisabed ? 'disable' : '']" :value="form.uldType" />
				<input :disabled="sanDisabed" @input="uldNoChange" @blur="uldInfoblur" type="number"
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
				<input @focus="focus" @blur="yunblur" style="margin-left: 5rpx;" :focus="yunFocus" @input="wbPrefixChange" class="input-num" :value="form.wbPrefix" />
				<!-- <input @focus="focus" class="input-num" @input="wbNoChange" @blur="wbNoBlur" :value="form.wbNo" style="margin-left: 0;border-left: 0;width: 50%" /> -->
			
				<view class="clearInput">
					<input @focus="focus" class="input-num" @input="wbNoChange" @blur="wbNoBlur" :value="form.wbNo" style="margin-left: 0;border-left: 0;width: 100%"/>
					<icon type="clear" v-if="form.wbNo" @tap="clear"/>
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
				<textarea placeholder="请输入ULD备注" @input="remarkChange" :value="form.remark"/>
				<button type="primary" plain="true" @click="saveRemark">保存备注</button>
			</view>
			<view class="next">
				<button type="primary" @click="next('uld')">下一个ULD</button>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="该ULD已复称,是否继续录入?"></tui-modal>
		<tui-modal :show="modalFlight" @click="handleClickFlight" title="提示" content="运单航班与ULD航班不一致！是否继续过磅"></tui-modal>
	</view>
</template>

<script>
	import {WebSocket} from '@/common/websocket-uni.js'
	import Stomp from "stompjs"
	import msgTip from '@/components/tip/tip.vue'
	import cInput from '@/components/clearInput.vue'
	import { mapGetters } from 'vuex'
	import {model7} from '@/common/util/util.js'
	import tuiModal from "@/components/modal"
	import dayjs from '@/common/util/dayjs.min.js'
	import {getUld, getUldInfo, getWbInfo, getFrameInfo, judgeAllow, postWeight, saveRemark, getBang} from '@/common/api/weight/api.js'
	export default {
		components: {
			tuiModal, msgTip
		},
		data() {
			return {
				client: null,
				guoLoading: false,
				modalFlight: false,
				uldblur: false,
				yunFocus: false,
				modal: false,
				banDisabed: true,
				sanDisabed: false,
				uldFlight: '',
				uldFlightDate: '',
				uldCarrier: '',
				wbCarrier: '',
				wbFlight: '',
				wbFlightDate: '',
				inputNo: 0,
				form: {
					curwgt: 0,
					bangNum: -1,
					bangWeight: 2000,
					sanHuo: '',
					uldSubPrefix: 'CF',
					uldNo: '01464',
					uldType: 'XAY',
					uldSelfWeight: 0,
					zhengwbVol: 0,
					banJia: '',
					banJia1: 'MF3011',
					banJia2: 0,
					uldStatus: '',
					wbPrefix: 'YJ',
					wbid: '',
					uldid : '',
					packmancode: null,
					proxy: '',
					uldWeight: '',
					wbNo: '34352931',
					wbNum: '',
					wbVol: '',
					remark: '',
					origin: '',
					destination: ''
				},
				numArray: []
			}
		},
		computed: {
			...mapGetters(['dic']),
			piWeight () {
				if (this.sanDisabed) {
					console.log(this.sanDisabed)
					return 0
				}
				// car
				if (this.form.uldType === 'CAR') {
					return this.form.uldSelfWeight + this.form.curwgt
				}
				// !car
				if (this.form.uldType !== 'CAR') {
					return this.form.banJia2 + this.form.curwgt
				}
				return 0
			},
			weight () {
				// car
				if (this.form.uldType === 'CAR' && this.form.bangWeight) {
					return this.form.bangWeight - this.piWeight
				}
				// !car
				if (this.form.uldType !== 'CAR' && this.form.bangWeight) {
					return this.form.bangWeight - this.piWeight - this.form.uldSelfWeight
				}
				return 0
			}
		},
		mounted () {
			this.client = Stomp.client('ws://10.1.16.50:15674/ws')
			uni.showModal({
				content: JSON.stringify(Stomp),
				showCancel: false
			});
			 const headers = {
				login: 'root',
				passcode: 'root'
			};
			this.client.connect(headers.login, headers.passcode, this.onConnected, this.onFailed, 'cargoWgt')
			
			// let socketTask = uni.connectSocket({
			// 	// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
			// 	url: "ws://10.1.16.50:15674/ws",
			// 	success(data) {
			// 		console.log("websocket连接成功");
			// 	}
			// })
			// // 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
			// 	socketTask.onOpen((res) => {
			// 		console.log("WebSocket连接正常打开中...！");
			// 		// 注：只有连接正常打开中 ，才能正常成功发送消息
			// 		socketTask.send({
			// 			data: "uni-app发送一条消息",
			// 			async success() {
			// 				console.log("消息发送成功");
			// 			},
			// 		});
			// 		// 注：只有连接正常打开中 ，才能正常收到消息
			// 		socketTask.onMessage((res) => {
			// 			console.log("收到服务器内容：" + res.data);
			// 		});
			// 	})
			// var mqtt = require('mqtt')
			// var client  = mqtt.connect('wx://test.mosquitto.org:8080', {
			// 	connectTimeout: 3000,
			// })
			// console.log(client)
			// client.on('connect', function () {
			// 	console.log('成功连接服务器')
			// 	uni.showModal({
			// 		content: '成功连接服务器',
			// 		showCancel: false
			// 	});
			// 	// 订阅
			//   client.subscribe('Hello', function (err) {
			//     if (!err) {
			// 			// 发布
			//       client.publish('Hello', 'Hello mqtt')
			//     }
			//   })
			// })
			// // 断开发起重连
			// client.on('reconnect', (error) => {
			// 	console.log('正在重连:', error)
			// })
			// // 链接异常处理
			// client.on('error', (error) => {
			// 	console.log('连接失败:', error)
			// })
		 // if (!client.connected) {
			// 	 console.log('客户端未连接')
		 // }
			// client.on('message', function (topic, message) {
			//   // message is Buffer
			//   console.log('mesg', topic, message.toString())
			//   // client.end()
			// })
			
			getBang().then(res => {
				this.numArray = res.data
			})
			// this.$message('航班截关时间已到!')
		},
		created() {
			// this.connect()
		},
		methods: {
			onConnected(frame) {
					console.log("Connected: " + frame);
					uni.showModal({
						content: '成功',
						showCancel: false
					});
					var exchange = "ROOT.WGT";
					this.client.subscribe(exchange, this.responseCallback, this.onFailed);
			},
			onFailed(frame) {
				uni.showModal({
					content: '失败',
					showCancel: false
				});
					console.log("Failed: " + frame);
			},
			responseCallback(frame) {
				uni.showModal({
					content: frame.body,
					showCancel: false
				});
					console.log("得到的消息" + frame.body);
					//接收到服务器推送消息，向服务器定义的接收消息routekey路由rk_recivemsg发送确认消息
					// this.client.send("ROOT.WGT", {"content-type":"text/plain"}, '123123');
			},
			yunblur () {
				this.yunFocus = false
				uni.hideKeyboard()
			},
			jumpWb () {
				this.$emit('jumpWb')
			},
			save () {
				let para = {
					uldId: this.form.uldid,
					flghtDate: this.uldFlightDate,
					carrier: this.uldCarrier,
					flight: this.uldFlight,
					packMan: this.form.packmancode,
					uldWeight: this.form.uldWeight,
					loadVol: this.form.zhengwbVol,
					shapeCode: this.form.banJia1,
					origin:  this.form.origin,
					destination:  this.form.destination,
					remark : this.form.remark
				}
				getUld(para).then(res => {
					// let options = {
					// 	msg: res.message,
					// 	duration: 2000,
					// 	type: 'green'
					// }
					// this.$refs.toast.showTips(options)
				})
			},
			guobang () {
				this.save()
				// this.$loading('提交中')
				this.guoLoading = true
				console.log(this.form)
				let para = {
					carrier: this.wbCarrier,
					flight: this.wbFlight,
					flightDate: this.wbFlightDate ? dayjs(this.wbFlightDate).format('YYYY-MM-DD') : '',
					vol : this.form.wbVol
				}
				if (this.form.wbNum > this.inputNo) {
					this.$message('过磅录入件数大于等于预录入件数')
				}
				console.log(this.uldFlight, this.wbFlight)
				if (this.uldFlight !== this.wbFlight || this.uldFlightDate !== this.wbFlightDate ||
						this.uldCarrier !== this.wbCarrier) {
							this.$message('运单目的站（中转站）与ULD航班信息不一致，请核实')
							this.guoLoading = false
				} else {
					judgeAllow(para).then(res => {
						/* res.data.controlVol = '0'
						res.data.flightControlLock = '0'
						res.data.fourCtrl = '0'
						res.data.isOverCloseTime = '0'
						res.data.isOverCtrlTime = '0'
						res.data.isOverVol = '0' */
						let that = this
						if (res.data.isOverVol === '1') {
							uni.showModal({
								title: '提示',
								content: '航班入库总体积超过标准装货体积一定幅度',
								success: function (res2) {
									if (res2.confirm) {
										if (res.data.controlVol === '1') {
											that.$message('状态为控舱，无法录入')
											that.guoLoading = false
										} else {
											if (res.data.flightControlLock === '1') {
												that.$message('航班解锁，无法录入')
												that.guoLoading = false
											} else {
												if (res.data.isOverCloseTime === '1') {
													that.$message('交单截关时间-预警时间限制')
													that.guoLoading = false
												} else {
													if (res.data.fourCtrl === '1') {
														that.$message('已开启提前四小时控舱，不允许过磅录入')
														that.guoLoading = false
													} else {
														if (res.data.isOverCtrlTime === '1') {
															that.$message('超过4小时控舱时间')
															that.guoLoading = false
														} else {
															let para = {
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
																chanel: that.numArray[that.form.bangNum] || '',
																uldRemark: that.form.remark
															}
															postWeight(para).then(res => {
																that.guoLoading = false
															}).catch(() => {
																that.guoLoading = false
															})
														}
													}
												}
											}
										}
									}
								}
							})
						} else {
							if (res.data.isOverCloseTime === '1') {
								that.$message('交单截关时间-预警时间限制')
								that.guoLoading = false
							} else {
								if (res.data.fourCtrl === '1') {
									that.$message('已开启提前四小时控舱，不允许过磅录入')
									that.guoLoading = false
								} else {
									if (res.data.isOverCtrlTime === '1') {
										that.$message('超过4小时控舱时间')
										that.guoLoading = false
									} else {
										let para = {
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
											chanel: that.numArray[that.form.bangNum] || '',
											uldRemark: that.form.remark
										}
										postWeight(para).then(res => {
											that.guoLoading = false
											if(res.status) {
												let options = {
													msg: res.message,
													duration: 2000,
													type: 'green'
												}
												this.$refs.toast.showTips(options)
											} else {
												this.$message(res.message)
											}
										}).catch(() => {
											that.guoLoading = false
										})
									}
								}
							}
						}
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
				this.form.wbVol = 0
				this.form.wbNum = 0
			},
			formatUldStatus (status) {
				let match = this.dic.uldType_dic.find(item =>  item.TYPECODE === status)
				if (match) {
					return match.TYPENAME
				}
				return ''
			},
			part (val) {
				this.form.wbPrefix = val.detail.value.substring(0, 3)
				this.form.wbNo = val.detail.value.substring(3, val.detail.value.length)
			},
			wbPrefixChange (val) {
				if (val.detail.value.length == 11) {
					this.part(val)
				} else {
					this.form.wbPrefix = val.detail.value
				}
			},
			wbNoChange (val) {
				if (val.detail.value.length == 11) {
					this.part(val)
				} else {
					this.form.wbNo = val.detail.value
				}
			},
			uldInfoblur () {
				this.getUldMsg()
			},
			uldSubPrefixChange (val) {
				this.form.uldSubPrefix = val.detail.value
			},
			uldNoChange (val) {
				this.form.uldNo = val.detail.value
			},
			uldTypeChange (val) {
				this.form.uldType = val.detail.value
			},
			resUld () {
				this.form.uldSubPrefix = ''
				this.form.uldNo = ''
				this.form.uldType = ''
				this.form.uldSelfWeight = ''
				this.form.zhengwbVol = 0
				this.form.uldStatus = ''
				this.form.uldid  = ''
				this.form.curwgt = 0
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
							this.$message('ULD不存在')
							this.resUld()
						} else if (res.data.uldinfo && res.data.uldinfo.REWEIGH_STATUS) {
							this.modal = true
							this.form.uldSelfWeight = res.data.uldinfo.ULD_WGT
							this.form.curwgt = res.data.uldinfo.CURWGT // 已过磅的重量
							this.form.zhengwbVol = res.data.uldinfo.ULD_VOL
							this.form.uldStatus = res.data.uldinfo.ULD_STATUS
							this.form.uldid = res.data.uldinfo.ULDID
							this.uldFlight = res.data.uldinfo.FLIGHT
							this.uldFlightDate = res.data.uldinfo.FLIGHT_DATE
							this.uldCarrier = res.data.uldinfo.CARRIER
							this.form.remark = res.data.uldinfo.ULD_REMARK
							this.form.packmancode = res.data.uldinfo.PACK_MAN
							this.form.uldWeight = res.data.uldinfo.ULD_WEIGHT
							this.form.origin = res.data.uldinfo.ULD_ORIGIN
							this.form.destination = res.data.uldinfo.ULD_DESTINATION
							getApp().globalData.uldForm = Object.assign({}, this.form, {uldFlight: this.uldFlight, carrier: this.uldCarrier, uldFlightDate: this.uldFlightDate})
							if (this.form.uldStatus !== '2') {
								this.$message('ULD非装货(或正常)状态!')
							}
							let flag =  dayjs(res.data.uldinfo.LOAD_OFF_TIME).isBefore(dayjs().valueOf())
							if (!flag) {
								this.$message('航班截关时间已到')
							}
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			hide () {
				// this.modal = false
			},
			handleClickFlight (e) {
				let index = e.index
				if (index === 0) {
					this.form.wbPrefix = ''
					this.form.wbNo = ''
				}
				this.modalFlight = false
			},
			handleClick (e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
					this.resUld()
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
						this.form[item] = ''
					})
					getApp().globalData.uldForm = {}
				} else {
					Object.keys(this.form).forEach(item => {
						if (flag === 'uld' || (item !== 'uldSubPrefix' && item !== 'uldNo' && item !== 'uldType'
						&& item !== 'uldSelfWeight' && item !== 'uldStatus')) {
							this.form[item] = ''
						}
					})
				}
				this.form.zhengwbVol = 0
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
					if (!model7(this.form.wbNo) || this.form.wbNo.length !== 8) {
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
							} else if (res.data) {
								if (res.data.isSubmit === '1') {
									this.$message('运单已交单，无法过磅')
								} else {
									this.form.wbNum = res.data.wbNum
									this.form.wbVol = res.data.wbVol
									this.form.wbid  = res.data.id
									this.form.proxy = res.data.proxy
									this.wbCarrier = res.data.carrier
									this.wbFlight = res.data.flight
									this.inputNo = res.data.inputNo
									this.wbFlightDate = res.data.flightDate
									getApp().globalData.wbForm = Object.assign({}, res.data, this.form, {wbCarrier: this.wbCarrier, wbFlight: this.wbFlight, wbFlightDate: this.wbFlightDate})
									console.log('uldFlight', this.uldFlight)
									if (this.uldFlight !== '') {
										if (res.data.flight !== this.uldFlight || res.data.carrier !== this.uldCarrier || res.data.flightDate !== this.uldFlightDate) {
											this.modalFlight = true
										}
									} else {
										this.uldFlight = res.data.flight
										this.uldCarrier = res.data.carrier
										this.uldFlightDate = res.data.flightDate
									}
								}
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
				}
			},
			focus () {
				// uni.hideKeyboard()
			},
			remarkChange (val) {
				this.form.remark = val.detail.value
			},
			wbNumChange (val) {
				this.form.wbNum = val.detail.value
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
			weightNumChange (val) {
				if (val.target.value === '-1') {
					this.form.bangNum = 0
				} else {
					this.form.bangNum = Number(val.target.value)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.clearInput {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		// padding-right: 20upx;
		icon {
			z-index: 2;
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
			// height: 100%;
			// line-height: 100%;
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
	}
	.remark {
		// height: 170upx;
		font-size: 35upx;
		padding: 20upx;
		margin-bottom: 10upx;
		textarea {
			width: 100%;
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
	.san-text {
		width: 50%;
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
