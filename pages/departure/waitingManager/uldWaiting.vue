<template>
  <view class="uldWaiting">
    <headBar name="ULD待运区位管理"></headBar>
    <msg-tip ref="toast"></msg-tip>
    <view class="top">
      <view class="btn">
        <button plain="true" style="color:#FFFFFF;background: #0ebf9c;border: #0ebf9c;width: 35%;" @click="add">+ 新增</button>
        <button plain="true" style="color:#0ebf9c;background: color:#FFFFFF;border: solid 1px #0ebf9c;width: 20%;margin-right: 0px;"
          @click="update">编辑</button>
        <button plain="true" style="background: color:#FFFFFF; border: solid 2px #d9d9d9;width: 20%;" @click="Delete">删除</button>
      </view>
      <view class="text">
        <text class="circle">{{'i'}}</text>
        <text>{{text1}}</text>
        <text style="color: #0ebf9c;">{{number}}</text>
        <text>{{text2}}</text>
      </view>
    </view>
    <view class="bottom">
      <view class="left">
        <view class="head">
          <checkbox-group @change="ChangeAll">
            <checkbox :value="checkAll" :checked="checkAll" />
          </checkbox-group>
        </view>
        <checkbox-group @change="checkboxChange">
          <label class="item-list" v-for="item in items" :key="item.id">
            <checkbox :value="item.id" class="check" :checked="item.checked" />
          </label>
        </checkbox-group>
      </view>
      <view class="right">
        <view class="head">
          <!-- <checkbox-group @change="ChangeAll" style="width:90rpx;">
						<checkbox :value="checkAll" :checked="checkAll" class="check"/>
					</checkbox-group> -->
          <text style="width:220rpx;">ULD号</text>
          <text style="width:200rpx;">预配航班</text>
          <text style="width:200rpx;">实配航班</text>
          <text style="width:200rpx;">待运区位置</text>
          <text style="width:350rpx;">复称时间</text>
          <text style="width:150rpx;">整车体积</text>
          <text style="width:150rpx;">差异额</text>
          <text style="width:150rpx;">差异率</text>
        </view>
        <checkbox-group @change="checkboxChange">
          <label class="item-list" v-for="item in items" :key="item.id">
            <!-- <checkbox :value="item.id" class="check" :checked="item.checked" /> -->
            <text style="width: 220rpx">{{item.uldType + item.uldNo + item.uldNoSuffix || ''}}</text>
            <text style="width: 200rpx">{{item.preCarrier + item.preFlight || ''}}</text>
            <text style="width: 200rpx">{{item.carrier + item.flight || ''}}</text>
            <text style="width: 200rpx">{{findLocation(item.waitLocation) || ''}}</text>
            <text style="width: 350rpx">{{format(item.reweighTime) || ''}}</text>
            <text style="width: 150rpx">{{item.uldVol || ''}}</text>
            <text style="width: 150rpx">{{item.wgtDiff || ''}}</text>
            <text style="width: 150rpx">{{getPercentString(item.diffRate) || ''}}</text>
          </label>
        </checkbox-group>
      </view>
    </view>
    <tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="是否删除?"></tui-modal>
  </view>
</template>

