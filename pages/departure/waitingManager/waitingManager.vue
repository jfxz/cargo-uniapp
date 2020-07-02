<template>
  <view class="waiting">
    <headBar name="出港待运区管理"></headBar>
    <msg-tip ref="toast"></msg-tip>
    <view class="content-top">
      <view class="head-input">
        <text class="lableWidth">ULD号</text>
        <input @blur="getflight" @input="uldTypeChange" @focus="uldTypeFocus" class="uld-input" v-model="form.uldType" />
        <input @blur="getflight" @input="uldNoChange" @focus="uldNoFocus" class="uld-input" style="margin-left: 0;border-left: 0;"
          v-model="form.uldNo" />
        <input @blur="getflight" class="uld-input" style="margin-left: 0;border-left: 0;" v-model="form.uldNoSuffix" />
      </view>
      <view class="row">
        <text class="lableWidth">预配航班</text>
        <input class="uld-input disable" disabled="true" v-model="form.preplanCarrier" />
        <input class="uld-input disable" disabled="true" style="margin-left: 0;border-left: 0;" v-model="form.preplanFlight" />
      </view>
      <view class="row">
        <text class="lableWidth">实配航班</text>
        <input class="uld-input disable" disabled="true" v-model="form.actualCarrier" />
        <input class="uld-input disable" disabled="true" style="margin-left: 0;border-left: 0;" v-model="form.actualFlight" />
      </view>
      <view class="row">
        <text class="lableWidth2">待运区位置</text>
        <picker @change="positionChange" :range="numArray" range-key="TYPENAME">
          <view class="pick-text">
            <span>{{form.waitLocation}}</span>
            <!-- <span v-if="numArray[index]">{{numArray[index].TYPECODE}}222</span> -->
          </view>
        </picker>
      </view>
    </view>
    <view class="content-middle">
      <view class="date-top">
        <text>复称时间段</text>
      </view>
      <view class="flex">
        <text class="circle">从</text>
        <view @click="dateShow('start')" class="flex-date">
          <text class="date">{{form.reFrom}}</text>
        </view>
      </view>
      <view class="flex">
        <text class="circle" style="background: #fdb332;">到</text>
        <view @click="dateShow('end')" class="flex-date">
          <text class="date">{{form.reEnd}}</text>
        </view>
      </view>
    </view>
    <view class="btn">
      <button type="primary" plain="true" @click="reset">重置</button>
      <button type="primary" plain="true" @click="getData">查询</button>
    </view>
    <view class="load-progress" :class="loadProgress!=0?'show':'hide'" :style="[{top:CustomBar+'px'}]">
      <view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-loadProgress) + '%, 0px, 0px)'}]"></view>
      <view class="load-progress-spinner text-green"></view>
    </view>
    <tui-datetime ref="dateTime" :type="1" cancelColor="#888" color="#5677fc" :setDateTime="setDateTime" @confirm="dateChange"></tui-datetime>
  </view>
</template>

