export function ident () {
	// #ifdef APP-PLUS
	if (!plus.fingerprint.isSupport()) {
		this.result = '此设备不支持指纹识别';
		this.disabled = true;
	}
	else if (!plus.fingerprint.isKeyguardSecure()) {
		this.result = '此设备未设置密码锁屏，无法使用指纹识别';
		this.disabled = true;
	}
	else if (!plus.fingerprint.isEnrolledFingerprints()) {
		this.result = '此设备未录入指纹，请到设置中开启';
		this.disabled = true;
	}
	plus.fingerprint.authenticate(function() {
		plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
		plus.nativeUI.alert('指纹识别成功');
		uni.switchTab({
			url: '../home/index'
		})
	}, function(e) {
		switch (e.code) {
			case e.AUTHENTICATE_MISMATCH:
				plus.nativeUI.toast('指纹匹配失败，请重新输入');
				break;
			case e.AUTHENTICATE_OVERLIMIT:
				plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
				plus.nativeUI.alert('指纹识别失败次数超出限制，请使用其它方式进行认证');
				break;
			case e.CANCEL:
				plus.nativeUI.toast('已取消识别');
				break;
			default:
				plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
				plus.nativeUI.alert('指纹识别失败，请重试');
				break;
		}
	});
	// Android平台手动弹出等待提示框 
	if ('Android' == plus.os.name) {
		plus.nativeUI.showWaiting('指纹识别中...').onclose = function(){
			plus.fingerprint.cancel();
		}
	}
	// #endif
	// #ifdef MP-WEIXIN
	if (wx.canIUse('checkIsSupportSoterAuthentication')) {
		 wx.checkIsSupportSoterAuthentication({ success(res) 
			 {
				wx.checkIsSoterEnrolledInDevice({
					checkAuthMode: 'fingerPrint',   //这是根据上一步得知，我手机支持指纹。
					success(res) {
						if (res.isEnrolled) {
							wx.startSoterAuthentication({
								 requestAuthModes: ['fingerPrint'],
								 challenge: '123456',
								 authContent: '请用指纹解锁',
								 success(res) {
									 console.log(123, res)
									 uni.showToast({
										icon: 'success',
									 	title: '验证通过',
									 	duration: 2000
									 })
									 uni.switchTab({
									 	url: '../home/index'
									 })
								 },				 
								 fail(res) {
									 uni.showToast({
										icon: 'none',
									 	title: '验证失败',
									 	duration: 2000
									 })
								 }
							})
						}
					}
				})
			 }
		 })
	} else {
		uni.showToast({
			title: '当前该设备不支持指纹识别',
			duration: 2000
		})
	}
	// #endif
}