<script>
  import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
  import msgTip from '@/components/tip/tip.vue'
  import dayjs from '@/common/util/dayjs.min.js'
  import {
    getUldLoad,
    deleteUld,
    getLocation
  } from '@/common/api/departure/waitingManager/waitingManager.js'
  import tuiModal from "@/components/modal"
  export default {
    components: {
      headBar,
      tuiModal,
      msgTip
    },
    data() {
      return {
        modal: false,
        param: null,
        numArray: [],
        checkAll: false,
        selectArray: [],
        number: 0,
        rowSelected: null,
        text1: '已选择',
        text2: '项。可以批量操作删除。每次只能编辑一条信息',
        items: [
          // { uldNum: '12345678', num: 3896, weight: 'XMN_CKG', volume: '10:06',checked: false },
          // { uldNum: '21234568', num: 2, weight: 241, volume: 150, checked: false },
          // { uldNum: '96587412', num: 2, weight: 241, volume: 150, checked: false },
          // { uldNum: '36985214', num: 2, weight: 241, volume: 150, checked: false },
          // { uldNum: '96587423', num: 2, weight: 241, volume: 150, checked: false },
          // { uldNum: '25369874', num: 2, weight: 241, volume: 150, checked: false }
        ]
      }
    },
    onLoad: function (option) {
      const item = JSON.parse(decodeURIComponent(option.item))
      this.param = item
      this.getData()
      this.getLocate()
    },
    onShow() {
      this.number = 0
      this.checkAll = false
      this.getData()
    },
    computed: {},
    methods: {
      // 获得百分数
      getPercentString(val) {
        if (val) {
          return (val * 100).toFixed(2).toString() + '%'
        }
        return null
      },
      format(val) {
        if (val !== null && val !== '') {
          return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      getLocate() {
        getLocation().then(res => {
          console.log('getLocation');
          console.log(res.data);
          this.numArray = res.data
          console.log('赋值结束');
        })
      },
      findLocation(item) {
        for (let i = 0; i < this.numArray.length; i++) {
          if (item === this.numArray[i].TYPECODE) {
            return this.numArray[i].TYPENAME
          }
        }
      },
      ChangeAll: function (e) {
        var values = e.detail.value;
        this.selectArray = []
        if (values.includes('false')) {
          this.items.forEach(item => {
            this.selectArray.push(item.id)
            item.checked = true
          })
          this.number = this.items.length
        } else {
          this.items.forEach(item => {
            item.checked = false
          })
          this.selectArray = []
          this.number = 0
        }
      },
      checkboxChange: function (e) {
        var items = this.items,
          values = e.detail.value;
        this.number = e.detail.value.length
        if (this.number === 0) {
          this.checkAll = false
        }
        if (this.number === this.items.length) {
          this.checkAll = true
        }
        this.selectArray = []
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          if (values.includes(item.id)) {
            this.rowSelected = item
            this.selectArray.push(item.id)
            this.$set(item, 'checked', true)
          } else {
            this.$set(item, 'checked', false)
          }
        }
      },
      add() {
        uni.navigateTo({
          url: `/pages/departure/waitingManager/uldPosition?title=ULD待运区位新增&upateFlag=false&item=` +
            encodeURIComponent(JSON.stringify(''))
        })
      },
      update() {
        if (this.number === 1) {
          uni.navigateTo({
            url: `/pages/departure/waitingManager/uldPosition?title=ULD待运区位编辑&upateFlag=true&item=` +
              encodeURIComponent(JSON.stringify(this.rowSelected))
          })
        }
      },
      Delete() {
        console.log(this.selectArray)
        if (this.number > 0) {
          this.modal = true
        }
      },
      hide() {
        this.modal = false
      },
      handleClick(e) {
        let index = e.index
        if (index === 0) {
          this.modal = false
        } else {
          console.log('这个是选中的array');
          console.log(this.selectArray);
          deleteUld(this.selectArray).then(res => {
            console.log('这个是deleteUld的res');
            console.log(res);
            if (res.status) {
              let options = {
                msg: '成功删除',
                duration: 2000,
                type: 'green'
              };
              // 清空选择
              this.checkAll = false
              this.selectArray = []

              this.getData()
              this.modal = false
              this.$refs.toast.showTips(options)
            }
          })
        }
      },
      getData() {
        uni.showLoading({
          title: '正在加载'
        })
        console.log('this is param');
        console.log(this.param);
        getUldLoad(this.param).then(res => {
          if (res.status) {
            this.items = res.data
            this.items.forEach(item => {
              item.checked = false
            })
            uni.hideLoading()
          } else {
            this.items = []
          }
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    padding-top: 140upx;
  }

  .uldWaiting {
    .top {
      display: flex;
      font-size: 35upx;
      background: #ffffff;
      flex-direction: column;
      margin-top: 10upx;
      color: #595959;
      padding: 30upx 0;
      border: solid 2upx #e5e5e5;

      .btn {
        display: flex;
        flex-direction: row;

        button {
          font-size: 35upx;
        }
      }

      .text {
        background-color: #f0fffc;
        border-radius: 9upx;
        border: solid 3upx #0ebf9c;
        margin: 30upx 35upx 0upx 35upx;
        font-size: 32upx;

        .circle {
          width: 40upx;
          height: 40upx;
          border-radius: 25upx;
          background: #0ebf9c;
          text-align: center;
          line-height: 40upx;
          color: #FFFFFF;
          font-size: 33upx;
          display: inline-block;
        }
      }
    }

    .bottom {
      // overflow-x: auto;
      display: flex;
      flex-direction: row;
      color: #595959;
      width: 100%;
      font-size: 35upx;
      text-align: center;

      .left {
        width: 130upx;

        .head {
          >text {
            text-align: center;
            display: inline-block;
          }

          display: flex;
          justify-content: space-between;
          padding: 30upx 0;
          border: solid 2upx #e5e5e5;
          width: 130upx;
          height: 120upx;
          font-size: 35upx;
        }

        .item-list {
          background: #ffffff;
          padding: 30upx 0;
          display: flex;
          width: 130upx;
          height: 120upx;
          justify-content: space-between;
          font-size: 35upx;
          border: solid 2upx #e5e5e5;

          .check {
            padding-left: 35upx;
          }
        }
      }

      .right {
        width: 620upx;
        overflow-x: auto;
        overflow-y: hidden;

        .head {
          >text {
            text-align: center;
          }

          display: flex;
          justify-content: space-between;
          padding: 30upx 0;
          border: solid 2upx #e5e5e5;
          width: 1800rpx;
          height: 120upx;
          font-size: 35upx;
          // .check {
          // 	padding-left: 30upx;
          // }
        }

        .item-list {
          background: #ffffff;
          padding: 30upx 0;
          display: flex;
          width: 1800rpx;
          height: 120upx;
          justify-content: space-between;
          font-size: 35upx;
          border: solid 2upx #e5e5e5;
          // .check {
          // 	padding-left: 30upx;
          // }
        }
      }
    }
  }
</style>
