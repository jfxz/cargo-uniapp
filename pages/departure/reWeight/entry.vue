<template>
	<view class="reweightClass">
		<msg-tip ref="toast"></msg-tip>
		<view class="reweightContent head">
			<view class="head-input">
				<text class="lableWidth">磅秤号</text>
				<!-- 	<picker @change="changeValue" :value="scale.bangNum" range-key="aisleName" :range="numArray">
					<view class="reweightInput short bold">{{findByValue('numArray',scale.bangNum)}}</view>
				</picker> -->
				<input class="reweightInput short bold" @focus="weightNumFocus" :focus="weightNumFocusFlag" @blur="weightNumChange" v-model="scale.bangNum" />
				<text class="lableWidth 190">磅秤重量</text>
				<input :class="['reweightInput','bold', '267','disable']" @input="bangwChange" v-model="scale.weight" type="number" />
			</view>
		</view>
		<view class="reweightContent head middle">
			<view class="head-input">
				<text class="lableWidth" >ULD号</text>
				<input class="reweightInput" @focus="uldTypeFocus" @input="uldTypeChange" :value="form.uldType" @blur="uldJudge" />
				<input class="reweightInput reduceLeft" :focus="uldNumFocus" @focus="uldNoFocus" @input="uldNoChange" :value="form.uldNo"
				 @blur="uldJudge" />
				<input class="reweightInput reduceLeft" :value="form.uldNoSuffix" @input="uldSubPrefixChange" @confirm="getUldInfo()"
				 @blur="uldJudge" />
				<!-- <text class="cuIcon-roundclosefill"></text> -->
			</view>
			<view class="middle-data">
				<text class="lableWidth">区位</text>
				<picker @change="locationChange" :value="uldLoadInfo.waitLocation" style="font-size: 135upx;" range-key="TYPECODE"
				 :range="locationArray">
					<!-- <view class="reweightInput 267" style="margin-left: 0;">{{locationArray[uldLoadInfo.waitLocation].TYPENAME}}</view> -->
					<view class="reweightInput 267" style="margin-left: 0;">{{findByValue('locationArray',uldLoadInfo.waitLocation)}}</view>
				</picker>
				<view class="saveBottom">
					<button class="weightBottom" plain="true" @click="saveLocation()">保存区位</button>
				</view>
			</view>
			<view class="middle-data">
				<text class="lableWidth">皮重</text>
				<input class="reweightInput short disable" v-model="tareReweigh" disabled />
				<text class="lableWidth 190">调整重量</text>
				<input class="reweightInput short" v-model="uldLoadInfo.wgtAdjust" />
			</view>
			<view class="middle-data bottom">
				<view class="check">
					<checkbox-group style="display:initial;" @change="banChange">
						<checkbox :value="uldLoadInfo.banjia" :checked="false" />
					</checkbox-group>
				</view>
				<text class="lableWidth">板架号码</text>
				<input @confirm="getFrame()" @blur="checkFrame()" :class="['reweightInput','long', palletDisabled ? 'disable' : '']"
				 v-model="banInfo.frameNo" :disabled="palletDisabled" />
				<input :class="['reweightInput','short', 'disable']" style="margin-left: 30upx;" v-model="banInfo.frameWgt"
				 disabled />
			</view>
			<view class="middle-btn">
				<button class="weightBottom" @click="reWeightEnter()" plain="true">复称录入</button>
			</view>
		</view>
		<!-- 倒计时 -->
		<view class="tab-class">
			<text class="lableWidth long gray thin" style="margin-right: 30upx;">复称截关倒计时</text>
			<uni-countdown color="#FFFFFF" background-color="#424242" :show-colon="false" @timeup="timeUp" :reset="reset" :day="day"
			 border-color="#424242" :show-day="true" :hour="hour" :minute="minute" :second="second">
			</uni-countdown>
		</view>
		<view class="reweightContent bottom">
			<view class="content">
				<text class="lableWidth long gray thin">预配航班日期</text>
				<text class="lableWidth 190 gray right thin">预配航班</text>
			</view>
			<view class="content">
				<text class="lableWidth long thin">{{uldInfo.flightDate? dayjs(uldInfo.flightDate).format('YYYY-MM-DD') : '-'}}</text>
				<text class="lableWidth right thin">{{uldInfo.carrier ? uldInfo.carrier+uldInfo.flight : '-'}}</text>
			</view>
			<view class="content">
				<text class="lableWidth gray thin">目的站</text>
				<text class="lableWidth 190 gray right thin">体积</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{uldInfo.destination ? uldInfo.destination : '-'}}</text>
				<text class="lableWidth right thin">{{uldInfo.maxVol ? uldInfo.maxVol : '-'}}</text>
			</view>
		</view>
		<view class="reweightContent bottom">
			<view class="content">
				<text class="lableWidth right gray">复称重量</text>
				<text class="lableWidth" :style="[{color: wgtReweigh ? '#595959' : 'red'}]">{{wgtReweigh}}</text>
				<text class="lableWidth 190 right gray">舱单毛重</text>
				<text class="lableWidth">{{uldInfo.wgtManifest? uldInfo.wgtManifest : '-'}}</text>
			</view>
			<view class="content">
				<text class="lableWidth right gray">差异额</text>
				<text class="lableWidth" :style="[{color: Math.abs(parseFloat(this.wgtDiff)) < 30 ? '#595959' : 'red'}]">{{wgtDiff}}</text>
				<text class="lableWidth 190 right gray">差异率</text>
				<text class="lableWidth" :style="[{color: Math.abs(parseFloat(this.diffRant)) < 2 ? '#595959' : 'red'}]">{{diffRant}}</text>
			</view>
		</view>
		<view class="reweightContent bottom buttom">
			<view class="content bottom">
				<button class="weightBottom short" @click="print()" plain="true">打印指示牌</button>
				<button class="weightBottom short delete" @click="deleteUld()" plain="true">删除</button>
			</view>
			<view class="bottomButtom">
				<button class="weightBottom long" plain="true" @click="nextULD">下一ULD</button>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick()" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import {
		getScale,
		getLocationCode,
		getUldLoadInfo,
		checkFrame,
		saveLocation,
		reWgtPutin,
		deleteReWeight
	} from '@/common/api/departure/reWeight/reWeightApi.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import tuiModal from "@/components/modal"
	import Stomp from "stompjs"
	import {
		WebSocket
	} from '@/common/util/websocket-uni.js'
	import {
		ignoreNull
	} from '@/common/util/util.js'
	import msgTip from '@/components/tip/tip.vue'
	import uniCountdown from "@/components/uni-countdown/uni-countdown.vue"
	export default {
		components: {
			msgTip,
			tuiModal,
			uniCountdown
		},
		data() {
			return {
				// mq相关
				exchange: null,
				client: null,
				// form信息
				uldFocus: true,
				uldNumFocus: false,
				// 倒计时相关信息
				reset: false,
				day: 0,
				second: 0,
				hour: 0,
				minute: 0,
				checkValue: '',
				// 弹窗信息
				dialogMsg: '',
				modal: false,
				// 基础信息
				palletDisabled: true, // 板架号flag
				numArray: [], // 磅秤号列表
				locationArray: [], // 区位列表
				uldInfo: { // uld航班信息
					flightDate: '', // 预配航班日期
					carrier: '', // 承运人
					flight: '', // 航班号 
					destination: '', // 目的地
					maxVol: '', // 体积
					wgtManifest: '' // 舱单毛重
				},
				uldLoadInfo: { // 复称信息
					// 复称信息
					wgtDiff: '', // 差异额
					wgtReweigh: '', // 复称重量
					diffRant: '', // 差异率
					// uld信息
					waitLocation: '', // 区位
					tareWeight: '', // 皮重
					wgtAdjust: 0, // 调整重量
					banjia: '' // 板架
				},
				banInfo: {
					frameNo: '', // 板架号码
					frameWgt: 0, // 板架重量
				},
				form: { // 表单信息
					uldType: 'CAR',
					uldNo: '',
					uldNoSuffix: 'GN',
				},
				clientRetryTimes: 3,
				weightNumFocusFlag: false,
				reTryTimes: 10,
				scale: { // 磅秤信息
					bangNum: '',
					weight: ''
				},
			}
		},
		computed: {
			wgtReweigh() { // 复称重量，磅秤重量-调整重量-皮重
				if (this.uldLoadInfo.reweighStatus === '1' && this.uldLoadInfo.wgtReweigh && !this.scale.weight) {
					return this.uldLoadInfo.wgtReweigh
				}
				return this.getWgtReweigh(this.scale.weight, this.uldLoadInfo.wgtAdjust, this.tareReweigh)
			},
			tareReweigh() { // 皮重 = uld自重 + 已过磅重量 + 板架自重（可选）
				return this.getTareReweigh(this.uldLoadInfo.uldWgt, this.uldInfo.cargoWgt, this.banInfo.frameWgt)
			},
			wgtDiff() { // 差异额 = 复称重量 - 舱单毛重
				if (this.uldLoadInfo.reweighStatus === '1' && this.uldLoadInfo.wgtReweigh && !this.scale.weight) {
					return this.uldLoadInfo.wgtDiff
				}
				return this.getWgtDiff(this.wgtReweigh, this.uldInfo.wgtManifest)
			},
			diffRant() { // 差异率 = 差异额 / 舱单毛重
				if (this.uldLoadInfo.reweighStatus === '1' && this.uldLoadInfo.wgtReweigh && !this.scale.weight) {
					return this.uldLoadInfo.diffRant
				}
				return this.GetPercent(this.wgtDiff, this.uldInfo.wgtManifest);
			}
		},
		onLoad(params) {
			console.log(params)
		},
		mounted() {
			this.getScale()
			this.getLocationCode()
			this.weightNumFocusFlag = true
		},
		beforeDestroy() {
			this.exchange = null
			uni.closeSocket()
		},
		methods: {
			// 磅秤重量设置
			bangwChange(val) {
				this.scale.weight = val.detail.value
			},
			// 聚焦磅秤号信息
			weightNumFocus() {
				// this.scale.bangNum = '172.17.9.222'
				this.scale.bangNum = ''
				uni.closeSocket()
			},
			// 失焦磅秤号信息
			weightNumChange(val) {
				if (!this.numArray) {
					this.getScale()
				} else {
					let match = this.numArray.find(item => item.ip === this.scale.bangNum)
					if (match) {
						this.scale.bangNum = match.aisleName
						uni.closeSocket()
						this.exchange = match.ip
						this.connectInit()
						// 聚焦到uldno
						this.uldNumFocus = true
					} else if (this.scale.bangNum !== '') {
						this.$message('未能匹配对应的磅秤号')
					}
				}
			},
			connectInit() {
				this.client = Stomp.client('ws://172.17.6.61:15674/ws')
				// this.client = Stomp.client('ws://10.1.16.50:15674/ws')				
				// this.client = Stomp.client('ws://10.1.16.117:9090/ws')				
				const headers = {
					login: 'cargo.scale',
					passcode: 'cargo.scale'
					// login: 'admin',
					// passcode: 'admin'
				};
				this.client.connect(headers.login, headers.passcode, this.onConnected, this.onFailed, 'xmn.scale') // xmn.scale, cargoWgt
				// setTimeout(() => {
				// 	if (!this.client.connected && this.clientRetryTimes) {
				// 		this.clientRetryTimes --
				// 		this.connectInit()
				// 	}
				// }, 100)
			},
			onConnected(frame) {
				this.client.subscribe(this.exchange, this.responseCallback, {
					'auto-delete': false,
					'x-max-length': 10
				});
			},
			onFailed(frame) {
				this.$message('连接mq失败！请检查网络设置')
			},
			responseCallback(frame) {
				this.scale.weight = Number(frame.body)
			},
			test() {
				this.msg(this.client ? this.client.connected : 'false', 'green')
			},
			// *******************ULD框处理*********************
			uldTypeFocus() { // 聚焦uld前缀
				this.form.uldType = ''
			},
			uldNoFocus() { // 运单号聚焦
				this.form.uldNo = ''
			},
			uldTypeChange(val) { // 输入uld前缀
				if (val.detail.value.length === 3) {
					this.form.uldType = val.detail.value.toLocaleUpperCase()
				}
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
			uldNoChange(val) { // 运单号输入
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
			uldSubPrefixChange(val) {
				this.form.uldNoSuffix = val.detail.value.toLocaleUpperCase()
			},
			uldJudge() {
				if (this.form.uldNoSuffix && this.form.uldNo && this.form.uldType) {
					this.getUldInfo()
				}
			},
			// *****************倒计时相关函数********************
			getTime(row) { // 计划起飞时间-（系统维护时间 或者未维护按90分钟算）+20分钟}-当前时间
				let timeSecond = 0
				timeSecond = parseFloat(row.depTimeSchedule) - (row.aheadTime ? parseFloat(row.aheadTime) * 60 * 1000 : 90 * 60 *
						1000) + (20 *
						60 * 1000) -
					parseFloat(row.sysDate)
				// timeSecond = 10000
				if (timeSecond > 0) {
					this.second = (timeSecond % (1000 * 60)) / 1000;
					this.hour = parseInt((timeSecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					this.minute = parseInt((timeSecond % (1000 * 60 * 60)) / (1000 * 60));
					this.day = parseInt(timeSecond / 1000 / 60 / 60 / 24); // 隐藏天数情况
					this.reset = !this.reset
				} else {
					this.timeUp()
				}
			},
			timeUp() { // 截关时间到期
				this.day = 0
				this.hour = 0
				this.minute = 0
				this.second = 0
				this.reset = !this.reset
				// 弹窗提示
				this.dialogMsg = '复称截关时间已到，请确认'
				this.modal = true
			},
			resetTimeUp() { // 倒计时清空
				this.day = 0
				this.hour = 0
				this.minute = 0
				this.second = 0
				this.reset = !this.reset
			},
			// *****************选择相关信息************************
			getScale() { // 获取磅秤号信息
				getScale().then(res => {
					if (res.data && res.data.length > 0) {
						this.numArray = res.data
						// 增加未请求到数据的判断
					} else {
						if (this.reTryTimes) {
							setTimeout(() => {
								this.reTryTimes--
								this.getScale()
							}, 100)
						}
					}
				})
			},
			getLocationCode() {
				getLocationCode().then(res => {
					if (res.data && res.data.length > 0) {
						this.locationArray = res.data
					}
				})
			},
			changeValue(val) { // 选择磅秤号
				if (val.target.value === '-1') {
					this.scale.bangNum = 0
				} else {
					this.scale.bangNum = this.numArray[val.target.value].aisleName
				}

			},
			locationChange(val) { // 选择区位
				if (val.target.value === '-1') {
					this.uldLoadInfo.waitLocation = 0
				} else {
					// this.uldLoadInfo.waitLocation = val.target.value
					this.uldLoadInfo.waitLocation = this.locationArray[val.target.value].TYPECODE
					// console.log(Number(val.target.value), val.target.value, this.locationArray)
				}
			},
			banChange(val) { // 是否选择板架
				this.palletDisabled = val.detail.value.length < 1
				if (this.palletDisabled) {
					this.banInfo.frameNo = ''
					this.banInfo.frameWgt = ''
				}
			},
			// ****************************uld相关信息******************************
			getUldInfo() { // 获取uld信息，uld第三个输入框回车触发
				if (this.form.uldType && this.form.uldNo && this.form.uldNoSuffix) {
					let row = {
						uldType: this.form.uldType,
						uldNo: this.form.uldNo,
						uldNoSuffix: this.form.uldNoSuffix
					}
					getUldLoadInfo(row).then(res => {
						if (res.data && res.data.uldLoadEntity) {
							this.uldInfo = res.data
							this.uldLoadInfo = res.data.uldLoadEntity
							this.uldLoadInfo.tareWeight = res.data.cargoWgt
							this.getTime(res.data)
							if (res.data.uldLoadEntity.reweighStatus === '1') { // 若复称弹窗提示
								this.dialogMsg = '当前uld已复称录入，是否继续复称录入'
								this.modal = true
							}
							if (!res.data.uldLoadEntity.waitLocation) { // 若区位为空
								this.uldLoadInfo.waitLocation = this.locationArray[3].TYPECODE
							}
						} else {
							this.msg('未查询到相关uld信息，请确认', 'warning')
						}
					})
				} else {
					this.msg('请输入正确的uld号', 'warning')
				}
			},
			getFrame() { // 获取板架重量，板架号码输入框回车触发
				if (this.banInfo.frameNo) {
					let row = {
						frameNo: this.banInfo.frameNo
					}
					checkFrame(row).then(res => {
						if (res.data) {
							this.banInfo.frameWgt = res.data
							console.log(res.data)
							this.msg('查询板架重量成功', 'green')
						} else {
							this.msg(res.message, 'warning')
						}
					})
				} else {
					this.msg('请输入正确的板架号码', 'warning')
				}
			},
			checkFrame() {
				this.getFrame()
			},
			// ******************复称录入相关方法********************
			reWeightEnter() { // 复称录入判断
				if (this.scale.bangNum) {
					if (parseFloat(this.wgtReweigh) > 0) {
						if (Math.abs(parseFloat(this.wgtDiff)) < 30) { // 差异额小于30
							if (Math.abs(parseFloat(this.diffRant)) < 2) { // 差异率小于2%
								this.reWeightHandle()
							} else {
								this.dialogMsg = '差异率超出范围,是否继续复称录入'
								this.modal = true
							}
						} else {
							this.msg('录入失败,差异额(' + this.wgtDiff + ')超出!' + '不可录入', 'warning')
						}
					} else {
						this.msg('录入失败,请确认复称重量是否正确', 'warning')
					}
				} else {
					this.msg('录入失败,请确认是否已经选择磅秤', 'warning')
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
					scaleNo: this.scale.bangNum // 磅秤号
				}
				reWgtPutin(row).then(res => {
					if (res.message) {
						uni.pageScrollTo({ // 滚动置底部
							scrollTop: 10000,
							duration: 300
						})
						this.msg(res.message, res.status === 1 ?
							'green' : 'warning')
					}
				})
			},
			// *****************弹窗处理方法*********************
			handleClick(e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					if (this.dialogMsg === '复称截关时间已到，请确认') {
						console.log('倒计时终止')
					} else if (this.dialogMsg === '当前uld已复称录入，是否继续复称录入') {
						console.log('已进行复称录入')
					} else if (this.dialogMsg === '是否确认删除当前uld的复称信息？') {
						this.saveLocation('delete')
					} else {
						this.reWeightHandle()
					}
					this.modal = false
				}
			},
			hide() { // 关闭提示弹窗
				this.modal = false
			},
			// ******************其他按钮操作******************
			saveLocation(type) { // 保存区位信息 / 删除信息
				let flag = type === 'delete'
				if (this.uldLoadInfo.id && (flag || this.uldLoadInfo.waitLocation)) {
					let row = {
						id: this.uldLoadInfo.id,
						waitLocation: flag ? null : this.uldLoadInfo.waitLocation
					}
					let handle = flag ? deleteReWeight : saveLocation
					handle(ignoreNull(row)).then(res => {
						this.getUldInfo() // 重新获取信息
						this.msg(res.message, res.status === 1 ?
							'green' : 'warning')
					})
				} else {
					this.msg(flag ? '请先提取需要删除的uld信息' : '请先提取需要保存的区位信息', 'warning')
				}
			},
			deleteUld() { // 删除uld信息
				this.dialogMsg = '是否确认删除当前uld的复称信息？'
				this.modal = true
			},
			nextULD() { //点击“下一个ULD”按钮，清空所有数据的显示。
				this.uldLoadInfo = { // 复称信息
					wgtDiff: '', // 差异额
					wgtReweigh: '',
					diffRant: '',
					waitLocation: '', // 区位
					tareWeight: '', // 皮重
					wgtAdjust: '', // 调整重量
					frameNo: '', // 板架号码
					banjia: '' // 板架
				}
				this.uldInfo = { // uld航班信息
					flightDate: '', // 航班日期
					carrier: '', // 承运人
					flight: '', // 航班号
					destination: '', // 目的地
					maxVol: '', // 体积
					wgtManifest: '' // 舱单毛重
				}
				this.form = { // uld号码
					uldType: 'CAR',
					uldNo: '',
					uldNoSuffix: 'GN',
				}
				this.resetTimeUp()
				uni.pageScrollTo({ // 滚动置顶
					scrollTop: 0,
					duration: 300
				})
			},
			print() { // 打印指示牌
				this.msg('暂时无法打印指示牌', 'warning')
			},
			// ************工具函数*******************
			dayjs,
			findByValue(dic, value) {
				let result = ''
				if (dic === 'locationArray') {
					if (this.locationArray) {
						for (let item of this.locationArray) {
							if (value === item.TYPECODE) {
								return item.TYPENAME
							}
						}
					}
				} else if (dic === 'numArray') {
					if (this.numArray) {
						for (let item of this.numArray) {
							if (value === item.aisleName) {
								return item.aisleName
							}
						}
					}
				}
				// if (typeof(value) === 'string' || typeof(value) === 'number') {
				// 	let index = 0
				// 	index = findArray(dic, value)
				// 	if (index !== -1) {
				// 		result = dic[index].label
				// 	} else {
				// 		result = value
				// 	}
				// } else if (value instanceof Array) {
				// 	result = []
				// 	let index = 0
				// 	value.forEach(ele => {
				// 		index = findArray(dic, ele)
				// 		if (index !== -1) {
				// 			result.push(dic[index].label)
				// 		} else {
				// 			result.push(value)
				// 		}
				// 	})
				// 	result = result.toString()
				// }
				return result
			},
			getWgtReweigh(scaleWeight, wgtAdjust, tareWeight) { // 计算复称重量
				scaleWeight = parseFloat(scaleWeight)
				wgtAdjust = wgtAdjust ? parseFloat(wgtAdjust) : 0
				tareWeight = parseFloat(tareWeight)
				if (isNaN(scaleWeight) || isNaN(tareWeight)) {
					return 0
				}
				// return scaleWeight + wgtAdjust - tareWeight
				return (scaleWeight + wgtAdjust - tareWeight).toFixed(2)
			},
			getWgtDiff(wgtReweigh, wgtManifest) { // 计算差异额
				wgtManifest = parseFloat(wgtManifest)
				wgtReweigh = parseFloat(wgtReweigh)
				if (isNaN(wgtManifest) || isNaN(wgtReweigh) || !wgtReweigh) {
					return "-";
				}
				return (wgtReweigh - wgtManifest).toFixed(2)
			},
			getTareReweigh(a, b, c) { // 计算皮重的方法
				a = parseFloat(a)
				b = parseFloat(b)
				c = c ? parseFloat(c) : 0
				if (isNaN(a) || isNaN(b)) {
					return ''
				}
				// return a + b + c
				console.log(c)
				return c ? c : a
			},
			GetPercent(num, total) { // 获取百分比数
				num = parseFloat(num);
				total = parseFloat(total);
				if (isNaN(num) || isNaN(total)) {
					return "-";
				}
				return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
			},
			msg(msg, type) { // 消息提示
				let message = msg
				let options = {
					msg: message,
					duration: 2000,
					type: type
				}
				this.$refs.toast.showTips(options);
			}
		}
	}
</script>

<style lang="scss">
	.reweightClass {
		background-color: #F4F5F6;

		.lableWidth {
			// 表单文字
			width: 150upx;
			font-size: 35upx;
			line-height: 80upx;
			padding: 0 0 0 30upx;

			&.short {
				width: 90upx;
			}

			&.long {
				width: 250upx;
			}

			&.190 {
				width: 190upx;
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

		.tab-class {
			margin-top: 10upx;
			font-size: 35upx;
			padding: 0 0 0 0upx;
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

			&.long {
				width: 200upx;
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
			// height: 80upx;
			font-size: 35upx;
			vertical-align: center;
			color: #0ebf9c;
			border: 1px solid #0ebf9c;

			&.short {
				width: 40%
			}

			&.long {
				color: white;
				background-color: #0ebf9c;
			}

			&.delete {
				color: black;
				border-color: #b4b5b6;
			}
		}

		.reweightContent {
			display: flex;
			background: #ffffff;
			flex-direction: column;
			margin: 20upx 10upx;
			color: #595959;
			padding: 30upx 0;

			&.head {
				.head-input {
					display: flex;
					flex-wrap: wrap;
				}
			}

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
					padding: 0upx 0upx 0 40upx;
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
		}

	}
</style>
