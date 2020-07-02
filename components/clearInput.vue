<template>
	<view class="clearInput">
		<input :type="type" @input="change" @blur="blur" @focus="focus" :focus="focus2" :disabled="disabled" :value="value" :placeholder="placeholder"/>
		<icon type="clear" v-if="value" @tap="clear"/>
	</view>
</template>

<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: () => ''
			},
			focus2: {
				type: Boolean,
				default: () => false
			},
			value: {
				type: String,
				default: () => ''
			},
			disabled: {
				type: Boolean,
				default: () => false
			},
			type: {
				type: String,
				default: () => ''
			}
		},
		methods: {
			blur () {
				this.$emit('blur')
			},
			focus () {
				this.$emit('focus')
			},
			change (val) {
				this.$emit('input', val)
			},
			clear () {
				if (!this.disabled) {
					this.$emit('clear')
				}
			}
		}
	}
</script>

<style lang="scss">
	.clearInput {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		// padding-right: 20upx;
		icon {
			z-index: 999;
			// display: initial;
			position: absolute;
			right: 0;
			/* #ifdef APP-PLUS */
			top: 50%;
			transform: translateY(-50%);
			/* #endif */
		}
		input {
			width: 100%;
			// height: 100%;
			// line-height: 100%;
		}
	}
</style>
