<!--
*  界面名称: 异常登记
*  界面功能: 异常运单登记
*  其他:    
-->
<template>
  <view class="content">
    <headBar name="进港异常登记"></headBar>
    <form @submit="formSubmit" @reset="formReset">
      <view class="card">
        <view class="line">
          <text class="flex-sub text-right margin-right">运单号</text>
          <view class="flex-treble flex ">
            <input name='wbPrefix' @focus="wbPrefixFocus" @input="wbPrefixFormat" v-model="abnReg.wbPrefix" placeholder="前缀"
              class="flex-sub solids" @blur='getFlightByWb' />
            <input name='wbNo' v-model="abnReg.wbNo" placeholder="运单号" class="flex-sub solids-top solids-right solids-bottom"
              @input="model7Check" @blur='getFlightByWb' />
          </view>
        </view>

        <view class="line margin-top-sm">
          <text class="flex-sub text-right margin-right">航班</text>
          <view class="flex-treble flex">
            <input @focus="abnCarrierFocus" @input="skipToFlight" name='carrier' v-model="abnReg.carrier" placeholder="承运人" class="flex-twice solids" />
            <input :focus="flightFocus" maxlength="4" name='flight' v-model="abnReg.flight" type="number" placeholder="航班号" class="flex-twice solids-top solids-right solids-bottom" />
          </view>
        </view>

        <view class="line margin-top-sm">
          <text class="flex-sub text-right margin-right">航班日期</text>
          <view class="flex-treble">
            <!-- 使用v-mode会出现各种各样的错误，所以只能使用:value显示数据，@change改变值 -->
            <picker name='flightDate' mode="date" :value="abnReg.flightDate" @change="bindDateChange" class="solids">
              <text class="text-center">{{abnReg.flightDate || '航班日期'}}</text>
            </picker>
          </view>
        </view>

        <!-- 由于bjx-inputx组件有点问题，所以此处为写死宽度,而非百分比布局 -->
        <view class="line margin-top-sm">
          <text class="text-right margin-right" style="min-width: 240rpx;">不正常业务类型</text>
          <view class="flex align-center solids" style="width: 400rpx; height: 80rpx;">
            <bjx-inputx the-style="font-size:35rpx" :value="abnReg.abnType || ''" item-key="abnCode" item-des-key="abnChs"
              placeholder='请输入内容' @list="abnTypeListShow" @select='abnTypeSelect' overflow="auto"></bjx-inputx>
          </view>
        </view>

        <view class="line margin-top-sm">
          <view class="flex flex-sub margin-right-lg">
            <view class="flex-treble flex-direction">
              <text>货物重量</text>
              <text class="text-green">(公斤)</text>
            </view>
            <view class="flex-twice">
              <input name='wgtDoc' type="digit" v-model="abnReg.wgtDoc" class="solids" />
            </view>
          </view>
          <view class="flex flex-sub margin-left-lg">
            <view class="flex-treble flex-direction">
              <text>复称重量</text>
              <text class="text-green">(公斤)</text>
            </view>
            <view class="flex-twice">
              <input name='wgtReweigh' type="digit" v-model="abnReg.wgtReweigh" class="solids" />
            </view>
          </view>
        </view>

        <view class="line margin-top-sm">
          <view class="flex flex-sub margin-right-lg">
            <view class="flex-treble flex align-center">
              <text>不正常件数</text>
            </view>
            <view class="flex-twice">
              <input name='abnNum' type="digit" v-model="abnReg.abnNum" class="solids" />
            </view>
          </view>
          <view class="flex flex-sub margin-left-lg">
            <view class="flex-treble flex align-center">
              <text>不正常重量</text>
            </view>
            <view class="flex-twice">
              <input name='abnWgt' type="digit" v-model="abnReg.abnWgt" class="solids" />
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <view class="line">
          <view class="flex flex-sub align-center">
            <text class="flex-sub">凹陷</text>
            <input @input="abnReg.abnType = 'A'; abnReg.abnChs = '外观凹陷'" name='numDepression' type="number" v-model="abnReg.numDepression"
              class="flex-sub solids" />
          </view>
          <view class="flex flex-sub align-center margin-left-lg">
            <text class="flex-sub">受潮</text>
            <input @input="abnReg.abnType = 'C'; abnReg.abnChs = '受潮'" name='numDamp' type="number" v-model="abnReg.numDamp"
              class="flex-sub solids" />
          </view>
          <view class="flex flex-sub align-center margin-left-lg">
            <text class="flex-sub">破损</text>
            <input @input="abnReg.abnType = 'P'; abnReg.abnChs = '货物破损'" name='numDamage' type="number" v-model="abnReg.numDamage"
              class="flex-sub solids" />
          </view>
        </view>

        <view class="line margin-top-sm">
          <view class="flex flex-sub align-center">
            <text class="flex-sub">渗漏</text>
            <input @input="abnReg.abnType = 'L'; abnReg.abnChs = '渗漏'" name='numLeakage' type="number" v-model="abnReg.numLeakage"
              class="flex-sub solids" />
          </view>
          <view class="flex flex-sub align-center margin-left-lg">
            <text class="flex-sub">其他</text>
            <input @input="abnReg.abnType = 'Q'; abnReg.abnChs = '其他'" name='numOther' type="number" v-model="abnReg.numOther"
              class="flex-sub solids" />
          </view>
          <view class="flex flex-sub align-center margin-left-lg">
            <text class="flex-sub">散包</text>
            <input @input="abnReg.abnType = 'S'; abnReg.abnChs = '散包'" name='numScatter' type="number" v-model="abnReg.numScatter"
              class="flex-sub solids" />
          </view>
        </view>
      </view>

      <view class="card">
        <view class="line">
          <view class="flex flex-sub margin-right-lg">
            <view class="flex-treble flex align-center">
              <text>变色龙变色</text>
            </view>
            <view class="flex-twice">
              <input name='numDiscolor' type="number" v-model="abnReg.numDiscolor" class="solids" />
            </view>
          </view>
          <view class="flex flex-sub margin-left-lg">
            <view class="flex-treble flex align-center">
              <text>动物死亡</text>
            </view>
            <view class="flex-twice">
              <input name='numDead' type="number" v-model="abnReg.numDead" class="solids" />
            </view>
          </view>
        </view>

        <view class="line margin-top-sm">
          <view class="flex flex-sub margin-right-lg">
            <view class="flex-treble flex align-center">
              <text>封口开裂</text>
            </view>
            <view class="flex-twice">
              <input name='numCrack' type="number" v-model="abnReg.numCrack" class="solids" />
            </view>
          </view>
          <view class="flex flex-sub margin-left-lg">
          </view>
        </view>
      </view>

      <view class="card">
        <view class="grid col-4 grid-square flex-sub">
          <view class="bg-img" v-for="(item,index) in imgList" :key="index">
            <image :src="imgList[index]" mode="aspectFill" @tap="viewImage(imgList[index])"></image>
            <!-- bg-grey 用什么都一样，bg-red也不会改变颜色，但没有设置cuIcon-close就不会显示 -->
            <!-- 删除图片 -->
            <view class="cu-tag bg-grey" @tap.stop="delImg">
              <text class='cuIcon-close'></text>
            </view>
            <view v-if="imgStatusArr[index] == '1'" class="photo-trip">
              <text>正在上传</text>
            </view>
            <view v-else-if="imgStatusArr[index] == '2'" class="photo-trip">
              <text>上传成功</text>
            </view>
            <view v-else-if="imgStatusArr[index] == '3'" class="photo-trip" @tap.stop="reUploadImg(index)">
              <text>点击即可重新上传</text>
            </view>
          </view>
          <view class="solids" @tap="chooseImage" v-if="imgList.length<4">
            <text class='cuIcon-cameraadd'></text>
          </view>
        </view>
      </view>

      <view class="card">
        <textarea name='abnReason' v-model='abnReg.abnReason' placeholder="请输入不正常原因..." class="solids padding"></textarea>
        <textarea name='dealSuggestion' v-model='abnReg.dealSuggestion' placeholder="请输入处理意见..." class="solids padding margin-top"></textarea>
      </view>

      <view class="padding flex flex-direction">
        <button form-type="submit" class="cu-btn line-cyan lg">保存</button>
        <button ref='resetButton' form-type="reset" class="cu-btn bg-cyan lg margin-tb-sm">重置表单</button>
      </view>
    </form>

  </view>
