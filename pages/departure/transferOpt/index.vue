<template>
	<view class="transferOpt">
		<msg-tip ref="toast"></msg-tip>
		<headBar name="中转货操作"></headBar>
		<view class="top">
			<view class="flex">
				<view class="left">
					运单号
				</view>
				<view class="right">
					<input type="text" @input="wbPrefixChange" :value="form.wbPrefix" placeholder="请输入前缀" />
					<view class="clearInput">
						<input :focus="wbNoFocus" @input="wbNoChange" v-model="form.wbNo" placeholder="请输入运单号"/>
						<view class="uni-icon uni-icon-clear" v-if="form.wbNo" @click="clear"></view>
					</view>
					<!-- <cInput type="text" @clear="clear" :focus2="wbNoFocus" @input="wbNoChange" :value="form.wbNo" placeholder="请输入运单号" /> -->
				</view>
			</view>
			<view class="btn">
				<button type="primary" @click="getData">查询</button>
			</view>
		</view>
		<view class="mid">
			<view class="flex-mid">
				<view class="left">
					<text>装载件数</text>
					<input class="input-item" type="number" @input="numChange" :value="form.num" />
				</view>
				<view class="right">
					<text>批次</text>
					<picker @change="piciChange" :value="form.piciIndex" :range="piArray">
						<view class="pick-text">{{piArray[form.piciIndex]}}</view>
					</picker>
				</view>
			</view>
			<view class="flex-mid">
				<view class="right">
					<text>磅秤号</text>
					<input class="input-item" @focus="weightNumFocus" @blur="bangChange" v-model="form.bangcIndex" />
					<!-- <picker @change="bangChange" :value="form.bangcIndex" range-key="aisleName" :range="numArray">
						<view class="pick-text">{{numArray[form.bangcIndex].aisleName}}</view>
					</picker> -->
				</view>
				<view class="left">
					<text>磅秤重量</text>
					<input class="input-item" @input="bangwChange" :value="form.bangWeight" type="number" />
				</view>
			</view>

			<view class="uld">
				<text>ULD号</text>
				<input type="text" @input="uldTypeChange" @focus="typeFocus()" @blur="uldInfoblur" class="input-item" :value="form.uldType" />
				<input type="text" @input="uldNoChange" @focus="noFocus()" @blur="uldInfoblur" class="input-item num2" :value="form.uldNo" />
				<input type="text" @input="uldSubPrefixChange" class="input-item num2" @blur="uldInfoblur" :value="form.uldSubPrefix" />
			</view>

			<view class="flex-mid">
				<view class="left">
					<text>调整重量</text>
					<input type="number" @input="weightChange" class="input-item" :value="form.weight" />
				</view>
				<view class="right">
					<text>皮重</text>
					<input disabled type="text" class="input-item disable" :value="piWeight" />
				</view>
			</view>
			<view class="check">
				<checkbox-group style="display:initial;" @change="banChange">
					<checkbox :value="form.banJia" :checked="false" />
				</checkbox-group>
				<text>板架号码</text>
				<input type="text" @blur="banBlur" :disabled="banDisabed" @input="banJia1Change" :class="['input-num', banDisabed ? 'disable' : '']"
				 :value="form.banjia1" />
			</view>
			<button type="primary" plain="true" @click="reWeightEnter">复称录入</button>
		</view>

		<view class="bottom">
			<view class="top2">
				<view class="item left">
					<view class="label">复称重量</view>
					<view class="value" :style="{color: fcWeight === 0 ? 'red': ''}">{{fcWeight}}</view>
				</view>
				<view class="item mid">
					<view class="label">舱单重量</view>
					<view class="value">{{cangWeight}}</view>
				</view>
				<view class="item right">
					<view class="label">差异额</view>
					<view class="value" :style="{color: Math.abs(chayie) < 30 ? '' : 'red'}">{{chayie}}</view>
				</view>
			</view>
			<view class="bot">
				<view class="item left">
					<view class="label">差异率</view>
					<view class="value" :style="{color: Math.abs(chayilv) <= 0.02 ? '' : 'red'}">{{chayilv && chayilv * 100 + '%'}}</view>
				</view>
				<view class="item mid">
					<view class="label">舱单件数</view>
					<view class="value">{{form.cangNum}}</view>
				</view>
				<view class="item">
				</view>
			</view>
		</view>
		<view class="btn-flex">
			<button type="primary" plain="true" @click="next" :disabled="buttomFlag">推送异常</button>
			<button type="warn" @click="dele" :disabled="!form.wbId">取消交接</button>
		</view>
		<view class="btn-btm-flex">
			<button type="primary" @tap="yuanClick" :disabled="buttomFlag">原单交接</button>
			<button type="primary" @tap="huanClick" :disabled="buttomFlag">换单交接</button>
		</view>
		<tui-modal :show="modal" @click="handleClickHand()" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
		<!-- 换单交接 -->
		<tui-modal :show="handModal" @cancel="hide" :custom="true" :fadein="true">
			<view class="tui-modal-custom">
				<view class="flex">
					<view class="left">
						原单号
					</view>
					<view class="right">
						<input type="text" v-model="originBill" disabled class="disable" />
					</view>
				</view>
				<view class="flex">
					<view class="left">
						运单号
					</view>
					<view class="right">
						<input type="text" @input="wbPrefixChangeDialog" style="width:50%;" :value="wbPrefix" />
						<view class="clearInput">
							<input :focus="focusDialog" @input="wbNoChangeDialog" v-model="wbNo"/>
							<view class="uni-icon uni-icon-clear" v-if="wbNo" @click="clearDialog"></view>
						</view>
						<!-- <cInput type="text" :focus2="focusDialog" @clear="clearDialog" @input="wbNoChangeDialog" :value="wbNo" /> -->
					</view>
				</view>
				<view class="modal-btn">
					<button type="primary" @click="handleClick()">确定</button>
				</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import {
		WebSocket
	} from '@/common/util/websocket-uni.js'
	import tuiModal from "@/components/modal"
	import Stomp from "stompjs"
	import msgTip from '@/components/tip/tip.vue'
	import cInput from '@/components/clearInput.vue'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import {
		model7,
		deepCopy
	} from '@/common/util/util.js'
	import {
		getUld,
		getUldInfo,
		getWbInfo,
		getFrameInfo,
		getBang
	} from '@/common/api/weight/api.js'
	import {
		getWayBill,
		yuanCommit,
		huanCommit,
		deleteAjax
	} from '@/common/api/transfer/api.js'
	export default {
		components: {
			headBar,
			msgTip,
			tuiModal,
			cInput
		},
		data() {
			return {
				// 复称交接
				modal: false,
				dialogMsg: '',
				// 换单交接相关
				focusDialog: false,
				originBill: '',
				wbPrefix: '',
				wbNo: '',
				handModal: false,
				wbNoFocus: false,
				// 其他信息
				client: null,
				exchange: null,
				numArray: [],
				banDisabed: false,
				piciIndex: -1,
				piArray: [],
				cangWeight: '', // 舱单重量
				form: {
					isChange: '',
					wbId: '',
					cangNum: '',
					uldSelfWeight: 0,
					curwgt: 0,
					// wbPrefix: '324',
					// wbNo: '15802474',
					isHandover: '',
					isReceive: '',
					wbPrefix: '',
					wbNo: '',
					num: '',
					piciIndex: '',
					bangcIndex: '',
					bangWeight: 0,
					uldSubPrefix: 'GN',
					uldNo: '',
					uldType: 'CAR',
					weight: 0,
					piz: '',
					banjia: '',
					banjia1: '',
					banJia2: 0,
					originBill: '', // 原单号
					wbType: '', // 运单类型
					transitId: ''
				}
			}
		},
		computed: {
			chayilv() { // 计算差异率， 差异额（ 复称重量 - 舱单重量）/ 舱单重量
				if (this.cangWeight && Number(this.cangWeight) !== 0) {
					return (Number(this.chayie) / Number(this.cangWeight)).toFixed(2)
				}
				return ''
			},
			buttomFlag() {
				if (!this.form.wbId || (this.form.isHandover === '1' && this.form.isReceive === '0')) {
					return true
				}
				return false
			},
			chayie() { // 计算差异额，复称重量-舱单重量
				if (this.cangWeight) {
					return (Number(this.fcWeight) - Number(this.cangWeight)).toFixed(1)
				}
				return ''
			},
			fcWeight() {
				return (Number(this.form.bangWeight) + Number(this.form.weight) - Number(this.piWeight)).toFixed(1)
			},
			piWeight() {
				// car
				if (this.form.uldType === 'CAR') {
					return (Number(this.form.uldSelfWeight) + Number(this.form.curwgt)).toFixed(1)
				}
				// !car
				if (this.form.uldType !== 'CAR') {
					return (Number(this.form.banJia2) + Number(this.form.curwgt)).toFixed(1)
				}
				return ''
			}
		},
		beforeDestroy() {
			this.exchange = null
			uni.closeSocket()
		},
		mounted() {
			getBang().then(res => {
				this.numArray = res.data
			})
		},
		methods: {
			// ******************复称录入相关方法********************
			reWeightEnter() { // 复称录入判断
				if (this.form.bangcIndex) {
					if (parseFloat(this.fcWeight) > 0) {
						if (Math.abs(parseFloat(this.chayie)) < 30) { // 差异额小于30
							if (Math.abs(parseFloat(this.chayilv)) < 2) { // 差异率小于2%
								this.reWeightHandle()
							} else {
								this.dialogMsg = '差异率' + this.chayilv + '%' + '超出范围,是否继续复称录入'
								this.modal = true
							}
						} else {
							this.show('录入失败,差异额(' + this.wgtDiff + ')超出!' + '不可录入', 'warning')
						}
					} else {
						this.show('录入失败,请确认复称重量是否正确', 'warning')
					}
				} else {
					this.show('录入失败,请确认是否已经选择磅秤', 'warning')
				}
			},
			reWeightHandle() { // 复称录入操作
				let row = {
					uldType: this.form.uldType,
					uldNo: this.form.uldNo,
					uldNoSuffix: this.form.uldNoSuffix,
					id: this.uldLoadInfo.id, // id
					waitLocation: this.uldLoadInfo.waitLocation, // 区位
					wgtAdjust: this.uldLoadInfo.wgtAdjust ? this.uldLoadInfo.wgtAdjust : 0, // 调整重量
					tareReweigh: this.tareReweigh, // 皮重
					// 复称信息
					wgtDiff: this.wgtDiff, // 差异额
					wgtDiffRate: Math.round(parseFloat(this.wgtDiff) / parseFloat(this.uldInfo.wgtManifest) * 10000) / 10000, // 差异率
					wgtReweigh: this.wgtReweigh, // 复称重量
					scaleNo: this.scale.scaleNum // 磅秤号
				}
				reWgtPutin(row).then(res => {
					if (res.message) {
						uni.pageScrollTo({ // 滚动置底部
							scrollTop: 10000,
							duration: 300
						})
						this.show(res.message, res.status === 1 ?
							'green' : 'warning')
					}
				})
			},
			handleClickHand() {
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					this.reWeightHandle()
					this.modal = false
				}
			},
			dele() { // 取消交接
				if (this.form.wbId) {
					let para = {
						id: this.form.wbId,
						isChange: this.form.isChange
					}
					this.$loading('取消交接中')
					deleteAjax(para).then(res => {
						this.show(res.message, res.status === 1 ?
							'green' : 'warning')
						uni.hideLoading()
					})
				} else {
					this.$message('请确认是否已经提取信息')
				}
			},
			// ******************换单交接相关************************
			clearDialog() {
				this.wbNo = ''
				this.wbPrefix = ''
			},
			huanClick() {
				if (this.form.wbId) {
					this.originBill = this.form.wbPrefix + '-' + this.form.wbNo
					this.wbNo = ''
					this.wbPrefix = ''
					this.handModal = true
				} else {
					this.$message('请确认是否已经提取信息')
				}
			},
			handleClick() { // 确认换单交接
				// let index = e.index
				// if (index === 0) {
				// 	this.handModal = false
				// } else {
					if (this.wbPrefix && this.wbNo && this.originBill && this.form.wbId) {
						if (!model7(this.wbPrefix, this.wbNo)) {
							this.$message('请确认运单号是否正确')
						} else {
							let para = {
								wbPrefix: this.wbPrefix,
								wbNo: this.wbNo,
								originBill: this.originBill,
								id: this.form.wbId
							}
							huanCommit(para).then(res => { // 换单交接口
								this.show(res.message, res.status === 1 ?
									'green' : 'warning')
							})
							this.handModal = false
						}
					} else {
						this.$message('请确认运单是否输入完整')
					}
				// }
			},
			hide() { // 取消
				this.modal = false
				this.handModal = false
			},
			// ******************弹窗运单信息输入**************************
			partDialog(val) {
				this.wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.wbNo = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
			},
			wbPrefixChangeDialog(val) {
				if (val.detail.value.length === 11 || val.detail.value.length === 10) {
					this.partDialog(val)
				} else {
					this.focusDialog = false
					this.wbPrefix = val.detail.value.toLocaleUpperCase()
					if (this.wbPrefix.length === 3 || this.wbPrefix === 'YJ') {
						this.focusDialog = true
					}
				}
			},
			wbNoChangeDialog(val) {
				if (val.detail.value.length === 11 || val.detail.value.length === 10) {
					this.partDialog(val)
				} else if (val.detail.value.length > 8) {
					// this.form.wbNo = ''
					setTimeout(() => {
						this.wbNo = val.detail.value.substr(0, 8)
					}, 100)
					this.$message('运单号超出8位限制!')
				}	else {
					this.wbNo = val.detail.value
				}
			},
			show(val, type) {
				let options = {
					msg: val,
					duration: 2000,
					type: type === 'warning' ? 'warning' : 'green'
				}
				this.$refs.toast.showTips(options)
			},
			// 连接
			connectInit() {
				this.client = Stomp.client('ws://10.1.16.50:15674/ws')
				const headers = {
					login: 'root',
					passcode: 'root'
				};
				this.client.connect(headers.login, headers.passcode, this.onConnected, this.onFailed, 'cargoWgt')
			},
			onConnected(frame) {
				console.log(this.exchange)
				// this.exchange = "ROOT.WGT";
				this.client.subscribe(this.exchange, this.responseCallback, this.onFailed);
			},
			onFailed(frame) {
				this.$message('连接mq失败！请检查网络设置')
			},
			responseCallback(frame) {
				uni.showModal({
					content: frame.body,
					showCancel: false
				});
				this.form.bangWeight = Number(frame.body)
				console.log("得到的消息" + frame.body);
				//接收到服务器推送消息，向服务器定义的接收消息routekey路由rk_recivemsg发送确认消息
				// this.client.send("ROOT.WGT", {"content-type":"text/plain"}, '123123');
			},

			yuanClick() {
				this.$loading('原单交接中')
				yuanCommit({
					id: this.form.wbId
				}).then(res => {
					if (res.status) {
						let options = {
							msg: res.message,
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				})
			},
			banBlur() {
				if (this.form.banJia1) {
					getFrameInfo({
						frameNo: this.form.banJia1
					}).then(res => {
						if (res.status) {
							this.form.banJia2 = res.data
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			clear() {
				this.form.wbNo = ''
				this.form.isHandover = ''
				this.form.isReceive = ''
				this.form.wbPrefix = ''
				this.form.wbId = ''
				this.piArray = []
				this.form.piz = ''
			},
			weightChange(val) {
				this.form.weight = val.detail.value
			},
			banJia1Change(val) {
				this.form.banJia1 = val.detail.value
			},
			bangwChange(val) {
				this.form.bangWeight = val.detail.value
			},
			next() {
				this.$message('暂无此功能')
			},
			// ***************uld信息输入*********************
			typeFocus() {
				this.form.uldType = ''
			},
			noFocus() {
				this.form.uldNo = ''
			},
			uldSubPrefixChange(val) {
				this.form.uldSubPrefix = val.detail.value.toLocaleUpperCase()
			},
			uldNoChange(val) {
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
			},
			uldTypeChange(val) {
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
			},
			uldInfoblur() {
				if (!this.form.uldType) {
					this.form.uldType = 'CAR'
				}
				this.getUldMsg()
			},
			getUldMsg() {
				console.log(this.form.uldSubPrefix, this.form.uldNo, this.form.uldType)
				if (this.form.uldSubPrefix && this.form.uldNo && this.form.uldType) {
					let uldForm = {
						uldSubPrefix: this.form.uldSubPrefix,
						uldNo: this.form.uldNo,
						uldType: this.form.uldType
					}
					getUldInfo(uldForm).then(res => {
						if (!res.data || !res.data.uldinfo) {
							this.$message('ULD不存在')
							this.form.uldSelfWeight = 0
							this.form.zhengwbVol = 0
							this.form.uldStatus = ''
						} else if (res.data.uldinfo) {
							/* if (res.data.uldinfo.REWEIGH_STATUS === '1') {
								this.modal = true
							} */
							this.form.uldSelfWeight = res.data.uldinfo.ULD_WGT
							this.form.curwgt = res.data.uldinfo.CURWGT // 已过磅的重量
							this.form.zhengwbVol = res.data.uldinfo.ULD_VOL
							this.form.uldStatus = res.data.uldinfo.ULD_STATUS
							this.form.uldid = res.data.uldinfo.ULDID
							this.form.packmancode = res.data.uldinfo.PACK_MAN
							this.form.uldWeight = res.data.uldinfo.ULD_WEIGHT
							this.form.origin = res.data.uldinfo.ULD_ORIGIN
							this.form.destination = res.data.uldinfo.ULD_DESTINATION
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			// ******************运单信息输入**************************
			part(val) {
				this.form.wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.form.wbNo = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
			},
			wbPrefixChange(val) {
				if (val.detail.value.length === 11 || val.detail.value.length === 10) {
					this.part(val)
				} else {
					this.wbNoFocus = false
					this.form.wbPrefix = val.detail.value.toLocaleUpperCase()
					console.log('输入', this.wbNoFocus)
					if (this.form.wbPrefix.length === 3 || this.form.wbPrefix === 'YJ') {
						console.log('跳转', this.form.wbPrefix)
						this.wbNoFocus = true
					}
				}
			},
			wbNoChange(val) {
				if (val.detail.value.length === 11 || val.detail.value.length === 10) {
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

			// *********************其他信息输入*********************
			numChange(val) {
				this.form.num = val.detail.value
			},
			weightNumFocus () {
				this.form.bangNum = ''
				uni.closeSocket()
			},
			bangChange(val) {
				let match = this.numArray.find(item => item.ip === this.form.bangcIndex)
				if (match) {
					this.form.bangcIndex = match.aisleName
					uni.closeSocket()
					this.exchange = match.ip
					this.connectInit()
				} else if (this.form.bangcIndex !== '') {
					this.$message('未能匹配对应的磅秤号')
				}
			},
			piciChange(val) {
				this.form.piciIndex = Number(val.detail.value)
			},
			banChange(val) {
				if (val.detail.value.length >= 1) {
					this.banDisabed = false
				} else {
					this.banDisabed = true
					this.form.banJia1 = ''
				}
			},
			getData() {
				if (!this.form.wbNo || !this.form.wbPrefix) {
					this.$message('运单信息不能为空')
					return
				}
				if (this.form.wbNo && !model7(this.form.wbPrefix, this.form.wbNo)) {
					this.$message('运单不符合规则')
					this.form.wbPrefix = ''
					this.form.wbNo = ''
				} else {
					let wbForm = {
						wbPrefix: this.form.wbPrefix,
						wbNo: this.form.wbNo
					}
					this.$loading('加载中')
					getWayBill(wbForm).then(res => {
						if (res.status) {
							this.form.originBill = res.data[0].originWb
							this.form.transitId = res.data[0].transitId
							this.form.wbType = res.data[0].newWbType
							this.cangWeight = res.data[0].wgt
							this.form.cangNum = res.data[0].num
							this.form.wbId = res.data[0].id
							this.form.isHandover = res.data[0].isHandover // 进港标志位
							// res.data[0].isHandover === '1' && this.$message('运单已中转')
							this.form.isReceive = res.data[0].isReceive // 离港标志位
							this.form.isChange = res.data[0].isChange
							this.piArray = res.data.map(item => item.batchNo)
							this.form.piciIndex = 0
						} else {
							this.$message(res.message)
						}
						uni.hideLoading()
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}

	.transferOpt {
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
		.disable {
			background: #999999;
		}

		.tui-modal-custom {
			text-align: center;
			display: flex;
			flex-direction: column;

			.flex {
				margin-bottom: 20upx;

				.left {
					font-size: 35upx;
					width: 25%;
					line-height: 94upx;
				}

				.right {
					display: flex;
					justify-content: flex-start;
					border: 3upx solid #dbdbdb;
					border-left: 0;
					width: 75%;

					input {
						font-size: 35upx;
						text-align: center;
						border-left: 3upx solid #dbdbdb;
						height: 94upx;
					}
				}
			}
		}

		.last {
			margin: 0 40upx 40upx 40upx;

			>button {
				background-color: #0ebf9c;
				border: 3upx solid #0ebf9c;
			}
		}

		.btn-btm-flex {
			display: flex;
			justify-content: space-between;
			margin: 40upx;

			>button {
				width: 50%;
			}

			button:first-child {
				margin-right: 40upx;
			}
		}

		.btn-flex {
			display: flex;
			justify-content: space-between;
			margin: 40upx;

			>button {
				// color: #595959;
				// border:2px solid #dbdbdb;
				width: 50%;
			}

			button:first-child {
				color: #fdb332;
				border: 2px solid #fdb332;
				margin-right: 40upx;
			}
		}

		.bottom {
			background: #FFFFFF;
			margin: 30upx 0;
			padding: 20upx 40upx;

			.item {
				width: 33%;

				&.left {
					text-align: left;
				}

				&.mid {
					text-align: center;
					padding: 0;
				}

				&.right {
					text-align: right;
				}
			}

			.label {
				font-size: 35upx;
				color: #999999;
			}

			.value {
				font-size: 35upx;
				color: #595959;
			}

			.top2 {
				display: flex;
				justify-content: space-between;
			}

			.bot {
				display: flex;
				justify-content: space-between;
			}
		}

		.mid {
			button {
				color: #0ebf9c;
				border: 2px solid #0ebf9c;
				margin-top: 20upx;
			}

			background: #FFFFFF;
			padding: 30upx 40upx;

			.check {
				font-size: 35upx;
				display: block;
				position: relative;
				// top:20upx;
				text-align: left;
				display: flex;
				justify-content: center;
				margin-bottom: 20upx;

				// width: 220upx;
				>checkbox-group {
					position: relative;
					top: 15upx;
					width: 50upx;
				}

				>text {
					// margin-left: 20upx;
				}

				>input {
					text-align: center;
					margin-left: 20upx;
					display: inline-block;
					font-size: 35upx;
					border: solid 5upx #dbdbdb;
					border-radius: 5upx;
					height: 94upx;
					width: 458upx;

					&.disable {
						background: #999999;
					}
				}
			}

			text {
				font-size: 35upx;
				color: #595959;
				position: relative;
				top: 15upx;
				width: 140upx;
				display: block;
				text-align: right;
			}

			.uld {
				display: flex;
				justify-content: center;
				margin-bottom: 20upx;

				.input-item {
					margin-left: 20upx;
					text-align: center;
					display: inline-block;
					font-size: 35upx;
					border: solid 5upx #dbdbdb;
					border-radius: 5upx;
					height: 94upx;
					width: 170upx;

					&.num2 {
						border-left: 0;
						margin-left: 0upx;
					}
				}
			}

			.flex-mid {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20upx;

				.input-item {
					margin-left: 20upx;
					text-align: center;
					display: inline-block;
					font-size: 35upx;
					border: solid 5upx #dbdbdb;
					border-radius: 5upx;
					height: 94upx;
					width: 170upx;

					&.disable {
						background: #999999;
					}
				}

				.left {
					width: 50%;
					display: flex;
					justify-content: center;
				}

				.right {
					width: 50%;
					display: flex;
					justify-content: center;

					.pick-text {
						font-size: 36upx;
						font-weight: bold;
						border: solid 5upx #dbdbdb;
						border-radius: 5upx;
						height: 94upx;
						width: 170upx;
						white-space: nowrap;
						overflow-x: auto;
						text-align: center;
						padding-top: 13upx;
					}

					>picker {
						display: inline-block;
						margin-left: 20upx;
					}
				}
			}
		}

		.top {
			color: #595959;
			margin: 30upx 0;
			background: #FFFFFF;
			width: 100%;
			padding: 30upx 60upx;

			.btn {
				>button {
					border: 3upx solid #0ebf9c;
					background: #0ebf9c;
				}
			}

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
				}
			}
		}
	}
</style>
