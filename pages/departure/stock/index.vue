<template>
	<view class="stock">
		<msg-tip ref="toast"></msg-tip>
		<headBar name="出港库存盘点"></headBar>
		<view class="title-stock">
			<view class="tab-class">
				<view class="zhan">
				</view>
				<tab-new :tabList="tabList" :value="currentTab" @change="tabChange">
				</tab-new>
			</view>
		</view>
		<view class="top">
			<view class="flex">
				<view class="left">
					{{currentTab === 0 ? '运单号' : 'ULD号'}}
				</view>
				<view class="right" v-if="currentTab === 0">
					<input placeholder="运单前缀" @input="wbPrefixChange" :value="form.wbPrefix" />
					<input placeholder="请扫描运单号" @input="wbNoChange"  v-model="form.wbNo" :focus="wbNoFocus" />
				</view>
				<view class="right" v-else>
					<input class="reweightInput" @focus="uldTypeFocus" @input="uldTypeChange" :value="form.uldType" placeholder="请扫描" />
					<input class="reweightInput reduceLeft" @focus="uldNoFocus" @input="uldNoChange" :value="form.uldNo" placeholder="请扫描" />
					<input class="reweightInput reduceLeft" :value="form.uldNoSuffix" @input="uldSubPrefixChange" @confirm="getUldInfo()"
					 placeholder="请扫描" />
				</view>
				<view style="marign:auto;margin-left:10upx;">
					<view class="cuIcon-roundclosefill closeClass" @click="clearInfo()"></view>
				</view>
			</view>
			<view class="btn">
				<button type="primary" @click="getInfo()">查询</button>
			</view>
			<view class="dash">
			</view>
			<view class="qcycb">
				<view style="margin:auto 1upx; display:flex;">
					<image :src="require('../../../static/qcycb.png')" class="iconClass" mode="aspectFit"></image>
				</view>
				<!-- <text class="iconClass cuIcon-calendar"></text> -->
				<text class="abnormal" @click="getTable()">
					清仓异常表
				</text>
			</view>
		</view>
		<view class="contend">
			<view class="" v-show="currentTab === 0">
				<byBillWay :billWay="billWayInfo" @handleMsg="reMsg()" ref="billWayInfo" @getData="getInfo()"></byBillWay>
			</view>
			<view class="" v-show="currentTab === 1">
				<byUld :uldInfo="uldInfo" @handleMsg="reMsg()" ref="uldInfo" @getData="getInfo()"></byUld>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import tabNew from '@/components/tab.vue'
	import msgTip from '@/components/tip/tip.vue'
	import tuiModal from "@/components/modal"
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import byBillWay from './byBillWay'
	import byUld from './byUld'
	import {
		model7
	} from '@/common/util/util.js'
	import {
		getWayBill,
		getUldInfo
	} from '@/common/api/departure/stock/stockApi.js'
	export default {
		components: {
			tabNew,
			headBar,
			msgTip,
			byBillWay,
			byUld
		},
		data() {
			return {
				currentTab: 0,
				wbNoFocus: false,
				form: {
					wbPrefix: '',
					wbNo: '',
					uldType: '',
					uldNo: '',
					uldNoSuffix: '',
				},
				billWayInfo: {
					wayBill: {
						submitTime: ''
					}
				},
				uldInfo: {
					uldMgtEntity: {
						createDate: '',
					}
				},
				tabList: ['按运单', '按ULD']
			}
		},
		onLoad(params) {},
		onReady() {},
		methods: {
			clearInfo() {
				console.log('clearInfo')
				if (this.currentTab === 0) {
					this.form.wbPrefix = ''
					this.form.wbNo = ''
					// this.billWayInfo = {}
				} else if (this.currentTab === 1) {
					this.form.uldType = ''
					this.form.uldNo = ''
					this.form.uldNoSuffix = ''
					// this.uldInfo ={}
				}
			},
			// *****************运单信息输入***********************
			part(val) { // 运单号扫描
				let wbNum = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
				let wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
				this.form.wbPrefix = wbPrefix
				this.form.wbNo = wbNum
			},
			// 输入信息
			wbPrefixChange(val) { // 运单前缀输入
				this.wbNoFocus = false
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else {
					this.form.wbPrefix = val.detail.value.toLocaleUpperCase()
					if (this.form.wbPrefix.length === 3 || this.form.wbPrefix === 'YJ') {
						this.wbNoFocus = true
					}
				}
			},
			wbNoChange(val) { // 运单号输入
				if (val.detail.value.length == 11 || val.detail.value.length == 10) {
					this.part(val)
				} else if (val.detail.value.length > 8) {
					setTimeout(() => {
						this.form.wbNo = val.detail.value.substr(0, 8)
					}, 100)
					this.$message('运单号超出8位限制!')
				} else {
					this.form.wbNo = val.detail.value
				}
			},
			// ******************uld信息输入***************************
			uldTypeFocus() { // 聚焦uld前缀
				this.form.uldType = ''
			},
			uldNoFocus() { // 运单号聚焦
				this.form.uldNo = ''
			},
			uldTypeChange(val) { // 输入uld前缀
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
			uldSubPrefixChange(val) { // 运单尾号输入
				this.form.uldNoSuffix = val.detail.value.toLocaleUpperCase()
			},
			// ********************获取信息***************************
			getTable() {
				let flag = this.currentTab === 0
				uni.navigateTo({
					url: '/pages/departure/stock/TableForStock?index=' + flag
				})
			},
			getInfo(msg) { // 条件查询信息
				if ((this.currentTab === 0 && (!model7(this.form.wbPrefix, this.form.wbNo) || this.form.wbNo.length !== 8)) || (
						this.currentTab === 1 &&
						// if ((this.currentTab === 0 || this.form.wbNo.length !== 8)) || (this.currentTab === 1 &&
						(!this.form.uldType || !this.form.uldNo || !this.form.uldNoSuffix))) {
					this.$message('查询条件不符合规则,请确认')
				} else {
					let row1 = {
						uldType: this.form.uldType,
						uldNo: this.form.uldNo,
						uldNoSuffix: this.form.uldNoSuffix
					}
					let row2 = {
						wbPrefix: this.form.wbPrefix,
						wbNo: this.form.wbNo,
					}
					let handle = this.currentTab === 0 ? getWayBill : getUldInfo
					let row = this.currentTab === 0 ? row2 : row1
					this.$loading()
					handle(row).then(res => {
						if (!!res.data) {
							uni.hideLoading()
							if (this.currentTab === 0 && res.data.wayBill) {
								this.$refs.billWayInfo.ischeck1 = res.data.wayBill.checkStatus === '1' ? true : false
								this.$refs.billWayInfo.ischeck2 = res.data.wayBill.checkStatus === '0' ? true : false
							} else if (this.currentTab === 1 && res.data.checkUld) {
								this.$refs.uldInfo.ischeck1 = res.data.checkUld === '1' ? true : false
								this.$refs.uldInfo.ischeck2 = res.data.checkUld === '0' ? true : false
							}
							this.currentTab === 0 ? this.billWayInfo = res.data : this.uldInfo = res.data
							msg === 'getData' ? null : this.msg('查询成功', 'green')
						} else {
							this.$message('未查询到信息，请确认查询条件是否正确')
						}
					})
				}
			},
			reMsg(val) {
				!!val.type ? this.msg(val.msg, val.type) : this.msg(val.msg, 'warning')
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
			tabChange(val) {
				this.currentTab = val.tab
				uni.showLoading();
				setTimeout(function() {
					uni.hideLoading();
				}, 500);
			}
		}
	}
</script>

<style lang="scss">
	// page {
	// 	padding-top: 150upx;
	// }

	.stock {

		.title-stock {
			position: fixed;
			top: 150upx;
			width: 100%;
			z-index: 10;
		}

		.tab-class {

			// margin-top: 10upx;
			.zhan {
				width: 100%;
				z-index: 10;
				height: 20upx;
				/* #ifdef MP-WEIXIN */
				margin-top: -10upx;
				/* #endif */
				/* #ifdef APP-PLUS */
				margin-top: -20upx;
				/* #endif */
				background: #F4F5F6;
			}
		}

		.top {
			color: #595959;
			margin: 250upx 0;
			margin-bottom: 20upx;
			background: #FFFFFF;
			width: 100%;
			padding: 30upx 60upx 0 60upx;

			.qcycb {
				display: flex;
				flex-direction: row;

				.iconClass {
					height: 45upx;

					width: 45upx;
					line-height: 100upx;
					margin-right: 50upx;
				}

				.abnormal {
					color: #1890ff;
					font-size: 35upx;
					height: 100upx;
					line-height: 100upx;
					font-weight: 600;
				}

			}

			.dash {
				height: 40upx;
				border-bottom: 4upx dashed #e5e5e5;
			}

			.btn {
				>button {
					border: 3upx solid #0ebf9c;
					background: #0ebf9c;
				}
			}

			.flex {
				margin-bottom: 20upx;

				.closeClass {
					color: #999999;
					font-size: 50upx;
					padding-top: 5upx;
				}

				.left {
					font-size: 35upx;
					width: 180upx;
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