</template>

<script>
  import Arrow from '@/components/arrow/arrow.vue'
  import BjxInputx from '@/components/bjx-inputs.vue'
  import dayjs from '@/common/util/dayjs.min.js'
  import * as abnRegApi from '@/common/api/arrival/abnormalRegisterApi.js'
  import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
  import {
    model7,
    deepCopy
  } from '@/common/util/util.js'
  export default {
    components: {
      Arrow,
      BjxInputx,
      headBar
    },
    data() {
      const currentDate = this.getDate({
        format: true
      })
      return {
        // 计时器，用于防抖
        timer: null,
        // 用于标记运单信息是否正确
        wbRightFlag: false,
        // 用于标记航班信息是否正确
        flightRightFlag: false,
        // flight字段focus状态
        flightFocus: false,
        // 异常登记的id，用于照片上传
        abnId: '',
        // 异常登记
        abnReg: {
          // 运单号前缀(此处附上初始值是为了减少后面判空的代码，可以少判断undefine状态)
          wbPrefix: '',
          // 运单号
          wbNo: '',
          // 航班承运人（前缀）
          carrier: '',
          // 航班编号
          flight: '',
          // 航班日期(必须赋默认值，不然会报错)
          flightDate: currentDate,
          // 不正常业务类型(中文、代码)  不赋默认值远程搜索组件无法调用(TODO：第一次点击也可以显示下拉)
          abnChs: '',
          abnType: '',
          // 货物重量
          wgtDoc: null,
          // 夫称重量
          wgtReweigh: null,
          // 不正常件数
          abnNum: null,
          // 不正常重量
          abnWgt: null,
          // 凹陷
          numDepression: null,
          // 受潮
          numDamp: null,
          // 破损
          numDamage: null,
          // 渗透
          numLeakage: null,
          // 其他
          numOther: null,
          // 散包
          numScatter: null,
          // 变色龙变色
          numDiscolor: null,
          // 动物死亡
          numDead: null,
          // 封口开裂
          numCrack: null,
          // 所上传照片
          abnReason: null,
          // 处理意见
          dealSuggestion: null,
        },
        // 此处由于uni.previewImage接口需要(图片路径数组)，没有将imgList,imgStatusArr整合成imgList对象数组
        // 图片路径列表
        imgList: [],
        // 图片上传情况记录 0 未上传，1 正在上传，2上传成功，3上传失败
        imgStatusArr: [],
        // 不正常业务类型下拉列表
        abnTypeList: [],
      }
    },
    onLoad: function (option) {
      console.log('这个是onLoad');
      if (JSON.stringify(option) !== "{}") {
        console.log('option!= {}');
        this.abnReg.carrier = option.carrier
        this.abnReg.flight = option.flight
        this.abnReg.flightDate = option.flightDate
        this.abnReg.wbPrefix = option.wbPrefix
        this.abnReg.wbNo = option.wbNo
        console.log(this.abnReg);
      }
      if (this.abnReg.wbNo) {
        this.getFlightByWb()
      }
    },
    onReady: function () {
      console.log('onReady clg this.abnreg');
      console.log(this.abnReg);
    },
    watch: {
      'abnReg.abnType'(newVal, oldVal) {
        if (newVal) {
          this.abnReg.abnType = newVal.toUpperCase()
        }
      },
      'abnReg.wbPrefix'(newVal, oldVal) {
        if (newVal) {
          this.abnReg.wbPrefix = newVal.toUpperCase()
        }
      },
      'abnReg.carrier'(newVal, oldVal) {
        if (newVal) {
          this.abnReg.carrier = newVal.toUpperCase()
          if (this.abnReg.carrier.length == 2) {
            this.tryCheckFlight()
          }
        }
      },
      'abnReg.flight'(newVal, oldVal) {
        if (newVal) {
          this.abnReg.flight = newVal.toUpperCase()
          if (this.abnReg.flight.length == 4) {
            this.tryCheckFlight()
          }
        }
      },
    },
    methods: {
      debounce(fn, wait) {
        if (this.debounce !== null) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(fn, wait)
      },
      tryCheckFlight() {
        this.debounce(this.checkFlight, 200)
      },
      checkFlight() {
        // 如果承运人、航班号、航班日期都有值，则进行查询
        if (this.abnReg.carrier && this.abnReg.flight && this.abnReg.flightDate) {
          let data = {
            carrier: this.abnReg.carrier,
            flight: this.abnReg.flight,
            flightDate: dayjs(this.abnReg.flightDate, 'yyyy-MM-DD').valueOf()
          }
          console.log(data)
          abnRegApi.checkFlight(data).then(res => {
            console.log('这个是res');
            console.log(res);
            if (res.ok) {
              this.flightRightFlag = true
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none'
              })
              this.flightRightFlag = false
            }
          })
        }
      },
      wbPrefixFocus() {
        this.abnReg.wbPrefix = ''
      },
      abnCarrierFocus () {
        this.abnReg.carrier = ''
      },
      wbPrefixFormat(e) {
        if (e.detail.value && e.detail.value.length > 9) {
          this.abnReg.wbPrefix = e.detail.value.slice(0, 3).toUpperCase()
          this.abnReg.wbNo = e.detail.value.slice(3).toUpperCase()
        }
      },
      skipToFlight(e) {
        console.log('这个是skipToFlight的e');
        console.log(e.detail.value);
        this.flightFocus = false
        if (e.detail.value.length >= 2) {
          console.log('开始跳转');
          this.flightFocus = true
          if (e.detail.value.length > 2) {
            this.abnReg.carrier = e.detail.value.substring(0, 2).toUpperCase()
            this.abnReg.flight = e.detail.value.substring(2).toUpperCase()
          }
        }
      },
      model7Check(e) {
        // 通过model7验证，且订单长度为8 且有运单前缀
        this.abnReg.wbNo = e.detail.value
        if (model7(e.detail.value) && e.detail.value.length == 8 && this.abnReg.wbPrefix) {
          this.getFlightByWb()
        }
      },
      isEmpty(data) {
        // 存在，且不为空字符串
        if (data && data != '') {
          // 不为空
          return false
        }
        // 为空
        return true
      },
      abnTypeListShow(e) {
        this.abnReg.abnCode = e.value
        if (!e.value) {
          e.callback(this.abnTypeList)
        } else {
          let data = []
          this.abnTypeList.forEach(item => {
            // 如果存在中文名，则支持中文、代码搜索
            if (item.abnChs) {
              console.log('这个是if (item.abnChs)');
              if (item.abnChs.indexOf(e.value.toUpperCase()) > -1 || item.abnCode.indexOf(e.value.toUpperCase()) >
                -1) {
                data.push(item)
              }
            } else {
              // 如果不存在中文名，则仅支持代码搜索
              if (item.abnCode.indexOf(e.value.toUpperCase()) > -1) {
                data.push(item)
              }
            }
          })
          e.callback(data)
        }
      },
      abnTypeSelect(e) {
        this.abnReg.abnType = e.abnCode
        this.abnReg.abnChs = e.abnChs
      },
      formSubmit(e) {
        console.log('这个是this.abnReg');
        console.log(this.abnReg);
        if (this.isEmpty(this.abnReg.wbPrefix) || this.isEmpty(this.abnReg.wbNo)) {
          uni.showToast({
            title: '运单号尚未填写完整, 不可保存',
            icon: 'none'
          })
          return false
        }
        
        if (!this.wbRightFlag) {
          uni.showToast({
            title: '运单号有误不可保存',
            icon: 'none'
          })
          return false
        }
        
        if (!this.flightRightFlag) {
          uni.showToast({
            title: '航班号/日期有误不可保存',
            icon: 'none'
          })
          return false
        }
        
        if (this.isEmpty(this.abnReg.abnType)) {
          uni.showToast({
            title: '不正常业务类型未填写/填写错误',
            icon: 'none'
          })
          return false
        }
        
        let findIndexResult = this.abnTypeList.findIndex(item => {
          return item.abnCode === this.abnReg.abnType
        })
        if (findIndexResult === -1) {
          uni.showToast({
            title: '不正常业务类型填写错误，请选中下拉选项',
            icon: 'none'
          })
          return false
        }
        // 异步
        this.saveWayBill()
        // 因为用到了非原生控件(bjx-inputx)，所以此处提交无法采用原生控件的event来获取所填的信息
        // uni.showModal({
        //   title: '保存',
        //   content: '是否确认保存',
        //   success: (res) => {
        //     if (res.confirm) {
        //       this.saveWayBill()
        //     }
        //   }
        // })
      },
      formReset(e) {
        console.log('这个是abnReg');
        console.log(this.abnReg);
        this.abnReg = {
            // 运单号前缀(此处附上初始值是为了减少后面判空的代码，可以少判断undefine状态)
            wbPrefix: '',
            // 运单号
            wbNo: '',
            // 航班承运人（前缀）
            carrier: '',
            // 航班编号
            flight: '',
            // 航班日期(必须赋默认值，不然会报错)
            flightDate: this.getDate(),
            // 不正常业务类型(中文、代码)
            abnChs: '',
            abnType: '',
            // 货物重量
            wgtDoc: null,
            // 夫称重量
            wgtReweigh: null,
            // 不正常件数
            abnNum: null,
            // 不正常重量
            abnWgt: null,
            // 凹陷
            numDepression: null,
            // 受潮
            numDamp: null,
            // 破损
            numDamage: null,
            // 渗透
            numLeakage: null,
            // 其他
            numOther: null,
            // 散包
            numScatter: null,
            // 变色龙变色
            numDiscolor: null,
            // 动物死亡
            numDead: null,
            // 封口开裂
            numCrack: null,
            // 所上传照片
            abnReason: null,
            // 处理意见
            dealSuggestion: null,
          },
          // 清空照片列表
          this.imgList = []
      },
      // 保存运单异常登记
      saveWayBill() {

        // 存储时数据需要转换，为了不影响界面显示效果，进行深度拷贝
        let saveData = deepCopy(this.abnReg)
        // 将日期转为时间戳
        saveData.flightDate = dayjs(saveData.flightDate, 'yyyy-MM-DD').valueOf()

        // 保存订单信息
        abnRegApi.saveWayBill(this.abnReg).then(async res => {
          if (res.ok) {
            uni.showToast({
              title: '保存异常信息成功，正在上传照片',
              icon: 'none'
            })
            // 保存基础信息成功后，获取异常信息id，用于照片保存
            this.abnId = res.message

            // 上传文件(等待上传事件，)
            let upLoadSuccess = await this.uploadAllImg()
            if (upLoadSuccess) {
              uni.showToast({
                title: '保存订单成功，自动开始下一单',
                icon: 'none'
              })
              uni.pageScrollTo({
                scrollTop: 0,
                duration: 100
              })
              // 保存成功后，重置表单
              this.formReset()
            } else {
              uni.showToast({
                title: '个别图片上传失败，请重新上传后手动清空订单',
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      // 
      async uploadAllImg() {
        // success用于标识是否全部上传成功
        // 若全部上传成功则清空订单
        let success = true
        let uploadPromiseList = this.imgList.map((item, index) => {
          return this.uploadImg(index)
        })
        await Promise.all(uploadPromiseList).then(res => {
          success = true
        }).catch(rej => {
          success = false
        })
        return success
      },
      uploadImg(index) {
        // 将对应的设置为上传中
        this.$set(this.imgStatusArr, index, '1')
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: abnRegApi.uploadImgUrl,
            filePath: this.imgList[index],
            name: 'file',
            formData: {
              'abnId': this.abnId
            },
            success: (e) => {
              // 上传成功
              this.$set(this.imgStatusArr, index, '2')
              resolve(Object.assign(e, {
                subscript: index
              }))
            },
            fail: (e) => {
              // 上传失败
              this.$set(this.imgStatusArr, index, '3')
              reject(Object.assign(e, {
                subscript: index
              }))
            }
          })
        })
      },
      reUploadImg(index) {
        this.uploadImg(index).then(res => {
          console.log('这个是重新上传照片的res')
          console.log(res)
        }).catch(rej => {
          console.log('这个是重新上传照片的reject')
          console.log(rej)
        })
      },
      getFlightByWb() {
        if (this.isEmpty(this.abnReg.wbPrefix) || this.isEmpty(this.abnReg.wbNo)) {
          // uni.showToast({
          //   title: '运单号尚未填写完整',
          //   icon: 'none'
          // })
          return false
        }
        abnRegApi.getFlightByWb(this.abnReg).then(res => {
          if (res.ok) {
            // 运单可用
            this.wbRightFlag = true
            
            let tempData = res.data
            // 由于返回中有的无用信息、格式较乱，但需要获取信息较少，所以在此处进行提取
            // 日期
            console.log('tempData');
            console.log(tempData);
            console.log('这个是格式化后的刚喊日期');
            console.log(dayjs(tempData.flightDate).format('YYYY-MM-DD'));
            this.$set(this.abnReg, 'flightDate', dayjs(tempData.flightDate).format('YYYY-MM-DD'))
            console.log(this.abnReg.flightDate);
            // 承运人
            this.$set(this.abnReg, 'carrier', tempData.carrier)
            // 航班号
            this.$set(this.abnReg, 'flight', tempData.flight)
            // 运单id
            this.$set(this.abnReg, 'wbId', tempData.wayBillEntity.id)
            // 总重量
            this.$set(this.abnReg, 'wgtDoc', tempData.wayBillEntity.wgtTotal)
            // 目的站
            this.$set(this.abnReg, 'destination', tempData.wayBillEntity.destination)
            // 起始站
            this.$set(this.abnReg, 'origin', tempData.wayBillEntity.origin)
            // 进出港
            this.$set(this.abnReg, 'direction', tempData.wayBillEntity.direction)
            // 运单类型
            this.$set(this.abnReg, 'docType', tempData.wayBillEntity.wbType)
            console.log('这个是this.abnReg')
            console.log(this.abnReg)
          } else {
            this.wbRightFlag = false
            uni.showToast({
              title: '未查询到订单相关信息',
              icon: 'none'
            })
          }
        })
      },
      bindDateChange(e) {
        this.abnReg.flightDate = e.target.value
        this.tryCheckFlight()
      },
      chooseImage() {
        if (this.isEmpty(this.abnReg.wbPrefix) || this.isEmpty(this.abnReg.wbNo)) {
          uni.showToast({
            title: '运单号尚未填写完成，不可拍照',
            icon: 'none'
          })
          return false
        }
        uni.chooseImage({
          count: 4, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          success: (res) => {
            // imgList:用于批量显示图片
            if (this.imgList.length != 0) {
              // 将路径添加到imgList中
              this.imgList = this.imgList.concat(res.tempFilePaths)
              // 将上传状态添加到imgList中
              this.imgStatusArr.push('0')
            } else {
              this.imgList = res.tempFilePaths
            }
          }
        });
      },
      viewImage(currentUrl) {
        uni.previewImage({
          urls: this.imgList,
          current: currentUrl
        });
      },
      delImg(e) {
        uni.showModal({
          title: '删除',
          content: '确定要删除这张照片吗',
          cancelText: '取消',
          confirmText: '确认',
          success: (res) => {
            if (res.confirm) {
              // 删除照片路径
              this.imgList.splice(e.currentTarget.dataset.index, 1)
              // 删除照片状态
              this.imgStatusArr.splice(e.currentTarget.dataset.index, 1)
            }
          }
        })
      },
      getAbnTypeList() {
        abnRegApi.getAbnType().then(res => {
          if (res.ok) {
            this.abnTypeList = res.data
          } else {
            uni.showModal({
              title: '提示',
              content: '获取不正常业务类型失败，可能无法正常存储此字段，点击确定重新获取',
              success: (res) => {
                if (res.confirm) {
                  this.getAbnTypeList()
                }
              }
            })
          }
        })
      },
      getDate(type) {
        const date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        if (type === 'start') {
          year = year - 60
        } else if (type === 'end') {
          year = year + 2
        }
        month = month > 9 ? month : '0' + month
        day = day > 9 ? day : '0' + day
        return `${year}-${month}-${day}`
      }
    },
    onShow() {
      this.getAbnTypeList()
    }
  }
</script>

<style lang="scss">
  page {
    padding-top: 140upx;
  }
</style>

<style lang="scss" scoped>
  .content {
    // 为tabBar留下足够的空间
    background: #f4f5f6;
    padding: 0rpx, 10rpx;
    width: 100%;

    .component {
      background: #FFFFFF;
    }
  }

  textarea {
    font-size: 35rpx
  }

  .card {
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    margin-top: 20rpx;
    padding: 20rpx 40rpx;

    .line {
      height: 90rpx;
      display: flex;
      align-items: center;

      input {
        padding: 20rpx;
        height: 90rpx;
        text-align: center;
        font-size: 35rpx
      }

      text {
        height: 50rpx;
        display: block;
        font-size: 35rpx
      }
    }
  }

  /* picker高度设置为40rpx是因为实际上picker的高度为他自身高度，加上内部text高度 */
  picker {
    height: 90rpx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  textarea {
    height: 200rpx;
    width: 100%;
  }

  .photo-trip {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 40rpx 0;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.6);

    text {
      font-size: 35rpx;
      color: #fff;
    }
  }
</style>