<script>
  import msgTip from '@/components/tip/tip.vue'
  import dayjs from '@/common/util/dayjs.min.js'
  import {
    deepCopy,
    isEmpty
  } from '@/common/util/util.js'
  import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
  import {
    getFlight,
    getUldLoad,
    getLocation,
    checkUld
  } from '@/common/api/departure/waitingManager/waitingManager.js'
  import tuiDatetime from "@/components/dateTime/dateTime"
  export default {
    components: {
      tuiDatetime,
      headBar,
      msgTip
    },
    data() {
      return {
        index: -1,
        flag: '',
        setDateTime: dayjs().format('YYYY-MM-DD HH:mm'),
        CustomBar: this.CustomBar,
        loadProgress: 0,
        numArray: [],
        form: {
          uldType: 'CAR',
          uldNo: '',
          uldNoSuffix: 'GN',
          preplanCarrier: '',
          preplanFlight: '',
          actualCarrier: '',
          actualFlight: '',
          waitLocation: '',
          reFrom: '',
          reEnd: ''
        }
      }
    },
    computed: {},
    watch: {
      'form.uldType'(newVal, oldVal) {
        if (newVal) {
          this.form.uldType = newVal.toUpperCase()
        }
      },
      'form.uldNo'(newVal, oldVal) {
        if (newVal) {
          this.form.uldNo = newVal.toUpperCase()
        }
      },
      'form.uldNoSuffix'(newVal, oldVal) {
        if (newVal) {
          this.form.uldNoSuffix = newVal.toUpperCase()
        }
      }
    },
    onLoad: function () {
      this.getLocate()
    },
    methods: {
      uldTypeFocus() {
        this.form.uldType = ''
      },
      uldTypeChange(val) {
        console.log('type', val.detail.value)
        if (val.detail.value.length === 6 || val.detail.value.length === 7) {
          this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
          this.form.uldNo = val.detail.value.substring(3, val.detail.value.length)
          this.form.uldSubPrefix = 'GN'
        } else if (val.detail.value.length >= 8) {
          this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
          this.form.uldNo = val.detail.value.substring(3, val.detail.value.length - 2)
          this.form.uldSubPrefix = (val.detail.value.substring(val.detail.value.length - 2, val.detail.value.length)).toLocaleUpperCase()
        }
        console.log('type', this.form.uldType, 'uldNo', this.form.uldNo, 'uldSubPrefix', this.form.uldSubPrefix)
      },
      uldNoFocus() {
        this.form.uldNo = ''
      },
      uldNoChange(val) {
        console.log(val.detail.value, val.detail.value.length)
        if (val.detail.value.length === 6 || val.detail.value.length === 7) {
          this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
          this.form.uldNo = val.detail.value.substring(3, val.detail.value.length)
          this.form.uldSubPrefix = 'GN'
        } else if (val.detail.value.length >= 8) {
          this.form.uldType = (val.detail.value.substring(0, 3)).toLocaleUpperCase()
          this.form.uldNo = val.detail.value.substring(3, val.detail.value.length - 2)
          this.form.uldSubPrefix = (val.detail.value.substring(val.detail.value.length - 2, val.detail.value.length)).toLocaleUpperCase()
        } else {
          this.form.uldNo = val.detail.value
        }
        console.log('type', this.form.uldType, 'uldNo', this.form.uldNo, 'uldSubPrefix', this.form.uldSubPrefix)
      },
      getLocate() {
        getLocation().then(res => {
          this.numArray = res.data
        })
      },
      getflight() {
        if (this.form.uldType && this.form.uldNo && this.form.uldNoSuffix) {
          getFlight(this.form).then(res => {
            if (res.status && res.data.flightIdPre) {
              this.form.preplanCarrier = res.data.flightIdPre.carrier
              this.form.preplanFlight = res.data.flightIdPre.flight
              this.form.actualCarrier = res.data.flightId.carrier
              this.form.actualFlight = res.data.flightId.flight
            } else {
              let message = res.message
              let options = {
                msg: message,
                duration: 2000,
                type: 'green'
              }
              this.$refs.toast.showTips(options);
            }
          })
          checkUld(this.form).then(res => {
            if (res.status) {} else {
              let message = res.message
              let options = {
                msg: message,
                duration: 2000,
                type: 'green'
              }
              this.$refs.toast.showTips(options)
            }
          })
        }
      },
      dateShow(flag) {
        if (flag === 'start') {
          this.flag = 'start'
        } else {
          this.flag = 'end'
        }
        this.$refs.dateTime.show()
      },
      dateChange(val) {
        console.log(val)
        if (this.flag === 'start') {
          this.form.reFrom = val.result
        } else {
          this.form.reEnd = val.result
        }
        console.log(this.form.reFrom)
        this.setDateTime = val.result
      },
      positionChange(val) {
        this.form.waitLocation = this.numArray[val.detail.value].TYPECODE
        this.index = val.detail.value
      },
      reset() {
        this.form = {
          uldType: 'CAR',
          uldNo: '',
          uldNoSuffix: 'GN',
          preplanCarrier: '',
          preplanFlight: '',
          actualCarrier: '',
          actualFlight: '',
          waitLocation: '',
          reFrom: '',
          reEnd: ''
        }
      },
      getData() {
        // uld一栏全为空，不传输uld号
        // uld一栏仅中间(no)为空（即未进行修改），不传输uld号
        // uld一栏全不为空，正确，传输uld号
        if ((!isEmpty(this.form.uldType) && !isEmpty(this.form.uldNoSuffix)) || (isEmpty(this.form.uldNo) && isEmpty(
            this.form.uldType) && isEmpty(this.form.uldNoSuffix))) {
          let date = deepCopy(this.form)
          // uld一栏仅中间(no)为空（即未进行修改），不传输uld号
          if (isEmpty(this.form.uldNo)) {
            date.uldType = ''
            date.uldNoSuffix = ''
          }
          if (date.reEnd !== '') {
            date.reEnd = dayjs(date.reEnd).valueOf()
          }
          if (date.reFrom !== '') {
            date.reFrom = dayjs(date.reFrom).valueOf()
          }
          uni.navigateTo({
            url: `/pages/departure/waitingManager/uldWaiting?item=` + encodeURIComponent(JSON.stringify(date))
          })
        } else {
          let options = {
            msg: 'ULD号未填写完整',
            duration: 2000,
            type: 'green'
          }
          this.$refs.toast.showTips(options)
        }
      }
    }
  }
