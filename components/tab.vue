<template>
	<view  :class="{'uni-scroll-tab': scroll === true }" class="uni-tab">
		<view
		v-for="(tab,index) in tabList" :key="index" 
		:class="{ 'uni-tab-active': index === value, 'uni-tab-scroll-item': scroll === true, ' uni-tab-scroll-active': index === value && scroll === true }"
		:style="[{color:index === value ? activeColor : defaultColor,backgroundColor: bgColor}]"
		@tap="itemClick(index,tab)"
		class="uni-tab-item">
			<view class="item-text">{{rangeKey == '' ? tab : tab[rangeKey]}}</view>
			<!-- <view class="p-box" v-show="filterIndex && filterIndex === index">
				<text :class="{active: order}" @click="orderChange()" class="yticon icon-shang"></text>
				<text :class="{active: !order}" @click="orderChange()" class="yticon icon-shang xia"></text>
			</view> -->
		</view>
		<view v-if="!scroll" :style="[{ right: barRight + '%', left : barLeft + '%', borderColor: activeColor }]" class="uni-tab-bar" :class="back ? 'uni-tab-bar-backward' : 'uni-tab-bar-forward'"></view>
	</view>
</template>
<script>
	export default {
		name: 'uni-tab',
		data() {
			return {
				order: '',
				// average: 0,
				back: false
			};
		},
		props: {
			value: {
				type: Number, //当前选中下标
				default: null
			},
			filterIndex: {
				type: Number, //当前选中下标
				default: null
			},
			tabList: {
				type: Array,
				default () {
					return [];
				}
			},
			bgColor: { //背景颜色
				type: String,
				default () {
					return '#FFFFFF';
				}
			},
			defaultColor: { //默认未选中文字颜色
				type: String,
				default () {
					return '#000000';
				}
			},
			activeColor: { //选中时文字颜色 线条颜色
				type: String,
				default () {
					return '#0ebf9c';
				}
			},
			rangeKey: { // 当tabList为对象时 显示指定下标值
				type: String,
				default () {
					return '';
				}
			},
			scroll: { //横向滑动
				type: Boolean,
				default () {
					return false;
				}
			},
		},
		computed:{
			average () {
				return this.tabList ? (100 / this.tabList.length) : 0;
			},
			barLeft () {
				return this.value * this.average;
			},
			barRight () {
				let index = this.tabList.length - this.value - 1;
				return index * this.average;
			},
		},
		// created() {
		// 	this.average = 
		// },
		methods: {
			orderChange () {
				this.order = !this.order
				this.$emit('orderChange', this.order)
			}
			,
			itemClick(index,tab){
				// this.value = index
				this.$emit('change',{tab:index});
			}
		}
	};
</script>
<style lang="scss" scoped>
.uni-tab{
	position: relative;
	display: flex;
	font-size: 14upx;
	height: 110upx;
	line-height: 110upx;
	background-color: #fff;
	.p-box{
		display: flex;
		flex-direction: column;
		margin-top: 30upx;
		// height:30upx;
		// position: relative;
		// top: 25upx;
		.yticon{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30upx;
			height: 14upx;
			line-height: 1;
			margin-left: 4upx;
			font-size: 26upx;
			
			color: #888;
			&.active{
				color: #0ebf9c;
			}
		}
		.xia{
			transform: scaleY(-1);
		}
	}
	.uni-tab-item{
		flex: 1;
		height: 100%;
		text-align: center;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		justify-content: center;
	}
	.item-text {
		font-size: 32upx;
		transform: translateY(30upx);
	}
	.uni-tab-scroll-item{
		flex: none;
		padding: 0px 12px;
	}
	.uni-tab-active{
		color: #1e9fff;
	}
	.uni-tab-scroll-active{
		border-bottom: 3px solid #1e9fff;
	}
	.uni-tab-bar{
		display: block;
		height: 3px;
		position: absolute;
		bottom: 0;
		border-bottom: 3px solid #1e9fff;
	}
	.uni-tab-bar-forward{
		transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1), left 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s;
	}
	.uni-tab-bar-backward{
		transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1);
	}
}
.uni-scroll-tab{
	overflow-x: scroll;
}
</style>
<!-- 说明
例： <tab :value.sync="index" :filterIndex="2" :tabList="tabList" @orderChange="orderChange" @change="tabChange"></tab>
属性名	类型	默认值	说明
value	Number	0	默认下标(双向绑定)
tabList	Array	[]	可以是一维数组或是数组对象
bgColor	String	#FFFFFF	背景颜色
defaultColor	String	#000000	默认未选中文字颜色
activeColor	String	#1e9fff	选中时文字颜色 线条颜色
scroll	Boolean	false	横向滑动
rangeKey	String	''	当tabList为数组对象时指定显示对象key
event
事件名	说明
change	点击事件时触发,返回对应数据 -->
