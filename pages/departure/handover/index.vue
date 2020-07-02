<template>
	<view class="handoverResult">
		<headBar :name="title"></headBar>
		<msg-tip ref="toast"></msg-tip>
		<view class="top">
			<view class="row">
				<text class="labelWidth">板箱</text>
				<input class="picker-text" type="text" value="" />
				<button plain="true" type="primary">确定</button>
			</view>
			<view class="tip">
				<text>HU7445/11-27/XMN-CGO-INC/</text>
			</view>
		</view>
		<view class="remake" :style="[{height:remakeHeight + 'px'}]">
			<text>交接备注</text>
			<text class="remakeText" :style="remakeFlag? 'word-break:break-all': ''">1222222222222222222222222222222222222222222</text>
			<text @click="changHeight" v-if="!remakeFlag" class="circle">+</text>
			<text @click="changHeight" v-if="remakeFlag" class="circle">-</text>
		</view>
		<view class="middle" :style="[{height:theHeight + 'px'}]">
			<view class="list-item" v-for="(item, index) in list" :key="index">
				<view @click="handelClick(item)" :class="item.check? 'yellow': 'white'">
					<view class="list-top">
						<text style="width: 40%;">{{item.car}}</text>
						<text style="width: 35%;">{{item.Weight + 'KG'}}</text>
						<text style="width: 25%;">{{'出库'}}</text>
					</view>
					<view class="list-bottom">
						<text style="width: 15%;">{{'来源库'}}</text>
						<text style="width: 35%;">{{item.laiyuan}}</text>
						<text style="width: 15%;">{{'备注:'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom" :style="[{height:bottomHeight + 'px'}]">
			<view class="bottom-top" style="margin-top:1px">
				<view class="left">
					<checkbox-group @change="ChangeAll">
						<checkbox :value="checkAll" :checked="checkAll"/>
						<text>{{'全选:'}}</text>
					</checkbox-group>
				</view>
				<view class="right">
					<view class="total">
						<text class="distance">合计:</text>
						<text class="distance2" style="width: 50rpx;">0</text>
						<text class="distance">板</text>
						<text class="distance2" style="width: 50rpx;">0</text>
						<text class="distance">箱</text>
						<text class="distance2" style="width: 50rpx;">8</text>
						<text>斗</text>
					</view>
					<view class="result" v-if="flag === 'departure'">
						<text class="distance">DLS截关:</text>
						<text class="distance2" style="width: 50rpx;">0</text>
						<text class="distance">板(箱)</text>
						<text class="distance2" style="width: 50rpx;">0</text>
						<text>斗</text>
					</view>
				</view>
			</view>
			<button plain="true" type="primary" :style="flag === 'departure'? '': 'margin-top:5px'">提交交接结果</button>
			<view class="btn">
				<button plain="true" type="primary">库区</button>
				<button plain="true" type="primary">司机</button>
				<button plain="true" type="primary">监装</button>
			</view>
		</view>
	</view>
</template>

<script>
	import msgTip from '@/components/tip/tip.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	import {deepCopy, isEmpty} from '@/common/util/util.js'
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	export default {
		components: {
			headBar, msgTip
		},
		data() {
			return {
				remakeHeight: 25,
				remakeFlag: false,
				flag: '', //区分进出港，板斗
				title: '',
				checkAll: false,
				theHeight: 0,
				bottomHeight: 150,
				form: {
					flight: '',
					flightDate: ''
				},
				selectArray: [],
				list: [{car: 'CAR045GN', Weight: '520', check: '', laiyuan: '', chuku: ''},{car: 'CAR045GN', Weight: '520', check: '', laiyuan: '', chuku: ''},{car: 'CAR045GN', Weight: '520', check: '', laiyuan: '', chuku: ''},
				{car: 'CAR045GN', Weight: '520', check: '', laiyuan: '', chuku: ''},{car: 'CAR045GN', Weight: '520', check: '', laiyuan: '', chuku: ''},{car: 'CAR045GN', Weight: '520', check: '', laiyuan: '', chuku: ''}]
			}
		},
		mounted () {
			let view = uni.createSelectorQuery().in(this).select(".middle")
			let clientHeight = uni.getSystemInfoSync().windowHeight
			let that = this
			if (that.flag !== 'departure') {
				that.bottomHeight = 130
			}
			view.boundingClientRect(data => {
				that.theHeight = clientHeight - data.top - that.bottomHeight
			}).exec()
		},
		computed: {
		},
		onLoad:function(option){
			if (option.item) {
				if (option.item === '出港交接') {
					this.title = option.item
					this.flag = 'departure'
				} else if (option.item === '进港交接') {
					this.title = option.item
					this.flag = 'arrival'
				}
			} else {
				this.title = '出港板斗交接'
				this.flag = 'bandou'
			}
		},
		methods: {
			changHeight() {
				console.log(this.remakeHeight)
				if (this.remakeFlag) {
					this.remakeHeight = 25
					this.remakeFlag = false
					this.theHeight = this.theHeight + 25
				} else {
					this.remakeHeight = 50
					this.remakeFlag = true
					this.theHeight = this.theHeight - 25
				}
			},
			handelClick(val){
				if (val.check) {
					val.check = false
				} else {
					val.check = true
				}
			},
			ChangeAll:  function (e) {
				var values = e.detail.value;
				this.selectArray = []
				if(values.includes('false')){
					this.list.forEach(item => {
						this.selectArray.push(item)
						item.check = true
					})
				}else{
					this.list.forEach(item => {
						item.check = false
					})
					this.selectArray = []
				}
				console.log(this.selectArray)
			},
		},
	}
</script>

<style lang="scss">
	page{
		padding-top: 140upx;
		overflow-y: hidden;
	}
.handoverResult {
	background: #FFFFFF;
	.yellow{
		background: yellow;
	}
	.circle {
		width: 20px;
		height: 20px;
		border-radius: 20px;
		background: #fdb332;
		text-align: center;
		line-height: 20px;
		margin-top: 2px;
		color: #FFFFFF;
		font-size: 38upx;
		display: inline-block;
	}
	.distance {
		margin-right: 30upx;
	}
	.distance2 {
		margin-right: 10upx;
	}
	.white{
		background: #FFFFFF;
	}
	.remake{
		padding-left: 20upx;
		font-size: 38upx;
		font-weight: bold;
		background: yellow;
		display: flex;
		flex-direction: row;
		height: 25px;
		line-height: 25px;
		.remakeText {
			width: 70%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.middle{
		overflow-y: auto;
		.list-item{
			display: flex;
			flex-direction: column;
			.list-top{
				display: flex;
				flex-wrap: wrap;
				border-top: solid 2upx #e5e5e5;
				font-size: 42upx;
				height: 80upx;
				line-height: 80upx;
				padding-left: 20upx;
			}
			.list-bottom{
				display: flex;
				flex-wrap: wrap;
				border-bottom: solid 2upx #e5e5e5;
				font-size: 37upx;
				height: 60upx;
				line-height: 60upx;
				padding-left: 20upx;
			}
		}
	}
	.bottom{
		width: 100%;
		position: absolute;
		background: #FFFFFF;
		z-index: 10;
		// height: 150px;
		.btn {
			display: flex;
			flex-direction: row;
			margin-top: 8upx;
			button {
				width: 28%;
				color: #0ebf9c;
				font-size: 35upx;
				border:1px solid #0ebf9c;
				margin-bottom: 40upx;
			}
		}
		button{
			width: 94%;
			color: #0ebf9c;
			font-size: 35upx;
			border:1px solid #0ebf9c
		}
		.bottom-top{
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			.left{
				display: flex;
				flex-direction: row;
				margin-left: 20upx;
				font-size: 32upx;
			}
			.right{
				text-align: right;
				margin-right: 20upx;
				.total{
					font-size: 35upx;
				}
				.result{
					font-size: 35upx;
				}
			}
		}
	}
	.top{
		overflow: hidden;
		display: flex;
		font-size: 35upx;
		flex-direction: column;
		color: #595959;
		padding: 30upx 0 0 0;
		border: solid 2upx #e5e5e5;
		.row{
			display: flex;
			flex-direction: row;
			.labelWidth{
				width: 100upx;
				height: 80upx;
				text-align: left;
				line-height: 80upx;
				margin-left: 40upx;
				font-size: 35upx;
			}
			.picker-text{
				width: 350upx;
				height: 80upx;
				text-align: center;
				line-height: 80upx;
				font-size: 35upx;
				border: solid 3upx #dbdbdb;
			}
			button {
				width: 20%;
				color: #0ebf9c;
				font-size: 35upx;
				height: 80upx;
				line-height: 80upx;
				border:1px solid #0ebf9c
			}
		}
		.tip{
			color: #0A98D5;
			font-size: 35upx;
			margin-top: 10upx;
			margin-left: 40upx;
		}
	}
}
</style>
