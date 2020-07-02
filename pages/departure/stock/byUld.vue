<template>
	<view class="byuldInfo">
		<view class="tab-class">
			<text class="lableWidth long bold thin" style="margin-right: 30upx;">ULD详情</text>
		</view>
		<view class="reweightContent bottom" style="font-size: 25upx;">
			<view class="content">
				<text class="lableWidth gray thin">ULD状态</text>
				<text class="lableWidth center 190 gray thin">入库时间</text>
				<text class="lableWidth 190 gray right thin">航班号</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{(uldInfo.uldMgtEntity && uldInfo.uldMgtEntity.uldStatus) ? formatUldStatus(uldInfo.uldMgtEntity.uldStatus):'-'}}</text>
				<text class="lableWidth center thin long">{{uldInfo.storageTime ? format(uldInfo.storageTime) : '-'}}</text>
				<text class="lableWidth right thin">{{(uldInfo.flightInfo && uldInfo.flightInfo.carrier) ? uldInfo.flightInfo.carrier+uldInfo.flightInfo.flight : '-'}}</text>
			</view>
			<view class="content" style="margin-top: 20upx;">
				<text class="lableWidth gray thin">航班日期</text>
				<text class="lableWidth center 190 gray thin">航段</text>
				<text class="lableWidth 190 gray right thin">仓库</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{flightDate}}</text>
				<text class="lableWidth center thin">{{(uldInfo.flightInfo && uldInfo.flightInfo.origin) ? uldInfo.flightInfo.origin : '-'}}-{{uldInfo.flightInfo.destination ? uldInfo.flightInfo.destination : '-'}}</text>
				<text class="lableWidth right thin">{{(uldInfo && uldInfo.warehouseName) ? uldInfo.warehouseName : '-'}}</text>
			</view>
			<view class="content" style="margin-top: 20upx;">
				<text class="lableWidth gray thin">库位</text>
				<text class="lableWidth center 190 gray thin">复称状态</text>
				<text class="lableWidth 190 gray right thin">盘点状态</text>
			</view>
			<view class="content">
				<text class="lableWidth thin">{{(uldInfo && uldInfo.locationCode)? uldInfo.locationCode : '-'}}</text>
				<text class="lableWidth center thin">{{(uldInfo && uldInfo.uldStatus) ? (uldInfo.uldStatus === '1' ? '已复称' : '未复称') : '-'}}</text>
				<text class="lableWidth right thin">{{uldInfo.checkUld ? (uldInfo.checkUld === '1' ? '异常': '正常') : '-'}}</text>
			</view>
			<view class="dash">
			</view>
			<view class="middle-bottom">
				<textarea class="uld-textarea" v-model="uldInfo.remark" maxlength="60" placeholder="请输入备注" />
				</view>
			<view >
				<button  class="weightBottom save" type="primary" plain="true" @click="save()">保存</button>
			</view>
		</view>
		<view class="tableForReWeight2" style="padding-top:0;padding-bottom: 0;">
			<view class="table" style="overflow:scroll;display: -webkit-box;overflow-x: scroll;-webkit-overflow-scrolling: touch;">
				<view class="reweightContent3" style="padding-top:0;padding-bottom: 0;width:2600upx;padding: 20upx 20upx;">
					<view class="head list" style="border:0;">
						<text>运单号</text>
						<text>品名</text>
						<text>件数</text>
						<text>重量</text>
						<text>体积</text>
						<text>货代</text>
						<text>目的站</text>
						<text>特殊代码</text>
						<text>财务代码</text>
						<text>交单状态</text>
						<text>盘点状态</text>
					</view>
					<view class="list-item center" v-for="(item, index) in uldInfo.wbList" :key="index" style="background-color:expression((index%2==0) ? 'red':'blue'">
						<text class="yun-text">
							{{item.wbPrefix + item.wbNo}}
						</text>
						<text>{{item.cargoName}}</text>
						<text>{{item.wbNum}}</text>
						<text>{{item.weight}}</text>
						<text>{{item.wbVol}}</text>
						<text>{{item.proxy}}</text>
						<text>{{item.destination}}</text>
						<text>{{item.specialCode}}</text>
						<text>{{item.financeCode}}</text>
						<text>{{item.isSubmit === '1' ? '已交单': (item.isSubmit === '0' ? '未交单' : '-')}}</text>
						<text>{{item.checkStatus === '1' ? '异常': (item.checkStatus === '0' ? '正常' : '-')}}</text>
					</view>
				</view>
			</view>
		<!-- 	<view class="head" style="border-top:0;">
				<text style="width:20%;">运单号</text>
				<text>品名</text>
				<text>件数</text>
				<text>重量</text>
				<text>体积</text>
			</view>
			<view class="list-item" v-for="(item, index) in uldInfo.wbList" v-show="index < 3" :key="index">
				<text  style="width:20%;">{{item.wbPrefix + item.wbNo}}</text>
				<text>{{item.cargoName}}</text>
				<text>{{item.wbNum}}</text>
				<text>{{item.weight}}</text>
				<text>{{item.wbVol}}</text>
			</view>
			<view class="list-item" @click="checkMore()" v-show="uldInfo.wbList && uldInfo.wbList.length > 0" style="text-align: center;">
				<text style="width: 200upx;margin: auto;">查看更多信息</text>
			</view> -->
		</view>
		<view class="reweightContent bottom">
		<!-- 	<view class="content">
				<text class="lableWidth cuIcon-infofill yellow center">运单异常</text>
				<text class="lableWidth cuIcon-roundcheckfill yellow center" style="color: #52c41a;">运单正常</text>
			</view>
			<view class="content">
				<button type="primary" :class="['weightBottom','short',ischeck1 ? 'ischeck' : null]" plain="true"  @click="abnormal(1)">
					<text class="cuIcon-favor"></text> 标记</button>
				<button type="primary"  :class="['weightBottom','short',ischeck2 ? 'ischeck' : null]" plain="true" @click="abnormal(0)">
					<text class="cuIcon-favor"></text> 标记</button>
			</view>
			<view class="dash">
			</view> -->
			<view class="content">
				<view style="width: 50%;display: flex;flex-direction: row;">
					<b class="left1"></b>
				<text class="lableWidth cuIcon-infofill yellow center">ULD异常</text>
				<b class="right1"></b>
				</view>
				<view style="width: 50%;display: flex;flex-direction: row;">
					<b class="left2"></b>
				<text class="lableWidth cuIcon-roundcheckfill yellow center" style="color: #52c41a;">ULD正常</text>
				<b class="right2"></b>
				</view>
			</view>
			<view class="content">
				<!-- uld异常 -->
				<button type="primary" :class="['weightBottom','short',ischeck1 ? 'ischeck' : null]" plain="true" @click="abnormal(1, 'uld')">
					<text class="cuIcon-favor"></text> 标记</button>
				<!-- uld正常 -->
				<button type="primary" :class="['weightBottom','short',ischeck2 ? 'ischeck' : null]" plain="true" @click="abnormal(0, 'uld')">
					<text class="cuIcon-favor"></text> 标记</button>
			</view>
			<view class="dash">
			</view>
			<view class="middle-bottom">
				<textarea class="uld-textarea" v-model="uldInfo.exception" maxlength="60" placeholder="请输入异常信息" />
			</view>
			<view >
				<button  class="weightBottom save" type="primary" plain="true" @click="save('exception')">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		signUldNormal,signUldException,saveUldException,saveRemark
	} from '@/common/api/departure/stock/stockApi.js'
	import { mapGetters } from 'vuex'
	import scroll from '@/components/notice-bar/uni-notice-bar.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import {ignoreNull} from '@/common/util/util.js'
	export default {
		components:{
			scroll
		},
		props: ['uldInfo'],
		data() {
			return {
				listHeight: '',
				tapCurrentIndex: -1,
				ischeck1: false, // uld异常标志位
				ischeck2: false, // uld正常标志位
			}
		},
		computed:{
			...mapGetters(['dic']),
			flightDate() {
				return (this.uldInfo.flightInfo && this.uldInfo.flightInfo.flightDate)? this.format(this.uldInfo.flightInfo.flightDate, 'date') : '-'
			}
		},
		methods: {
			dayjs,
			formatUldStatus (status) {
				let match = this.dic.uldType_dic.find(item =>  item.TYPECODE === status)
				if (match) {
					return match.TYPENAME
				}
				return ''
			},
			checkMore () {
				if (this.uldInfo.wbList.length > 0) {
					console.log('checkMore',this.uldInfo.wbList)
					uni.navigateTo({
						url: '/pages/departure/stock/tableForUld?item=' + encodeURIComponent(JSON.stringify(this.uldInfo.wbList))
					})
				} else {
					this.msg('请先提取信息', 'warning')
				}
				},
			format (val, type) {
				if (!!val) {
					if (type === 'date') {
						return dayjs(val).format('YYYY-MM-DD')
					}
					return dayjs(val).format('YYYY-MM-DD hh:mm')
				}
				return '-'
			},
			save (type) { // 保存备注/异常信息
			    let flag = type === 'exception' // true 为保存异常信息
				if(!!this.uldInfo.uldMgtEntity.id) {
				let row = {
					uldId: this.uldInfo.uldMgtEntity.id,
						uldType: this.uldInfo.uldMgtEntity.uldType,
						uldNo: this.uldInfo.uldMgtEntity.uldNo,
						uldNoSuffix: this.uldInfo.uldMgtEntity.uldNoSuffix,
					exceptionMsg: flag ? this.uldInfo.exception : null,
					remark: flag ? null : this.uldInfo.remark
				}
				let handle = flag ? saveUldException : saveRemark
				handle(ignoreNull(row)).then(res => {
					this.$emit('getData','getData')
					this.$emit('handleMsg',{
						msg: res.message,
						type: 'green'
					})
				})
				} else {
					this.$emit('handleMsg',{msg: '请先查询uld信息',})
				  }
				},
			abnormal (val, type) { // type 控制uld或者运单
				if(!!this.uldInfo.uldMgtEntity.id) {
				let checkUld = this.uldInfo.checkUld // 1 为异常，0 为正常，其他情况为未盘点
				let flag = val === 1 // true为点击了异常，false为点击了正常
				// let typeFlag = type === 'uld' // true为uld异常标记
				// typeFlag ? (flag ? this.ischeckULD2 = false : this.ischeckULD1 = false) : (flag ? this.ischeck2 = false : this.ischeck1 = false)
				// typeFlag ? (flag ? this.ischeckULD1 = true : this.ischeckULD2 = true) : (flag ? this.ischeck1 = true : this.ischeck2 = true)
				if (( checkUld === '1' || checkUld === '0' ) && (checkUld === '1') === !!flag) { // 当前 盘点状态为异常
				  this.$emit('handleMsg',{
				  	msg: '当前的ULD状态已为'+ (flag ? '异常' : '正常') +',请确认',
				  })
				} else {
				let handle = flag ? signUldException : signUldNormal // 标记正常/标记异常
				let row = {
					uldId: this.uldInfo.uldMgtEntity.id,
			     	uldType: this.uldInfo.uldMgtEntity.uldType,
			    	uldNo: this.uldInfo.uldMgtEntity.uldNo,
			    	uldNoSuffix: this.uldInfo.uldMgtEntity.uldNoSuffix
				}
				handle(row).then(res => {
					// if(flag) {
					// 	this.ischeck2 = false
					// 	this.ischeck1 = true
					// } else {
					// 	this.ischeck1 = false
					// 	this.ischeck2 = true
					// }
				this.$emit('handleMsg',{
						   msg: res.message,
						   type: res.status === 1 ? 'green' : null
					   })
				this.$emit('getData', 'getData')
					})
				}
			   } else {
				this.$emit('handleMsg',{
					   msg: '请先查询uld',
				   })
				}
			},
			longtap(item) {
				console.log(item)
			},
			handlerButton(e) {
				console.log(e)
			},
			tapEnd() {
				this.tapCurrentIndex = -1
				console.log(11111, this.tapCurrentIndex)
			},
			tapStart(index) {
				this.tapCurrentIndex = index
				console.log(222, index)
			},
			// 判断是否滚动 font-size === 32uxp 换算成16
			judgeScroll(value, index) {
				let valueWidth = uni.upx2px(16) * value.length
				let width = uni.getSystemInfoSync().windowWidth * 0.3
				if (valueWidth - width > 0) {
					return false
				}
				return true
			}
		}
	}
