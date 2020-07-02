<!--
*  日期:     2019年11月7日 黄泽雨
*  界面名称: 远程搜索输入框，带下拉选项
*  界面功能: 输入进行远程搜索，选中后会返回所选对象
*  其他:     插件下载地址：https://ext.dcloud.net.cn/plugin?id=832
*            对于原组件进行了些许修改，增加了修改input框样式的功能
-->
<template>
	<view class="bjx-inputs" :style="getStyle">
		<view class="bjx-background" @tap="isShow=false" v-show="isShow"></view>
		<view class="bjx-con">
			<slot name='left'></slot>
			<input :disabled="theDisabled" :placeholder="placeholder" v-model="theValue" @input="theInput" @tap='isShow=data.length' @focus="theFocus" @blur="theBlur" autocomplete="off" :style="theStyle"/>
			<slot name='right'></slot>
		</view>
		<view class="bjx-select" v-show="show">
			<view class="data">
				<view class="select-item" :class="'item-'+overflow" v-for="(item, index) in data" :key="index"  @tap="selectItem(item,index)">
					<view class="item-text" :class="{active: getItem(item) == theValue}">{{getItem(item)}}{{getItemDes(item)}}</view>
				</view>
			</view>
			<view class="item-close" @tap="isShow=false">收起</view>
		</view>
	</view>
</template>

<script>
	let fontUnit = 'upx'
	// #ifdef MP-WEIXIN
	fontUnit = 'rpx'
	// #endif
	export default {
		name: 'BjxInputs',
		props: {
			placeholder: {
				type: String,
				default: ''
			},
			value: {
				type: String,
				default: ''
			},
			itemKey: {
				type: String,
				default: ''
			},
      itemDesKey: {
        type: String,
        default: ''
      },
			width: {
				type: String,
				default: '600'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			timeDelay: {
				type: Number,
				default: 60
			},
			theStyle: {
				type: String,
				default: ''
			},
			overflow: {
				type: String,
				default: 'auto'
			},
		},
		data() {
			return {
				timer: null,
				data: [],
				isShow: false,
				theValue: this.value,
				theDisabled: this.disabled,
			}
		},
		watch: {
			value(val){
				this.theValue = val
			}
		},
		computed: {
			show(){
				return this.isShow && this.data.length
			},
			getStyle(){
				let style = this.theStyle.replace(/upx/g,fontUnit)
				let width = 'width:' + (!isNaN(Number(this.width)) ? this.width + fontUnit : this.width) + ';'
				return style + width
			},
		},
		methods: {
			showItem(){
				this.isShow = this.data.length > 0
			},
			theFocus(e){
				this.$emit('focus',e)
			},
			theBlur(e){
				this.$emit('blur',e)
			},
			theInput(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.$emit('list',{value: e.detail.value,callback: this.setData})
				},this.timeDelay)
			},
			getItem(item) {
				return this.itemKey && typeof item == 'object' ? item[this.itemKey] : item
			},
      getItemDes(item) {
        if (this.itemDesKey === '') {
          // 如果itemDesKey为默认值，则不显示内容
          return ''
        }
        let ans = this.itemDesKey && typeof item == 'object' ? item[this.itemDesKey] : item
        if (ans) {
          return `(${ans})`
        } else {
          return ''
        }
      },
			selectItem(item) {
				this.isShow = false
				this.theValue = this.itemKey ? item[this.itemKey] : item
				this.$emit('select',item)
			},
			setData(data) {
				if(data) {
					this.isShow = true
					this.data = data
				}
			},
			setValue(value){
				this.theValue = value
			},
			setDisabled(value){
				this.theDisabled = value
			},
		},
	}
</script>

<style lang="scss" scoped>
.bjx-inputs{
	max-width: 100%;
	position: relative;
	.bjx-background{position: fixed;top:0;left:0;width: 750upx;height: 100%;}
	.bjx-con{display: flex;align-items: center;justify-content: center;
		input{flex: 1;margin: 0 6upx;}
	}
	.bjx-select {
		border: 1px solid #f3f3f4;
		position: absolute;
		z-index: 999;
		background: #fff;
		width: 100%;
		.data{
			max-height: 600upx;
			padding: 10upx;
			overflow: auto;
			.select-item {width: 100%;
				.item-text{padding: 10upx 0; font-size: 32upx;}
				.active{font-weight: bold;}
			}
			.item-auto{overflow: auto;
				.item-text{width: max-content;}
			}
			.item-hide .item-text{
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
		.item-close {
			padding: 20upx;
			text-align: center;
			font-size: 32upx;
			border-top: 1px solid #f3f3f4;
			color:#8F8F94;
		}
	}
}
</style>