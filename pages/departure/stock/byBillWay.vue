<template>
	<view class="byBillWay">
		<view class="tab-class">
			<text class="lableWidth long bold thin" style="margin-right: 30upx;">运单详情</text>
		</view>
		<view class="reweightContent bottom" style="font-size: 35upx;">
			<view class="content">
				<text class="lableWidth gray thin">品名</text>
				<text class="lableWidth center 190 gray thin">件数</text>
				<text class="lableWidth 190 gray right thin">重量</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{(billWay.wayBill && billWay.wayBill.cargoName) ? billWay.wayBill.cargoName : '-'}}</text>
				<text class="lableWidth center thin">{{billWay.countSum || billWay.countSum === 0 ? billWay.countSum  : '-'}}</text>
				<text class="lableWidth right thin">{{billWay.countWgt || billWay.countWgt === 0 ?billWay.countWgt  : '-'}}</text>
			</view>
			<view class="content" style="margin-top: 20upx;">
				<text class="lableWidth gray thin">体积</text>
				<text class="lableWidth center 190 gray thin">代理人</text>
				<text class="lableWidth 190 gray right thin">目的站</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{billWay.countVol || billWay.countVol === 0 ?billWay.countVol  : '-'}}</text>
				<text class="lableWidth center thin">{{(billWay.wayBill && billWay.wayBill.proxy) ? billWay.wayBill.proxy  : '-'}}</text>
				<text class="lableWidth right thin">{{(billWay.wayBill && billWay.wayBill.destination) ? billWay.wayBill.destination  : '-'}}</text>
			</view>
			<view class="content" style="margin-top: 20upx;">
				<text class="lableWidth gray thin">特殊代码</text>
				<text class="lableWidth center 190 gray thin">财务代码</text>
				<text class="lableWidth 190 gray right thin">配载状态</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{(billWay.wayBill && billWay.wayBill.specialCode) ?billWay.wayBill.specialCode  : '-'}}</text>
				<text class="lableWidth center thin">{{(billWay.wayBill && billWay.wayBill.financeCode)?billWay.wayBill.financeCode  : '-'}}</text>
				<text class="lableWidth right thin">{{billWay.uldIsFree ? billWay.uldIsFree : '-'}}</text>
			</view>
			<view class="content" style="margin-top: 20upx;">
				<text class="lableWidth gray thin">交单状态</text>
				<text class="lableWidth center 190 gray thin">交单时间</text>
				<text class="lableWidth 190 gray right thin">盘点状态</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{(billWay.wayBill && billWay.wayBill.isSubmit) ? (billWay.wayBill.isSubmit === '1' ? '已交单' : '未交单')  : '-'}}</text>
				<text class="lableWidth center thin long">{{(billWay.wayBill && billWay.wayBill.submitTime) ? format(billWay.wayBill.submitTime)  : '-' }}</text>
				<text class="lableWidth right thin">{{billWay.wayBill.checkStatus ? (billWay.wayBill.checkStatus === '1' ? '异常': '正常')  : '-'}}</text>
			</view>
		</view>
		<view class="reweightContent" style="padding-top:0;padding-bottom: 0;">
			<view class="head" style="border-top:0;">
				<text>库位</text>
				<text>件数</text>
				<text>总件数</text>
			</view>
			<view class="list-item" v-for="(item, index) in billWay.location" :key="index">
				<text>{{item.locationId}}</text>
				<text>{{item.num}}</text>
				<!-- <text>{{item.waybillNum}}</text> -->
				<text>{{billWay.wayBill.wbNum}}</text>
			</view>
			<!-- <view class="list-item" @click="checkMore" v-show="list.length > 3" style="text-align: center;">
				<text style="width: 200upx;margin: auto;">查看更多信息</text>
			</view> -->
		</view>
		<view class="reweightContent bottom">
			<view class="content">
				<view style="width: 50%;display: flex;flex-direction: row;">
					<b class="left1"></b>
					<text class="lableWidth cuIcon-infofill yellow center">异常</text>
					<b class="right1"></b>
				</view>
				<view style="width: 50%;display: flex;flex-direction: row;">
					<b class="left2"></b>
					<text class="lableWidth cuIcon-roundcheckfill yellow center" style="color: #52c41a;">正常</text>
					<b class="right2"></b>
				</view>
			</view>
			<view class="content">
				<button :class="['weightBottom','short',ischeck1 ? 'ischeck' : null]" plain="true" @click="abnormal(1)">
					<text class="cuIcon-favor"></text> 标记</button>
				<button :class="['weightBottom','short',ischeck2 ? 'ischeck' : null]" plain="true" @click="abnormal(0)">
					<text class="cuIcon-favor"></text> 标记</button>
			</view>
			<view class="dash">
			</view>
			<view class="middle-bottom">
				<textarea class="uld-textarea" v-model="billWay.wayBill.exceptionMsg" maxlength="60" placeholder="请输入异常信息" />
				</view>
			<view >
				<button  class="weightBottom save" type="primary" plain="true" @click="saveException">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getWarehouse,signWbNormal,signWbException,saveException
	} from '@/common/api/departure/stock/stockApi.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		name: 'billWay',
		props: ['billWay'],
		data() {
			return {
				ischeck1: false,
				ischeck2: false
			}
		},
		methods: {
			dayjs,
			format (val) {
				if (!!val) {
					return dayjs(val).format('YYYY-MM-DD hh:mm')
				}
				return '-'
			},
			checkMore () {
				console.log('checkmore')
				},
				saveException () { // 保存异常信息
					if(!!this.billWay.wayBill.id) {
					console.log('saveException')
					let row = {
						wbId: this.billWay.wayBill.id,
						wbPrefix:  this.billWay.wayBill.wbPrefix,
						wbNo: this.billWay.wayBill.wbNo,
						exceptionMsg: this.billWay.wayBill.exceptionMsg
					}
					saveException(row).then(res => {
						this.$emit('getData', 'getData')
						this.$emit('handleMsg',{
							msg: res.message,
						})
					})
					} else {
						this.$emit('handleMsg',{
							   msg: '请先查询运单',
						   })
					}
					},
			abnormal (val) {
				if(!!this.billWay.wayBill.id) {
				let flag = val === 1
				flag ? this.ischeck2 = false : this.ischeck1 = false
				flag ? this.ischeck1 = true:  this.ischeck2 = true
				if ((this.billWay.wayBill.checkStatus === '1') === !!flag) { // 当前 盘点状态为异常
				  this.$emit('handleMsg',{
				  	msg: '当前的盘点状态已为'+ (flag ? '异常' : '正常') +',请确认',
				  })
				} else {
				let handle = flag ? signWbException : signWbNormal
				let row = {
					wbId: this.billWay.wayBill.id,
					wbPrefix:  this.billWay.wayBill.wbPrefix,
					wbNo: this.billWay.wayBill.wbNo
				}
				handle(row).then(res => {
					this.$emit('handleMsg',{
						   msg: res.message,
						   type: 'green'
					   })
				this.$emit('getData', 'getData')
					})
				}
			   } else {
				this.$emit('handleMsg',{
					   msg: '请先查询运单',
				   })
				}
			}
		}
	}
