<template>
	<view class="main-content">
		<view class="status_bar">
		</view>
		<view class="title">
			<view class="title-left">
				<text class="top">国内进出港</text>
				<view class="flex-title">
					<text class="bottom">{{getHour()}}</text>
					<text class="name">{{getUserName()}}</text>
					<text class="name">{{getRole()}}</text>
				</view>
			</view>
			<view class="title-right" @tap="loginOut">
				<image :src="require('../../static/out.png')" @tap="loginOut" mode="aspectFit"></image>
				<text class="right" @tap="loginOut">退出</text>
			</view>
		</view>
		<!-- 国内出港 -->
		<view class="out">
			<text class="list-title">国内出港</text>
			<view class="list">
				<view :animation="currenItem === item.label ? animationData : ''" class="list-item" @tap="itemClick(item)" v-for="(item, index) in outList" :key="index">
					<image :src="item.imgSrc" mode="aspectFit"></image>
					<text>{{item.label}}</text>
				</view>
			</view>
		</view>
		<!-- 国内进港 -->
		<!-- <view class="out" id="in" :style="{'margin-top': '20px','min-height': '260px'}"> -->
			<view class="out" id="in" :style="{'margin-top': '20px'}">
			<text class="list-title">国内进港</text>
			<view class="list">
				<view :animation="currenItem === item.label ? animationData : ''" class="list-item" @tap="itemClick(item)" v-for="(item, index) in inList" :key="index">
					<image :src="item.imgSrc" mode="aspectFit"></image>
					<text>{{item.label}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import { mapGetters } from 'vuex';
	// import { getFlightStatus } from '../../common/api/dic/api.js'
	// import { ident } from "@/common/identification.js"
	export default {
		components:{
		},
		data() {
			return {
				inHeight: '',
				animationData: {},
				currenItem: null,
			  outList: [
					{label: '移动过磅', src: '/pages/departure/weight/weight', imgSrc: require('../../static/ydgb.png')},
					{label: 'ULD配载', src: '/pages/departure/uld/uld', imgSrc: require('../../static/ULD.png')},
					{label: '复称', src: '/pages/departure/reWeight/reWeight', imgSrc: require('../../static/fc.png')},
					{label: '待运区管理', src: '/pages/departure/waitingManager/waitingManager', imgSrc: require('../../static/dyq.png')},
					// {label: '运单修改', src: '/pages/departure/weight', imgSrc: require('../../static/ydxg.png')},
					// {label: '退货管理', src: '/pages/departure/weight', imgSrc: require('../../static/thgl.png')},
					{label: '库存盘点', src: '/pages/departure/stock/index', imgSrc: require('../../static/kcpd.png')},
					{label: '中转货交接', src: '/pages/departure/transfer/index', imgSrc: require('../../static/zzhjj.png')},
					{label: '航班查询', src: '/pages/departure/flight/flight', imgSrc: require('../../static/hbcx.png')}],
					/* {label: '出港交接', src: '/pages/departure/handover/handover?item=departure', imgSrc: require('../../static/zzhjj.png')},
					{label: '板斗交接', src: '/pages/departure/handover/index', imgSrc: require('../../static/zzhjj.png')}], */
				inList: [
					/* {label: '提货操作', src: '/pages/departure/weight', imgSrc: require('../../static/thcz.png')},
					{label: '异常登记', src: '/pages/arrival/abnormalRegister/index', imgSrc: require('../../static/ycdj.png')}, */
					{label: '异常登记', src: '/pages/arrival/abnormalRegister/index', imgSrc: require('../../static/ycdj.png')},
					{label: '航班动态', src: '/pages/departure/flightDynamics/index', imgSrc: require('../../static/hbdt.png')},
					{label: '航控登记', src: '/pages/arrival/controlRegister/controlRegister', imgSrc: require('../../static/hkdj.png')},
					{label: '中转货操作', src: '/pages/departure/transferOpt/index', imgSrc: require('../../static/zzhcz.png')}]
					/* {label: '转关货操作', src: '/pages/departure/weight', imgSrc: require('../../static/zghcz.png')}, */
					// {label: '进港交接', src: '/pages/departure/handover/handover?item=arrival', imgSrc: require('../../static/ydgb.png')}]
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		mounted () {
			this.$store.dispatch('GetFlightStatusInfo')
			this.$store.dispatch('GetUldType')
			/* getFlightStatus().then(res => {
				console.log(res)
			}) */
			this.$nextTick(function(){
				let view = uni.createSelectorQuery().in(this).select("#in")
				let clientHeight = uni.getSystemInfoSync().windowHeight
				let that = this
				console.log(view)
				view.boundingClientRect(data => {
					that.inHeight = clientHeight - data.top - 10
				}).exec()
			})
			
			this.currenItem = null
			this.plusReady()
			// this.height = uni.getSystemInfoSync().windowHeight
		},
		onShow () {
		},
		methods: {
			getHour () {
				let hour = dayjs().hour()
				if (hour >= 6 && hour <= 8) {
					return '早上好'
				} else if (hour > 8 && hour <= 12) {
					return '上午好'
				} else if (hour > 12 && hour <= 14) {
					return '中午好'
				} else if (hour > 14 && hour <= 18) {
					return '下午好'
				} else if (hour > 18) {
					return '晚上好'
				}
			},
			getUserName () {
				if (uni.getStorageSync('userInfo')) {
					return uni.getStorageSync('userInfo').realname
				}
				return ''
			},
			getRole () {
				if (uni.getStorageSync('userInfo')) {
					return uni.getStorageSync('userInfo').userkey
				}
				return ''
			},
			// 退出登录
			loginOut () {
				uni.showToast({
					title: '退出登录',
					duration: 1000,
					icon:'none'
				})
				uni.removeStorageSync('access_token')
				uni.reLaunch({
					url: '../login/login',
				})
			},
			itemClick (item) {
				console.log(item)
				this.currenItem = item.label
				this.animationData = {}
				let animation = uni.createAnimation({
					duration: 100,
					timingFunction: 'linear',
				})
				this.animation = animation
				animation.backgroundColor('#007AFF').step()
				// animation.opacity(0).step()
				animation.backgroundColor('#FFFFFF').step()
				this.animationData = animation.export()
				setTimeout(() => {
					uni.navigateTo({
						url: `${item.src}`
					})
					this.currenItem = ''
				}, 100)
			},
			plusReady() {
			  this.$store.dispatch('GetUserInfo')
				console.log('userInfo', this.userInfo)
			}
		}
	}
</script>

<style lang="scss">
	.main-content {
		.out {
			padding: 0upx 20upx 0upx 20upx; 
			background-color: #ffffff;
			border-radius: 5px;
			/* #ifdef MP */
			margin-top: 20upx;
			/* #endif */
			/* #ifdef APP-PLUS */
			margin-top: 30upx;
			/* #endif */
			
			.list-title {
				font-size: 32upx;
				color: #595959;
				margin-left: 3%;
				font-weight: bold;
				display: block;
				transform: translateY(20upx);
			}
			.list {
				display: flex;
				background-color: #ffffff;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 10upx; 
				.list-item {
					width: 31%;
					height: 0;
					padding-bottom: 27%;
					text-align: center;
					background-color: #ffffff;
					border: 5upx solid #F7F7F7;
					border-radius: 10upx;
					margin-top: 20upx;
					>text {
						display: block;
						color: #595959;
						font-size: 32upx;
						transform: translateY(50%);
					}
					>image {
						transform: translateY(50%);
						width: 60upx;
						height: 60upx;
					}
				}
			}
		}
		.title {
			padding: 40upx 30upx 10upx 30upx;
			display: flex;
			justify-content: space-between;
			font-weight: bold;
			.title-left {
				.top {
					display: block;
					color: #404040;
					font-size: 38upx;
				}
				.flex-title {
					display: flex;
					justify-content: flex-start;
					display: block;
					color: #8c8c8c;
					font-size: 26upx;
					.name {
						margin-left: 30upx;
					}
				}
			}
			.title-right {
				color: #262626;
				font-size: 32upx;
				background-color: #e6e6e6;
				border-radius: 30upx;
				transform: translateY(40%);
				height: 60upx;
				padding: 0upx 40upx;
				>image {
					width: 40upx;
					height: 40upx;
					margin-right: 20upx;
					transform: translateY(9upx);
				}
			}
		}
	}
	/* page {
		background-color: #007AFF;
	} */
</style>
