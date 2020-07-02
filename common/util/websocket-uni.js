(function () {
    uni.webSocketBackup = WebSocket;
    WebSocket = function (uri) {
        this.uri = uri;
        uni.connectSocket({
            url: uri
        });
        this.eventMap = {};
        var that = this;
        uni.onSocketOpen(function () {
            // console.log('uni:: ws open');
            if (that.eventMap.hasOwnProperty('open')) {
                that.eventMap['open']();
            } else {
                that.onopen();
            }
        });
        uni.onSocketMessage(function (res) {
            // console.log('uni:: ws message:: ', res);
            if (that.eventMap.hasOwnProperty('message')) {
                that.eventMap['message'](res);
            } else {
                that.onmessage(res);
            }
        });
        uni.onSocketClose(function () {
            console.log('uni:: ws close');
            
        });
        uni.onSocketError(function (res) {
            console.log('uni:: ws error', res);
						that.onerror(res)
						// this.$message('连接mq失败！请检查网络设置')
      //       if (that.eventMap.hasOwnProperty('error')) {
      //           that.eventMap['error'](res);
      //       } else {
      //           that.onerror(res);
      //       }
        });
    };

    var event = {};

    WebSocket.prototype = {
        addEventListener: function (event, callback) {
            this.eventMap[event] = callback;
        },
        onopen: function () {

        },
        onmessage: function (res) {
            console.log('default 实现:: ' + res)
        },
        onclose: function () {

        },
        onerror: function (res) {
					uni.$emit('connectFail')
					// uni.showToast({
					//     title: '连接mq失败',
					//     duration: 2000,
					// 		icon: 'none'
					// })
        },
        send: function (data) {
            uni.sendSocketMessage({
                data: data
            });
        }
    };

    if (typeof exports !== "undefined" && exports !== null) {
        exports.WebSocket = WebSocket;
    }

}).call(this);