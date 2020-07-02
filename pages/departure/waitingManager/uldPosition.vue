<template>
	<view class="uldPosition">
		<headBar :name="Title"></headBar>
		<msg-tip ref="toast"></msg-tip>
		<view class="content-top">
			<view class="head-input">
				<text class="lableWidth">ULD号</text>
				<input @blur="check" @input="uldTypeChange" @focus="uldTypeFocus" :class="['uld-input', updateFlag ? 'disable' : '']" :disabled="updateFlag" v-model="form.uldType"/>
				<input @blur="check" @input="uldNoChange" @focus="uldNoFocus" :class="['uld-input', updateFlag ? 'disable' : '']" :disabled="updateFlag" style="margin-left: 0;border-left: 0;" v-model="form.uldNo"/>
				<input @blur="check" :class="['uld-input', updateFlag ? 'disable' : '']" :disabled="updateFlag" style="margin-left: 0;border-left: 0;" v-model="form.uldNoSuffix"/>
			</view>
			<view class="row">
				<text class="lableWidth">预配航班</text>
				<input class="uld-input disable" disabled="true" v-model="form.preplanCarrier"/>
				<input class="uld-input disable" disabled="true" style="margin-left: 0;border-left: 0;" v-model="form.preplanFlight"/>
			</view>
			<view class="row">
				<text class="lableWidth">实配航班</text>
				<input class="uld-input disable" disabled="true" v-model="form.actualCarrier"/>
				<input class="uld-input disable" disabled="true" style="margin-left: 0;border-left: 0;" v-model="form.actualFlight"/>
			</view>
			<view class="row">
				<text class="lableWidth2">待运区位置</text>
				<picker mode="selector" @change="positionChange" :range="numArray" range-key="TYPENAME">
					<view class="pick-text">{{findLocation(this.form.waitLocation)}}</view>
				</picker>
			</view>
		</view>
		<view class="btn">
			<button type="primary" plain="true" @click="back">取消</button>
			<button type="primary" plain="true" @click="save">确认</button>
		</view>
	</view>
</template>

<script>
	import msgTip from '@/components/tip/tip.vue'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import {isEmpty} from '@/common/util/util.js'
	import {getFlight,checkUld,getLocation, addUld, updateUld} from '@/common/api/departure/waitingManager/waitingManager.js'
	export default {
		components: {
			headBar, msgTip
		},
		data() {
			return {
				Title: '',
				updateFlag: false,
				numArray: [],
				form: {
					uldType: 'CAR',
					uldNo: '',
					uldNoSuffix: 'GN',
					preplanCarrier: '',
					preplanFlight: '',
					actualCarrier: '',
					actualMatchFlight: '',
					waitLocation: ''
				}
			}
		},
		onLoad: function (option) {
			this.getLocate()
		    this.Title = option.title
			this.updateFlag = (option.upateFlag === 'true') ? true : false
			const item = JSON.parse(decodeURIComponent(option.item))
			if (item) {
				this.form = item
				this.form.actualCarrier = item.carrier
				this.form.actualFlight = item.flight
				this.form.preplanCarrier = item.preCarrier
				this.form.preplanFlight = item.preFlight
			}
		},
		computed: {
		},
		methods: {
      uldTypeFocus() {
        this.form.uldType = ''
      },
      uldTypeChange(val) {
        console.log('type', val.detail.value)
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
      uldNoFocus() {
        this.form.uldNo = ''
      },
      uldNoChange(val) {
        console.log(val.detail.value, val.detail.value.length)
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
			getLocate () {
				getLocation().then(res => {
					this.numArray = res.data
				})
			},
			findLocation (item) {
				for (let i = 0; i < this.numArray.length; i++) {
					if (item === this.numArray[i].TYPECODE) {
						return this.numArray[i].TYPENAME
					}
				}
			},
			back () {
				uni.navigateBack()
			},
			save () {
				if (!isEmpty(this.form.uldNo) && !isEmpty(this.form.uldType) && !isEmpty(this.form.uldNoSuffix) && !isEmpty(this.form.waitLocation)) {
					if (this.updateFlag) {
						updateUld(this.form).then(res => {
							if (res.status) {
								uni.navigateBack()
							} else {
								uni.showToast({
								  title: res.message,
								  icon: 'none'
								})
								return false
							}
						})
					} else {
						console.log(this.form)
						addUld(this.form).then(res => {
							if (res.status) {
								uni.navigateBack()
							} else {
								uni.showToast({
								  title: res.message,
								  icon: 'none'
								})
								return false
							}
						})
					}
				} else {
					if (isEmpty(this.form.waitLocation)) {
						let options = {
							msg: '特运区位置未填写',
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
					} else {
						let options = {
							msg: 'ULD号未填写完整',
							duration: 2000,
							type: 'green'
						}
						this.$refs.toast.showTips(options)
					}
				}
			},
			check () {
				if (this.form.uldType && this.form.uldNo && this.form.uldNoSuffix) {
					checkUld(this.form).then(res => {
						if (res.status) {
						} else {
							let message = res.message
							let options = {
								msg: message,
								duration: 2000,
								type: 'green'
							}
							this.$refs.toast.showTips(options)
						}
					})
					getFlight(this.form).then(res => {
						if (res.status && res.data) {
							this.form.preplanCarrier = res.data.flightIdPre.carrier
							this.form.preplanFlight = res.data.flightIdPre.flight
							this.form.actualCarrier = res.data.flightId.carrier
							this.form.actualFlight = res.data.flightId.flight
						}
						// else {
						// 	let message = res.message
						// 	let options = {
						// 		msg: message,
						// 		duration: 2000,
						// 		type: 'green'
						// 	}
						// 	this.$refs.toast.showTips(options);
						// }
					})
				}
			},
			positionChange (val) {
				console.log(this.form)
				this.form.waitLocation = this.numArray[val.detail.value].TYPECODE
			}
		},
    watch:{
      'form.uldType' (newVal, oldVal) {
        if (newVal) {
          this.form.uldType = newVal.toUpperCase()
        }
      },
      'form.uldNo' (newVal, oldVal) {
        if (newVal) {
          this.form.uldNo = newVal.toUpperCase()
        }
      },
      'form.uldNoSuffix' (newVal, oldVal) {
        if (newVal) {
          this.form.uldNoSuffix = newVal.toUpperCase()
        }
      }
    },
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}
.uldPosition {
	.disable {
		background: #999999;
	}
	.lableWidth {
		width: 200upx;
		height: 80upx;
		line-height: 80upx;
		padding: 0 0 0 30upx;
		font-size: 35upx;
	}
	.lableWidth2 {
		width: 230upx;
		text-align: center;
		height: 80upx;
		line-height: 80upx;
		font-size: 35upx;
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
		.head-input {
			display: flex;
			flex-wrap: wrap;
		}
		.row {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20upx;
			.uld-input {
				font-size: 35upx;
				text-align: center;
				border: solid 3upx #dbdbdb;
				width: 235upx;
				height: 80upx;
			}
			.pick-text {
				font-size: 35upx;
				text-align: center;
				line-height: 80upx;
				border: solid 3upx #dbdbdb;
				width: 467upx;
				height: 80upx;
			}
		}
		.uld-input {
			font-size: 35upx;
			text-align: center;
			border: solid 3upx #dbdbdb;
			width: 157upx;
			height: 80upx;
		}
	}
	.btn {
		display: flex;
		flex-direction: row;
		margin-top: 30upx;
		button {
			width: 42%;
			color: #0ebf9c;
			font-size: 35upx;
			border:1px solid #0ebf9c
		}
	}
}
</style>
