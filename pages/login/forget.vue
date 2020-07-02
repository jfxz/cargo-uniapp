<template>
	<view class="forget">
		<view class="status_bar">
				<!-- 这里是状态栏 -->
		</view>
		<view class="content">
			<view class="forget_bar" @tap="back">
				<image @tap="back" class="image-nav" :src="require('../../static/back.png')" mode="aspectFit"></image>
				<text @tap="back">返回</text>
			<slot/></view>
			<!-- 主体 -->
			<view class="main">
				<!-- <view class="tips">若你忘记了密码，可在此重置新密码。</view> -->
				<wInput
					v-model="telPhoneNo"
					type="phone"
					maxlength="11"
					placeholder="请输入手机号码"
				></wInput>
				<wInput
					v-model="verCode"
					placeholder="验证码"
					
					isShowCode
					codeText="获取验证码"
					setTime="60"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
				<wInput
					v-model="newPass"
					type="password"
					maxlength="11"
					placeholder="请输入新密码"
					
				></wInput>
				<wInput
					v-model="surePass"
					type="password"
					maxlength="11"
					placeholder="请再次输入新密码"
					
				></wInput>
			</view>
			
			<wButton 
				text="确认修改"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import {sendSms, editPwd} from '@/common/api/login/api.js'
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
				telPhoneNo: "", //电话
				newPass: "", //密码
				surePass: '',
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
			back () {
				uni.navigateBack({
					animationType: 'slide-out-right',
					animationDuration: 200
				})
			},
			getVerCode(){
				//获取验证码
				if (_this.telPhoneNo.length != 11) {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号格式不正确'
				    });
				    return false;
				}
				let para  = {
					telPhoneNo: this.telPhoneNo,
					moduleName: 'forgotPassword'
				}
				sendSms(para).then(res => {
					if (res.status) {
						this.$message('发送验证码中')
					} else {
						this.$message(res.message)
					}
				})
				console.log("获取验证码")
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				
				setTimeout(function(){
					_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
				},60000)
			},
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.telPhoneNo.length != 11) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号格式不正确'
				    });
				    return false;
				}
			    if (this.newPass.length === 0) {
			        uni.showToast({
			            icon: 'none',
									position: 'bottom',
			            title: '密码不能为空'
			        });
			        return false;
			    }
					if (this.newPass !== this.surePass) {
						uni.showToast({
						    icon: 'none',
								position: 'bottom',
						    title: '两次输入的密码不一致'
						});
						return false;
					}
				
				_this.isRotate=true
				let para = {
					password: this.newPass,
					telPhoneNo: this.telPhoneNo,
					validCode: this.verCode,
					moduleName: 'forgotPassword'
				}
				editPwd(para).then(res => {
					if (res.status) {
						this.$message(res.message)
						_this.isRotate=false
						uni.navigateBack({
							animationType: 'slide-out-right',
							animationDuration: 200
						})
					} else {
						this.$message(res.message)
						_this.isRotate=false
					}
				})
				
			}
		}
	}
</script>

<style lang="scss">
	@import url("../../components/watch-login/css/icon.css");
	@import url("../../components/watch-login/css/main.css");
	.forget_bar {
		padding: 0 20upx;
		>image {
			width: 40upx;
			height: 40upx;
		}
		>text {
			font-size: 40upx;
			position: relative;
			bottom: 4upx;
		}
	},
	page {
		margin-top: 30upx;
	}
</style>

