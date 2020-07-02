<template>
	<view class="radio" :class="{'radio-width-default':widthDefault}" :style="checked?activeStyle :itemStyle" @click="handleChange">
		{{name}}
	</view>
</template>

<script>
	
	/**
 * 防抖
 * @param {*} fun 
 * @param {*} delay 
 * @param {*} immediate 
 */
const debounce = function (fun, delay, immediate) {
  var timer, lasttime, context, arg
  var later = function () {
    var now = new Date().getTime(),
      l = now - lasttime
    if (l < delay && l >= 0) {
      clearTimeout(timer)
      timer = setTimeout(later, delay - l)
    } else {
      clearTimeout(timer)
      timer = null
      if (!immediate) {
        fun.apply(context, arg)
        if (!timer) context = arg = null
      }
    }
  }
  return function () {
    context = this
    arg = arguments
    lasttime = new Date().getTime()
    var callNow = immediate && !timer
    if (!timer) timer=setTimeout(later, delay)
    if (callNow) {
      fun.apply(context, arg)
      context = arg = null
    }
  }
}
	export default {
		props: {
			name: {
				type: String,
				default: ''
			},
			value: {
				default: null,
			},
			checked: {
				type: [Boolean, Number],
				default: false
			},
			sty: {
			  type: String,
			  default: 'width:250upx'
			}
		},
		computed: {
			widthDefault() {
				return this.name.length <= 3
			},
			activeStyle() {
				let Style = 'background: #ffffff;color: #0ebf9c; border:1px solid #0ebf9c;'
				return Style
				// return `background: #d5e4fd;color: #3c7ef6;border-color: #3c7ef6;`
			},
			itemStyle() {
				let Style = 'background: #ffffff;color: #595959; border:1px solid #dbdbdb;'
				return Style
				// return `background: #f7f7f7;color: #7d7d7d;`
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleChange: debounce(handleChange, 200,true)
		}
	}

	function handleChange() {
		this.$emit('change', this.value)
	}
</script>

<style>
	.radio {
		display: inline-block;
		width: 255upx;
		height: 90upx; 
		line-height: 90upx;
		padding: 0 0upx;
		border-radius: 10upx;
		font-size: 35upx;
		box-sizing: border-box;
		border:1px solid #dbdbdb;
		/* border: 1px solid #c3c3c3; */
	}

	.radio:not(:last-child) {
		margin: 0 0upx 0upx 0;
	}

	.radio-width-default {
		width: 255upx;
		text-align: center;
		padding: 0;
	}
</style>