</script>

<style lang="scss">
	.byuldInfo {
		.tableForReWeight2 {
				.reweightContent3 {
					display: flex;
					background: #ffffff;
					flex-direction: column;
					margin: 20upx 10upx;
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
							width: 30%;
							text-align: center;
							font-size: 32upx;
						}
					}
		
					.list-item {
						padding: 30upx 0;
						display: flex;
						vertical-align: center;
						border: solid 2upx #e5e5e5;
		
						&.center {
							border: 0;
							border-top: solid 2upx #e5e5e5;
						}
		
						>text {
							display: block;
							width: 30%;
							text-align: center;
							font-size: 32upx;
						}
					}
				}
			}
		b{
		    display: inline-block;
		    width: 60upx;
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
		.lableWidth {
			width: 150upx;
			font-size: 35upx;
			line-height: 80upx;
			padding: 0 0 0 30upx;

			&.yellow {
				color: #fdb332;
				padding: 0;
				width: 50%;
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
			font-size: 35upx;
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

		.top {
			color: #595959;
			margin: 100upx 0;
			margin-bottom: 20upx;
			background: #FFFFFF;
			width: 100%;
			padding: 30upx 60upx 0 60upx;

			.abnormal {
				color: #1890ff;
				font-size: 35upx;
				height: 100upx;
				line-height: 100upx;
				font-weight: 600;
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