</script>

<style lang="scss">
  page {
    padding-top: 140upx;
  }

  .waiting {
    .lableWidth {
      width: 170upx;
      height: 80upx;
      text-align: right;
      line-height: 80upx;
      padding: 0 0 0 30upx;
      margin-right: 30upx;
      font-size: 35upx;
    }

    .disable {
      background: #999999;
    }

    .lableWidth2 {
      width: 230upx;
      text-align: center;
      height: 80upx;
      line-height: 80upx;
      font-size: 35upx;
    }

    .content-top {
      display: flex;
      font-size: 35upx;
      background: #ffffff;
      flex-direction: column;
      margin-top: 10upx;
      color: #595959;
      padding: 30upx 0;
      border: solid 2upx #e5e5e5;

      .head-input {
        display: flex;
        flex-wrap: wrap;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20upx;

        .uld-input {
          font-size: 35upx;
          text-align: center;
          border: solid 3upx #dbdbdb;
          width: 235upx;
          height: 80upx;
        }

        .pick-text {
          font-size: 35upx;
          text-align: center;
          line-height: 80upx;
          border: solid 3upx #dbdbdb;
          width: 467upx;
          height: 80upx;
        }
      }

      .uld-input {
        font-size: 35upx;
        text-align: center;
        border: solid 3upx #dbdbdb;
        width: 157upx;
        height: 80upx;
      }
    }

    .content-middle {
      margin-top: 30upx;
      display: flex;
      flex-direction: column;
      font-size: 35upx;
      background: #ffffff;

      .flex {
        display: flex;
        flex-direction: row;
        margin-top: 30upx;
        padding-bottom: 30upx;
        padding-left: 30upx;
        border-bottom: solid 3upx #dbdbdb;

        .flex-date {
          width: 70%;

          .date {
            margin-left: 30upx;
            font-size: 35upx;
          }
        }

        .circle {
          width: 50upx;
          height: 50upx;
          text-align: center;
          line-height: 50upx;
          font-size: 35upx;
          background: #0ebf9c;
          color: #FFFFFF;
        }

        text {
          font-size: 35upx;
        }
      }

      .date-top {
        font-size: 35upx;
        border: solid 2upx #e5e5e5;
        padding-left: 30upx;
        height: 100upx;
        line-height: 100upx;
      }
    }

    .btn {
      display: flex;
      flex-direction: row;
      margin-top: 60upx;

      button {
        width: 42%;
        color: #0ebf9c;
        font-size: 35upx;
        border: 1px solid #0ebf9c
      }
    }
  }
</style>
