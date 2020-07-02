<template>
	<view class="departureHandover" :style="[{height:theHeight + 'px'}]">
		<headBar :name="title"></headBar>
		<msg-tip ref="toast"></msg-tip>
		<view class="top">
			<view class="row">
				<text class="labelWidth">板箱号</text>
				<input class="picker-text" type="text" value="" />
			</view>
			<view class="row">
				<text class="labelWidth">航班号</text>
				<input class="picker-text" type="text" :value="form.flight" />
			</view>
			<view class="row">
				<text class="labelWidth">航班日期</text>
				<picker mode="date" :value="form.flightDate" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="picker-text">{{form.flightDate}}</view>
				</picker>
			</view>
			<button type="primary" plain="true" @click="getData">查询</button>
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
			const currentDate = this.getDate({
				format: true
			})
			return {
				title: '',
				flag: null, //区分进出港
				theHeight: 0,
				form: {
					flight: '',
					flightDate: currentDate,
				}
			}
		},
		onLoad:function(option){
			if (option.item) {
				if (option.item === 'departure') {
					this.title = '出港交接'
					this.flag = true
				} else {
					this.title = '进港交接'
					this.flag = false
				}
			}
			let that = this
			uni.getSystemInfo({
			    success: function (res) {
					let windowHeight = res.windowHeight
			        that.theHeight = windowHeight - (windowHeight * (80 / 750))
			    }
			})
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			getData () {
				uni.navigateTo({
					url: `/pages/departure/handover/index?item=` + this.title
				})
			},
			bindDateChange: function(e) {
				this.form.flightDate = e.target.value
			},
			getDate(type) {
				const date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				
				if (type === 'start') {
					year = year - 60
				} else if (type === 'end') {
					year = year + 2
				}
				month = month > 9 ? month : '0' + month
				day = day > 9 ? day : '0' + day
				return `${year}-${month}-${day}`
			}
		},
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}
	.departureHandover{
		background: #ffffff;
		overflow: hidden;
		.top{
			overflow: hidden;
			display: flex;
			font-size: 40upx;
			flex-direction: column;
			margin-top: 10upx;
			color: #595959;
			padding: 30upx 0;
			// border: solid 2upx #e5e5e5;
			button {
				margin-top: 30upx;
				width: 92%;
				color: #0ebf9c;
				font-size: 40upx;
				border:1px solid #0ebf9c
			}
			.row{
				display: flex;
				flex-direction: row;
				margin-top: 20upx;
				height: 120upx;
				.labelWidth{
					width: 170upx;
					height: 100upx;
					text-align: left;
					line-height: 100upx;
					margin-left: 40upx;
					font-size: 40upx;
					margin-right: 20upx;
				}
				.picker-text{
					width: 490upx;
					height: 100upx;
					text-align: center;
					line-height: 100upx;
					font-size: 40upx;
					border: solid 3upx #dbdbdb;
				}
			}
		}
	}
</style>