</script>

<style lang="scss">
	.byBillWay {
		b{
		    display: inline-block;
		    width: 90upx;
			opacity: 0.3;
		    height: 3px;
		    _overflow: hidden;
		    vertical-align: middle;
			margin:auto;
			&.right1 {
				background: #fdb332 linear-gradient(to right,  #fdb332, #FFFFFF);
			}
			&.left1 {
				background: #fdb332 linear-gradient(to left,  #fdb332, #FFFFFF);
			}
			&.right2 {
				background: #52c41a linear-gradient(to right,  #52c41a, #FFFFFF);
			}
			&.left2 {
				background: #52c41a linear-gradient(to left,  #52c41a, #FFFFFF);
			}
		}
		.aline {
		    background-color:#E6E3E3;
		    height:1px;
		}
		.button1{
			    line-height: 1px;
			    border-left: 200px solid #ddd;
			    border-right: 200px solid #ddd;
			    text-align: center;
		}
		.uld-textarea {
			font-size: 35upx;
			border: solid 3upx #dbdbdb;
			height: 160upx;
			width: 683upx;
		}
		.middle-bottom {
			margin-top: 20upx;
			margin-left: 30upx;
		}
		.dash {
			height: 40upx;
			border-bottom: 4upx dashed #e5e5e5;
		}
		.lableWidth { // 文字
			width: 150upx;
			font-size: 35upx;
			line-height: 80upx;
			padding: 0 0 0 30upx;
			&.yellow {
				color: #fdb332;
				padding: 0;	
				width: 30%;
				vertical-align: center;
				font-size: 35upx;
			}

			&.short {
				width: 90upx;
			}

			&.long {
				width: 250upx;
			}

			&.190 {
				width: 190upx;
			}

			&.bold {
				font-size: 35upx;
				color: #595959;
				font-weight: bold;
			}

			&.right {
				text-align: right;
				padding: 0 30upx 0 30upx;
			}

			&.center {
				text-align: center;
			}

			&.gray {
				color: #a3a3a3;
			}

			&.thin {
				line-height: 60upx;
			}
		}

		.line {
			display: inline-block;
			width: 20upx;
			border-top: 1px solid #ccc;
		}

		.tab-class {
			// margin-top: 10upx;
			font-size: 32upx;
			padding: 0 0 0 0upx;
		}

		.weightBottom {
			width: 100%;
			// height: 80%;
			vertical-align: center;
			color: #595959;
			border-radius: 10upx;
			// border: 1px solid #0ebf9c;
			border: solid 2px #dbdbdb;

            &.ischeck {
				background-color: #0ebf9c;
				color: white;
			}
			&.short {
				width: 40%
			}

			&.middle {
				width: 90%
			}
&.save {
	margin-top: 20upx;
	color: #0ebf9c;
	background-color: white;
	border: solid 1px #0ebf9c;
	width:683upx;
}
			&.long {
				color: white;
				background-color: #0ebf9c;
			}

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
