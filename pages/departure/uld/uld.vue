<!--
*  界面名称: uld配载
*  界面功能: 
*  其他:    
-->
<template>
	<view class="uld">
		<headBar name="出港ULD配载"></headBar>
		<view class="content-head">
			<view class="head-input">
				<text class="lableWidth">ULD号</text>
				<input class="uld-input" @focus="form.uldType = ''" @input="uldTypeChange" @blur="getULD" v-model="form.uldType" />
				<input class="uld-input" @focus="form.uldNo = ''" @input="uldNoChange" @blur="getULD" style="margin-left: 0;border-left: 0;"
				 v-model="form.uldNo" />
				<input class="uld-input" @blur="getULD" style="margin-left: 0;border-left: 0;" v-model="form.uldNoSuffix" />
			</view>
		</view>
		<view class="content-middle">
			<view class="head-input">
				<text class="lableWidth">ULD自重</text>
				<input class="uld-input2 disable" v-model="form.uldWeight" disabled />
				<text class="flight">航班</text>
				<input class="uld-input2" @focus="blockDestination" @input="skipToFlight" @blur="getDestination(true)" v-model="form.carrier" />
				<input :focus="flightFocus" @focus="blockDestination" class="uld-input2" @blur="getDestination(true)" style="margin-left: 0;border-left: 0;"
				 v-model="form.flight" />
			</view>
			<view class="middle-data">
				<text class="lableWidth">航班日期</text>
				<picker mode="date" :value="form.flightDate" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uld-date">{{form.flightDate}}</view>
				</picker>
			</view>
			<view class="middle-position">
				<text class="lableWidth">起止站</text>
				<input class="pick-text" v-model="form.origin" />
				<!-- 				<view class="pick-text">{{form.origin}}</view> -->
				<picker @change="positionChange2" :range="positionArray" :disabled="!destinationEnable">
					<view class="pick-text" :class="{'disable':!destinationEnable}" style="margin-left: 0;border-left: 0;">{{form.destination}}</view>
				</picker>
			</view>
			<view class="mid-last">
				<text class="lableWidth">整车体积</text>
				<input class="num-input" v-model="form.loadVol" />
				<text class="lableWidth">ULD状态</text>
				<picker :range="statusArray" disabled="true">
					<view class="num-input disable" style="margin-left: 0;border-left: 0;">{{format(form.uldStatus)}}</view>
				</picker>
				<!-- <input  v-model="form.uldStatus"/> -->
			</view>
			<view class="middle-bottom">
				<textarea class="uld-textarea" v-model="form.remark" placeholder="备注" />
				</view>
			<view class="middle-btn">
				<button type="primary" @click="save" plain="true">保存</button>
			</view>
		</view>
		<view class="tab-class">
		 <text>货物信息列表</text>
		</view>
		<view class="contend">
			<view class="left">
				<view class="head">
					<text style="width: 250rpx" space="emsp">运单号</text>
				</view>
				<view class="list-item" v-for="(item, index) in list" @click="setNum(item)" :key="index">
					<text style="width: 250rpx">{{item.WBPREFIX + item.WBNO}}</text>
				</view>
			</view>
			<view class="right">
				<view class="head">
					<text style="width: 100rpx">件数</text>
					<text style="width: 100rpx">重量</text>
					<text style="width: 100rpx">体积</text>
					<text style="width: 150rpx">代理人</text>
					<text style="width: 400rpx">品名</text>
					<text style="width: 200rpx">特殊处理代码</text>
					<text style="width: 250rpx">航程</text>
				</view>
				<view class="list-item" v-for="(item, index) in list"  @click="setNum(item)" :key="index">
					<text style="width: 100rpx">{{item.NUM}}</text>
					<text style="width: 100rpx">{{item.WGT}}</text>
					<text style="width: 100rpx">{{item.VOL}}</text>
					<text style="width: 150rpx">{{item.PROXY}}</text>
					<text style="width: 400rpx">{{item.CARGONAME}}</text>
					<text style="width: 200rpx">{{item.SPECIALCODE}}</text>
					<text style="width: 250rpx">{{item.SAIL}}</text>
				</view>
			</view>
		</view>
		<view class="content-bottom">
			<view class="bottom-top">
				<text class="lableWidth">运单号</text>
				<input class="uld-input2" @blur="getWeight" @input="partWbNo" v-model="wbData.wbPrefix"/>
				<input class="uld-input3" @blur="getWeight" @input="partWbNo" style="margin-left: 0;border-left: 0;" v-model="wbData.wbNo"/>
			</view>
			<view class="bottom-middle">
				<text class="lableWidth2">件数</text>
				<input class="uld-input4" type="number" @blur="changeAddWeight" v-model="addData.addnum"/>
				<text class="lableWidth2">重量</text>
				<input class="uld-input4" type="digit" v-model="addData.addwgt"/>
				<text class="lableWidth2">体积</text>
				<input class="uld-input4" type="digit" v-model="addData.addvol"/>
			</view>
			<view class="bottom-btn">
				<button type="primary" :loading="addFlag" :disabled="addFlag" @click="add" plain="true" :class="{'disable-button':addFlag, 'active-button':!addFlag}">加货</button>
			</view>
			<view class="bottom-middle">
				<text class="lableWidth2">件数</text>
				<input class="uld-input4" type="number" @blur="changePullWeight" v-model="pullData.minusnum"/>
				<text class="lableWidth2">重量</text>
				<input class="uld-input4" type="digit" v-model="pullData.minuswgt"/>
				<text class="lableWidth2">体积</text>
				<input class="uld-input4" type="digit" v-model="pullData.minusvol"/>
			</view>
			<view class="bottom-btn" style="border: 0;">
				<button type="primary" :loading="pullFlag" :disabled="pullFlag" @click="pull" plain="true" :class="{'disable-button':pullFlag, 'active-button':!pullFlag}">拉下</button>
				<view class="btn">
					<button type="primary" plain="true" class="active-button" @click="test">打印挂签</button>
				</view>
				<view class="btn">
					<button type="primary" @click="reset" plain="true" class="active-button">下一ULD</button>
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" content="入库件数超过舱单件数，是否确认入库"></tui-modal>
	</view>
</template>

<script>
	import headBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import tuiModal from '@/components/modal'
	import {downAssembly,isFstWb,selectuldmgt,saveuldassembly,getFlightStations,mysave,selectairwaybillmsg,getReWeighOff} from '@/common/api/departure/uld/uld.js'
	import {deepCopy,isEmpty,isEmptyNum,model7} from '@/common/util/util.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		components: {
			headBar,tuiModal
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
        flightFocus:false,
				addFlag: false, //用于加货按钮的disable
				pullFlag: false, //用于拉下按钮的disable
				isrewgtoff: '0', //是否复称截关
				isTrainSit: '0',
				isContain: '2', //0.目的站不符且航段不包含，1.目的站不符但航段包含，2.目的站相符
				isSupperAdd: '0', //0.加货，1.高级加货 
				positionArray: [],
				statusArray: [],
        destinationEnable: false,
        modal:false,
				form: {
					uldFlightId: '',
					uldType: 'CAR',
					uldid: '',
					uldNo: '',
					uldNoSuffix: 'GN',
					remark: '',
					uldAirport: '',
					shapeCode: '',
					packMan: '',
					flightDate: currentDate,
					uldWeight: '',
					carrier: '',
					flight: '',
					loadVol: '0',
					uldStatus: '',
					origin: 'XMN',
					destination: ''
				},
				wbData: {
					wbPrefix: '',
					wbNo: '',
					wbId: ''
				},
        // 输入框中所填写的加货参数
				addData: {
					addnum: '',
					addwgt: '',
					addvol: ''
				},
        // 输入框中所填写的拉货参数
				pullData: {
					minusnum: '',
					minuswgt: '',
					minusvol: ''
				},
        // 该uld，最大加货量
				uldAdd: {
					addnum: '',
					addwgt: '',
					addvol: ''
				},
        // 改uld，最大拉下量
				uldPull: {
					minusnum: '0',
					minuswgt: '0',
					minusvol: '0'
				},
				list: []
			}
		},
		onLoad: function (option) {
			console.log('option', option)
		    let yundan = option.wbNo
			if (yundan) {
				this.wbData.wbPrefix= option.wbPrefix
				this.wbData.wbNo = option.wbNo
			}
			this.statusArray = this.$store.state.dic.uldType_dic
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
    
    watch:{
      'form.uldType' (newVal, oldVal) {
        if (newVal) {
          this.form.uldType = newVal.toUpperCase()
        }
      },
      'form.uldNo' (newVal, oldVal) {
        if (newVal) {
          this.form.uldNo = newVal.toUpperCase()
        }
      },
      'form.uldNoSuffix' (newVal, oldVal) {
        if (newVal) {
          this.form.uldNoSuffix = newVal.toUpperCase()
        }
      },
      'form.carrier' (newVal, oldVal) {
        if (newVal) {
          this.form.carrier = newVal.toUpperCase()
        }
      },
      'form.origin' (newVal, oldVal) {
        if (newVal) {
          this.form.origin = newVal.toUpperCase()
        }
      },
      'pullData.minusnum' (newVal, oldVal) {
        if (newVal % 1) {
          this.$message('件数仅能为整数')
          this.pullData.minusnum = Number(newVal).toFixed(0)
        }
      },
      'pullData.minuswgt' (newVal, oldVal) {
        if (newVal % 1) {
          // this.$message('重量不能为小数，已经四舍五入')
          this.pullData.minuswgt = Number(newVal).toFixed(0)
        }
      },
      'pullData.minusvol' (newVal, oldVal) {
        if ((newVal * 10) % 1) {
          this.$message('体积仅能有1位小数')
          // 此功能在H5可用，在PDA上有兼容问题
          // this.pullData.minusvol = Number(newVal).toFixed(1)
        }
      },
      'addData.addnum' (newVal, oldVal) {
        if (newVal % 1) {
          this.$message('件数仅能为整数')
          this.addData.addnum = Number(newVal).toFixed(0)
        }
      },
      'addData.addwgt' (newVal, oldVal) {
        if (newVal % 1) {
          // this.$message('重量不能为小数，已经四舍五入')
          this.addData.addwgt = Number(newVal).toFixed(0)
        }
      },
      'addData.addvol' (newVal, oldVal) {
        if ((newVal * 10) % 1) {
          this.$message('体积仅能有1位小数')
        }
      },
    },
		methods: {
			// test() {
			// 	// this.list[0].WGT = Math.random() * 100
			// },
			// checkWgt (data) { // 计算运单重量
			// 	return data.WGT.toFixed(0) // 正常情况进行四舍五入
			// },
      // 当在输入航班的时候，无法直接点击目的站点
      blockDestination () {
        this.destinationEnable = false
      },
      skipToFlight (e) {
        console.log('这个是skipToFlight的e');
        console.log(e.detail.value);
        this.flightFocus = false
        if (e.detail.value.length === 2) {
          console.log('开始跳转');
          this.flightFocus = true
        }
      },
      // 用于光标在uldType时的扫描输入处理
      uldTypeChange (val) {
      	console.log('type', val.detail.value)
      	if (val.detail.value.length === 3) {
      		this.form.uldType = val.detail.value.toLocaleUpperCase()
      	}
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
      // 用于光标在uldNoChange时的扫描输入处理
      uldNoChange (val) {
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
      // 分离订单号
      partWbNo(val) {
        if (val.detail.value.length >= 10) {
          this.wbData.wbPrefix = (val.detail.value.substring(0, val.detail.value.length - 8)).toLocaleUpperCase()
          this.wbData.wbNo = val.detail.value.substring(val.detail.value.length - 8, val.detail.value.length)
        }
      },
			getisFstWb () {
				this.isContain = '2'
				let data = deepCopy(this.form)
				data.uldid  =this.form.uldid
				data.wbprefix = this.wbData.wbPrefix
				data.wbno = this.wbData.wbNo
				isFstWb(data).then(res => {
					if (res.data) {
						if (res.data.message !== null && res.data.message !== '操作成功') {
							if (res.data.message === '1' || res.data.message === '0') {
								this.$message('该运单目的站与uld目的站不符！')
								this.isContain = res.data.message
							} else {
								this.isContain = '2'
							}
						}
						if (res.data.obj !== null && res.data.obj !== '') {
							this.isTrainSit = res.data.obj
						}
					}
				})
			},
			pull () {
        // this.$message('点击了拉下')
        // return
				this.pullFlag = true
        console.log(typeof(this.pullData.minusnum));
        console.log(typeof(this.pullData.minuswgt));
        console.log(typeof(this.pullData.minusvol));
        // 不得全为0或空
        if (isEmpty(Number(this.pullData.minusnum)) && isEmpty(Number(this.pullData.minuswgt)) && isEmpty(Number(this.pullData.minusvol))) {
          this.$message('件数、重量、体积不得全为0或空')
          this.pullFlag = false
          return false
        }
        
        // 件数必须为整数，重量、体积不得为两位小数
        let numCheckResult = ''
        if (this.pullData.minusnum % 1) {
          numCheckResult += '件数不得为小数 '
        }
        if (this.pullData.minuswgt % 1) {
          numCheckResult += '重量不能为小数 '
        }
        if ((this.pullData.minusvol * 10) % 1) {
          numCheckResult += '体积仅能有1位小数 '
        }
        // 如果numCheckResult.length不为0，则numCheckResult即携带了错误信息，此时弹出错误信息后，退出当前函数
        if (numCheckResult.length) {
          this.$message(numCheckResult)
          this.pullFlag = false
          return
        }
        
        // 中件数、重量、体积均不能为空
				if (!isEmptyNum(this.pullData.minusnum) && !isEmptyNum(this.pullData.minuswgt) && !isEmptyNum(this.pullData.minusvol)) {
					if (this.form.uldStatus === '1' || this.form.uldStatus === '2') {
						
            // getIsrewgtoff 判断是否已经截关，若截关（isrewgtoff = 1）则不可拉下
            // getIsrewgtoff 仅用于获取截关状态，会修改this.isrewgtoff
            this.getIsrewgtoff().then(
            res => {
              // 如果是未截关，将会进行之后的判断，否则直接提示货物已截关
              if (this.isrewgtoff !== '1') {
                // TODO：加注释
              	if (!isEmptyNum(this.form.uldid)) {
              		if (Number(this.pullData.minusnum ) < 0 || Number(this.pullData.minusvol ) < 0 || Number(this.pullData.minuswgt ) < 0) {
              			this.pullFlag = false
                    let result = ''
              			if (Number(this.pullData.minusnum ) < 0) {
                      result += '拉下件数未负'
              			}
                    if (Number(this.pullData.minuswgt ) < 0) {
                      result += '拉下重量为负'
                    }
              			if (Number(this.pullData.minusvol ) < 0) {
                      result += '拉下体积为负'
              			}
                    this.$message(result)
              		} else if (Number(this.pullData.minusnum ) > Number(this.uldPull.minusnum) || Number(this.pullData.minusvol ) > Number(this.uldPull.minusvol) || Number(this.pullData.minuswgt ) > Number(this.uldPull.minuswgt)) {
              			this.pullFlag = false
                    let result = ''
              			if (Number(this.pullData.minusnum ) > Number(this.uldPull.minusnum)) {
                      result += '拉下件数超出 '
              			}
                    if (Number(this.pullData.minuswgt ) > Number(this.uldPull.minuswgt)) {
                      result += '拉下重量超出 '
                    }
              			if (Number(this.pullData.minusvol ) > Number(this.uldPull.minusvol)) {
                      result += '拉下体积超出 '
              			}
                    this.$message(result)
              		} else {
                    // 判断是否能够拉下
                    let result = this.isPullGoods()
              			if (result == null || result == ""){
              				//拉下接口
              				let data = {}
              				data.num = this.pullData.minusnum
              				data.vol = this.pullData.minusvol
              				data.wgt = this.pullData.minuswgt
              				data.uldId = this.form.uldid
              				data.wbPrefix = this.wbData.wbPrefix
              				data.wbNo = this.wbData.wbNo
              				data.isSupperAdd = '0'
              				data.wbId = this.wbData.wbId
              				data.uldCode = this.form.uldType + this.form.uldNo + this.form.uldNoSuffix
                      // 下拉操作
              				downAssembly(data).then(res => {
                        console.log('这个是downAssembly的res');
                        console.log(res);
              					this.pullFlag = false
              					this.$message(res.message)
              					if(res.status) {
              						this.clear()
              						this.getULD()
              					}
              				})
              			} else {
                      this.$message(result)
                    }
              		}
              	} else {
              		this.pullFlag = false
              		this.$message('请填入正确的ULD号')
              	}
              } else {
              	this.pullFlag = false
              	this.$message('已复称截关，不可拉下')
              }
            },
            rej => {
              this.pullFlag = false
              this.$message('已截关，不可拉下')
            })

					} else {
						this.pullFlag = false
						this.$message('该ULD状态下不可拉下')
					}
				} else {
          this.pullFlag = false
          isEmptyNum(this.pullData.minusnum) ? this.$message('拉下件数不得或者空'):null
          isEmptyNum(this.pullData.minuswgt) ? this.$message('拉下重量不得或者空'):null
          isEmptyNum(this.pullData.minusvol) ? this.$message('拉下体积不得或者空'):null
        }
			},
      // 判断是否可以拉下货物，会返回一个isPull
      // 若不行isPull会返回错误的信息，用于显示
			isPullGoods(){
        // isPull是用于用于返回的字符串。
				var isPull = "";
				if (this.isTrainSit === "1" || this.form.uldType !== 'CAR' ){
					//若进入此if，则为中转货，中转货、板、箱不验证体积
          // 如果当前输入框的的重量或数量(pullData)，与可下拉的重量或数量(uldPull)有一个相等，则证明需要全部拉下，
					if (Number(this.pullData.minusnum) === Number(this.uldPull.minusnum) || Number(this.pullData.minuswgt) === Number(this.uldPull.minuswgt)){
						if (Number(this.pullData.minusnum) === Number(this.uldPull.minusnum)){
              // 若重量未全下拉
							if (Number(this.pullData.minuswgt) !== Number(this.uldPull.minuswgt)) {
								isPull = isPull + "重量未全拉下 "
							}
						}
						if (Number(this.pullData.minuswgt) === Number(this.uldPull.minuswgt)){
							if (Number(this.pullData.minusnum) !== Number(this.uldPull.minusnum)) {
								isPull = isPull + "件数未全拉下 "
							}
						}
					}
				} else {
          // 如果当前输入框的的重量、数量、体积(pullData)，与可下拉的重量或数量(uldPull)有一个相等，则证明需要全部拉下，
					if (Number(this.pullData.minusnum) === Number(this.uldPull.minusnum) || Number(this.pullData.minuswgt) === Number(this.uldPull.minuswgt) || Number(this.pullData.minusvol) === Number(this.uldPull.minusvol)){
						if (Number(this.pullData.minusnum) !== Number(this.uldPull.minusnum)) {
							isPull = isPull + "件数未全拉下 "
						}
            if (Number(this.pullData.minuswgt) !== Number(this.uldPull.minuswgt)) {
            	isPull = isPull + "重量未全拉下 "
            }
						if(Number(this.pullData.minusvol) !== Number(this.uldPull.minusvol)) {
							isPull = isPull + "体积未全拉下 "
						}
					}
				}
        // pullFlag是用于拉下按钮的disable，this.pullFalg = false代表可以点击拉下按钮，再次尝试进行拉下操作
				this.pullFlag = false
				return isPull
			},
      // 加货操作
			add () {
				this.addFlag = true
        
        // 不得全为0或空
        if (isEmpty(Number(this.addData.addnum)) && isEmpty(Number(this.addData.addwgt)) && isEmpty(Number(this.addData.addvol))) {
          this.$message('件数、重量、体积不得全为0或空')
          this.addFlag = false
          return false
        }
        
        // 件数必须为整数，重量、体积不得为两位小数
        let numCheckResult = ''
        if (this.addData.addnum % 1) {
          numCheckResult += '件数不得为小数 '
        }
        if (this.addData.addwgt % 1) {
          numCheckResult += '重量不能为小数 '
        }
        if ((this.addData.addvol * 10) % 1) {
          numCheckResult += '体积仅能有1位小数 '
        }
        // 如果numCheckResult不为空字符串，即有错误信息，提示错误信息之后推出加货操作
        if (numCheckResult.length) {
          this.$message(numCheckResult)
          this.addFlag = false
          return
        }
        
				if (this.isContain === '1') {
					this.$message('该运单目的站与uld目的站不符!')
          this.addFlag = false
				} else {
          // 加货件数、加货重量、加货体积，均不能为空
          if(!isEmptyNum(this.addData.addnum) && !isEmptyNum(this.addData.addwgt) && !isEmptyNum(this.addData.addvol)) {
          	if (this.form.uldStatus === '1' || this.form.uldStatus === '2') {
              // 查看是否已截关,getIsrewgtoff会修改this.isrewgtoff的值，所以后续用isrewgtoff作为判断
              this.getIsrewgtoff().then(
              res => {
                console.log('这个是geIsrewe的res，ok则为未截关，可继续操作');
                console.log(res);
                // 若为1则
                if (this.isrewgtoff !== '1') {
                	if (!isEmptyNum(this.form.uldid)) {
                		if (Number(this.addData.addnum) < 0 || Number(this.addData.addwgt) < 0 || Number(this.addData.addvol) < 0) {
                      // 若加货数量、重量、体积有一个小于0则进入此if
                			this.addFlag = false
                      let result = ''
                			if (Number(this.addData.addnum) < 0) {
                        result += '加货件数小于0 '
                				// this.$message('加货件数小于0 ')
                			}
                      if (Number(this.addData.addwgt) < 0) {
                        result += '加货重量小于0 '
                      	// this.$message('加货重量小于0 ')
                      }
                			if (Number(this.addData.addvol) < 0) {
                        result += '加货体积小于0'
                				// this.$message('加货体积小于0 ')
                			}
                      this.$message(result)
                		} else if (Number(this.addData.addnum) > Number(this.uldAdd.addnum) || Number(this.addData.addwgt) > Number(this.uldAdd.addwgt) || Number(this.addData.addvol) > Number(this.uldAdd.addvol)) {
                			// 若加货件数、重量、体积有一个大于库存，则进入此if
                      this.addFlag = false
                      let result = ''
                			if (Number(this.addData.addnum) > Number(this.uldAdd.addnum)) {
                        result += '加货件数大于库存件数 '
                				// this.$message('加货件数大于库存件数 ')
                			}
                      if (Number(this.addData.addwgt) > Number(this.uldAdd.addwgt)) {
                        result += '加货重量大于库存重量 '
                      }
                			if (Number(this.addData.addvol) > Number(this.uldAdd.addvol)) {
                        result += '加货体积大于库存体积 '
                				// this.$message('加货体积大于库存体积 ')
                			}
                      this.$message(result)
                		} else {
                      // 加货件数正确，开始进行加货操作
                      let result = this.isAddGoods()
                			if (result == "" || result == null){
                				// 加货接口
                				let data = {}
                				data.num = this.addData.addnum
                				data.vol = this.addData.addvol
                				data.wgt = this.addData.addwgt
                				data.uldid = this.form.uldid
                				data.prefix = this.wbData.wbPrefix
                				data.airwaybill = this.wbData.wbNo
                				data.isSupperAdd = '0'
                				data.wbId = this.wbData.wbId
                				data.uldcode = this.form.uldType + this.form.uldNo + this.form.uldNoSuffix
                				saveuldassembly(data).then(res => {
                          console.log('这个是saveuld的res');
                          console.log(res);
                					if(res.status) {
                						if (res.data.message !== '') {
                							this.addFlag = false
                							this.$message(res.data.message)
                						} else {
                							this.addFlag = false
                							this.$message('加货成功')
                							this.clear()
                							this.getULD()
                						}
                					} else {
                						this.addFlag = false
                						this.$message(res.message)
                					}
                				})
                			} else {
                        this.$message(result)
                      }
                		}
                	} else {
                		this.addFlag = false
                		this.$message('请填入正确的ULD号')
                	}
                } else {
                	this.addFlag = false
                	this.$message('已复称截关，不可拉下')
                }
              }, 
              rej => {
                this.addFlag = false
                this.$message('已截关，请重新尝试加货')
              })
          	} else {
          		this.addFlag = false
          		this.$message('该ULD状态下不可加货')
          	}
          } else {
            this.addFlag = false
            isEmptyNum(this.addData.addnum) ? this.$message('加货件数不得为空'):null
            isEmptyNum(this.addData.addwgt) ? this.$message('加货重量不得为空'):null
            isEmptyNum(this.addData.addvol) ? this.$message('加货体积不得为空'):null
          }
				}
			},
      // 判断是否可以拉下货物，会返回一个isAdd
      // 若不行isAdd会返回错误的信息，用于显示
			isAddGoods(){
        // isAdd是用于用于返回的字符串。
        //若进入此if，则为中转货，中转货、板、箱不验证体积
				var isAdd = "";
        //若进入此if，则为中转货，中转货、板、箱不验证体积
        // 如果当前输入框的的重量或数量(pullData)，与可加货的重量或数量(uldAdd)有一个相等，则证明需要全部拉下，
				if (this.isTrainSit === "1"|| this.form.uldType !== 'CAR' || Number(this.addData.addvol) === 0){//中转货,板,箱不验证体积
        // 如果件数或重量有一个与可加货的最大值相同，则其他的也需要全部加上
					if (Number(this.addData.addnum) === Number(this.uldAdd.addnum) || Number(this.addData.addwgt) === Number(this.uldAdd.addwgt) && Number(this.addData.addvol) !== 0) {
						if (Number(this.addData.addnum) === Number(this.uldAdd.addnum)) {
							if (Number(this.addData.addwgt) !== Number(this.uldAdd.addwgt)) {
								isAdd = isAdd + "重量未全配上 "
							}
						}
						if (Number(this.addData.addwgt) === Number(this.uldAdd.addwgt)) {
							if (Number(this.addData.addnum) !== Number(this.uldAdd.addnum)) {
								isAdd = isAdd + "件数未全配上 "
							}
						}
					}
				} else {
          // 如果当前输入框的的重量、数量、体积(pullData)，与可下拉的重量或数量(uldPull)有一个相等，则证明需要全部拉下，
					if (Number(this.addData.addnum) === Number(this.uldAdd.addnum) || Number(this.addData.addwgt) === Number(this.uldAdd.addwgt) && Number(this.addData.addvol) === Number(this.uldAdd.addvol)) {
						if (Number(this.addData.addnum) !== Number(this.uldAdd.addnum)) {
							isAdd = isAdd + "件数未全配上 "
						}
						if (Number(this.addData.addwgt) !== Number(this.uldAdd.addwgt)) {
							isAdd = isAdd + "重量未全配上 "
						}
            if (Number(this.addData.addvol) !== Number(this.uldAdd.addvol)) {
            	isAdd = isAdd + "体积未全配上 "
            }
      //       if (Number(this.addData.addnum) === Number(this.uldAdd.addnum)) {
						// 	if (Number(this.addData.addwgt) !== Number(this.uldAdd.addwgt)) {
						// 		isAdd = isAdd + "重量未全配上 "
						// 	}
						// 	if (Number(this.addData.addvol) !== Number(this.uldAdd.addvol)) {
						// 		isAdd = isAdd + "体积未全配上 "
						// 	}
						// }
						// if (Number(this.addData.addvol) === Number(this.uldAdd.addvol)) {
						// 	if (Number(this.addData.addnum) !== Number(this.uldAdd.addnum)) {
						// 		isAdd = isAdd + "件数未全配上 "
						// 	}
						// 	if (Number(this.addData.addwgt) !== Number(this.uldAdd.addwgt)) {
						// 		isAdd = isAdd + "重量未全配上 "
						// 	}
						// }
						// if (Number(this.addData.addwgt) === Number(this.uldAdd.addwgt)) {
						// 	if (Number(this.addData.addnum) !== Number(this.uldAdd.addnum)) {
						// 		isAdd = isAdd + "件数未全配上 "
						// 	}
						// 	if (Number(this.addData.addvol) !== Number(this.uldAdd.addvol)) {
						// 		isAdd = isAdd + "体积未全配上 "
						// 	}
						// }
					}
				}
        // addFlag是用于拉下按钮的disable，this.addFlag = false代表可以点击加货按钮，再次尝试进行加货操作
				this.addFlag = false
				return isAdd
			},
			setNum (val) {
				this.wbData.wbPrefix = val.WBPREFIX
				this.wbData.wbNo = val.WBNO
				this.wbData.wbId = val.ID
				this.pullData.minusnum = val.NUM
        this.uldPull.minusnum = val.NUM
				this.pullData.minusvol = val.VOL
        this.uldPull.minusvol = val.VOL
				this.pullData.minuswgt = val.WGT
        this.uldPull.minuswgt = val.WGT
				this.getWeight()
				this.getisFstWb()
			},
			format (val) {
				for (let i = 0; i < this.statusArray.length; i++) {
					if (this.statusArray[i].TYPECODE === val) {
						return this.statusArray[i].TYPENAME
					}
				}
			},
      // 获取航班的目的站
			getDestination (changeFlag) {
        // 若有一个为空，则不进行判断，直接退出
        if (!this.form.flight || !this.form.carrier ) {
          return
        }
        
        return new Promise( (resolve, reject) => {
          let data = deepCopy(this.form)
          data.flightDate = dayjs(data.flightDate).valueOf()
          uni.showLoading({
            title:'正在获取目的站点信息'
          })
          getFlightStations(data).then(res => {
            uni.hideLoading()
          	if (res.status) {
          		if (res.data) {
                // 如果有返回，则需要清空目的地信息
                this.positionArray = []
          			if (res.data.length > 0) {
                  // 若有目的站，此时可以点击（设置destinationEnable为true
                  this.destinationEnable = true
          				for (let i = 0; i < res.data.length; i++) {
          					this.positionArray.push(res.data[i].STATIONS)
          				}
                  // this.$message('获取对应航班目的站列表成功')
                  // 如果是修改航班、日期触发获取目的站函数的情况
                  if (changeFlag) {
                    // origin是起始站，由于业务原因，起始站均为MXN。所返回的信息并没有起止站的选择。
                    this.form.origin = "XMN"
                    this.form.destination = this.positionArray[0]
                  }
          			} else {
                  this.destinationEnable = false
                  this.$message('该航班无目的站，请重新填写航班/日期')
                  // 如果是修改航班、日期触发获取目的站函数的情况
                  if (changeFlag) {
                    this.form.destination = ''
                  }
                }
          		}
          	} else {
              this.destinationEnable = false
          		this.$message(res.message)
          	}
            resolve(res)
          })
        })
			},
      // 用于判断是否已截关，若已截关则,res.data的值为1
      getIsrewgtoff() {
				let data = deepCopy(this.form)
				data.uldCode = data.uldType + data.uldNo + data.uldNoSuffix
        
        return new Promise( (resolve, reject) => {
          getReWeighOff(data).then(res => {
          	if(res.data !== null) {
              // 会直接修改isrewgtoff，其他地方也使用isrewgtoff进行判断是否已截关
              // res.data 若为 1则为已截关
          		this.isrewgtoff = res.data
              resolve(res)
          	} else {
              reject(res)
            }
          })
        })
			},
      // 输入运单号后，用于获取加货数据的信息
			getWeight () {
				if (this.wbData.wbPrefix && this.wbData.wbNo && this.wbData.wbNo.length == 8 && model7(this.wbData.wbPrefix, this.wbData.wbNo) ) {
					let data = deepCopy(this.wbData)
					data.airwaybill = data.wbPrefix + data.wbNo
          // 获取加货信息，返回的信息为可加货的最大数量、体积、重量
					selectairwaybillmsg(data).then(res => {
						if (res.status && res.data) {
							this.addData.addnum = res.data.list.NUM
							this.addData.addvol = res.data.list.VOL
							this.addData.addwgt = res.data.list.WGT
              // 保存加货的数量、体积、重量上线
							this.uldAdd = deepCopy(this.addData)
						} else {
							this.$message(res.message)
						}
					})
					this.getisFstWb()
				}
			},
      // 修改了件数之后，进行加货重量、体积计算（按照百分比计算）
      // 一下为修改距离     num vol wgt
      // 初始num为6          6   4   8
      // num修改为3          3   2   4
      // 可见vol于wgt随着num进行了变化，都为原本的0.5倍
			changeAddWeight () {
        if (Number(this.addData.addnum) % 1) {
          this.$message('件数仅能为整数')
          return
        }
        console.log('进入了changeAddWeight');
				if (this.addData.addnum === this.uldAdd.addnum) {
          console.log('件数没有修改');
					this.addData.addvol = this.uldAdd.addvol
					this.addData.addwgt = this.uldAdd.addwgt
          return
				} 
        
        console.log('件数修改修改重量');
        // 如果uld可添加件数不为0，且有可添加的件数
        console.log(this.uldAdd.addnum);
				if (this.uldAdd.addnum !== '0' && this.uldAdd.addnum) {
          console.log('件数修改修改重量2');
          // this.addData.addvol = (this.uldAdd.addvol * (this.addData.addnum / this.uldAdd.addnum)).toFixed(4)
					// this.addData.addwgt = (this.uldAdd.addwgt * (this.addData.addnum / this.uldAdd.addnum)).toFixed(2)
          this.addData.addvol = (this.uldAdd.addvol * (this.addData.addnum / this.uldAdd.addnum)).toFixed(1)
          this.addData.addwgt = (this.uldAdd.addwgt * (this.addData.addnum / this.uldAdd.addnum)).toFixed(0)
				}
				
			},
      // 修改了件数之后，进行拉下重量、体积计算（按照百分比计算）
      // 一下为修改距离     num vol wgt
      // 初始num为6          6   4   8
      // num修改为3          3   2   4
      // 可见vol于wgt随着num进行了变化，都为原本的0.5倍
			changePullWeight () {
        if (Number(this.pullData.minusnum) % 1) {
          this.$message('件数仅能为整数')
          return
        }
        console.log('进入了changePullWeight');
				if (this.pullData.minusnum === this.uldPull.minusnum) {
          console.log('changePullWeight 件数没有改变');
					this.pullData.minusvol = this.uldPull.minusvol
					this.pullData.minuswgt = this.uldPull.minuswgt
				} else {
          console.log('changePullWeight 件数改变了');
					if (this.uldPull.minusnum !== '0' && this.uldPull.minusnum) {
            console.log('changePullWeight 件数改变了2');
						// this.pullData.minusvol = (this.uldPull.minusvol * (this.pullData.minusnum / this.uldPull.minusnum)).toFixed(4)
						// this.pullData.minuswgt = (this.uldPull.minuswgt * (this.pullData.minusnum / this.uldPull.minusnum)).toFixed(2)
            this.pullData.minusvol = (this.uldPull.minusvol * (this.pullData.minusnum / this.uldPull.minusnum)).toFixed(1)
            this.pullData.minuswgt = (this.uldPull.minuswgt * (this.pullData.minusnum / this.uldPull.minusnum)).toFixed(0)
					}
				}
			},
      // 通过uld号获取信息
			getULD () {
        // 在获取ULD时，将目的站设置为不可点击（在成功获取ULD后，会有getDestination操作，在getDestination中，若成功获取了目的站，将会吧destinationEnable设置为可点击）
        this.destinationEnable = false
        // 判断三个参数是否均填写完毕
				if (this.form.uldType && this.form.uldNo && this.form.uldNoSuffix) {
					let data = deepCopy(this.form)
					this.form = {
						uldType: data.uldType,
						uldNo: data.uldNo,
						uldNoSuffix: data.uldNoSuffix,
						uldFlightId: '',
						uldid: '',
						remark: '',
						uldAirport: '',
						shapeCode: '',
						packManCode: '',
						flightDate: this.currentDate,
						uldWeight: '',
						carrier: '',
						flight: '',
						loadVol: '0',
						uldStatus: '',
						origin: '',
						destination: ''
					}
					data.uldcode = data.uldType + data.uldNo + data.uldNoSuffix;
					selectuldmgt(data).then(res =>{
						if (res.status) {
							if (res.data.msg) {
								this.$message(res.data.msg)
							} else {
									let uldData = res.data.list[0]
									this.form.uldid = uldData.ID
                  // 获取复称重量
									this.getIsrewgtoff()
									this.form.uldAirport = uldData.ULD_AIRPORT
									this.form.uldWeight = uldData.ULD_WEIGHT
									this.form.uldStatus = uldData.ULD_STATUS
									if (res.data.list[1] != undefined) {
										let data = res.data.list[1]
										if (this.form.uldType === 'CAR') {
											this.form.loadVol = data.ULD_VOL
										} else {
											this.form.loadVol = '0'
										}
										this.form.shapeCode = data.SHAPE_CODE
										this.form.packMan = data.PACK_MAN
										this.form.remark = data.ULD_REMARK
										this.form.origin = data.ULD_ORIGIN
										if (!isEmptyNum(data.ULD_WGT)) {
											this.form.uldWeight = data.ULD_WGT
										}
										if (data.REWEIGH_OP != null) {
											this.$message('该车已经复称录入！')
										}
										if (data.FLIGHT_ID == null) {
											this.form.uldFlightId = data.FLIGHT_ID
										} else {
											this.form.uldFlightId = data.FLIGHT_ID_PRE
										}
										
									} else {
										this.form.loadVol = '0'
										this.form.flightDate = dayjs().format('YYYY-MM-DD')
									}
									if (res.data.list[2] !== undefined) {
										let flightData = res.data.list[2]
										if (flightData.FLIGHT_DATE != undefined) {
											this.form.flightDate = dayjs(flightData.FLIGHT_DATE).format('YYYY-MM-DD')
										}
										this.form.carrier = flightData.CARRIER
										this.form.flight = flightData.FLIGHT
                    this.form.destination = res.data.list[1].ULD_DESTINATION
                    // 获取目的地
                    this.getDestination()
									}
									this.list = res.data.wblist
								}
							}
					})
				}
			},
			save () {
				if (this.form.uldStatus !== '1' && this.form.uldStatus !== '2') {
					this.$message('该状态下不可保存')
				} else{
					let data = deepCopy(this.form)
					delete data.uldid
					delete data.flightDate
					data.flghtDate = this.form.flightDate
					data.uldId = this.form.uldid
					mysave(data).then(res => {
						if (res.status) {
							this.$message(res.data.message)
						} else {
							this.$message(res.message)
						}
					})
				}
			},
			clear () {
				this.wbData = {
					wbPrefix: '',
					wbNo: '',
					wbId: ''
				}
				this.addData = {
					addnum: '',
					addwgt: '',
					addvol: ''
				}
				this.pullData = {
					minusnum: '',
					minuswgt: '',
					minusvol: ''
				}
				this.uldAdd = {
					addnum: '',
					addwgt: '',
					addvol: ''
				}
				this.uldPull = {
					minusnum: '0',
					minuswgt: '0',
					minusvol: '0'
				}
			},
			reset () {
				this.isrewgtoff = '0', //是否复称截关
				this.isTrainSit = '0',
				this.positionArray = [],
				this.addFlag = false
				this.form = {
					uldFlightId: '',
					uldType: 'CAR',
					uldid: '',
					uldNo: '',
					uldNoSuffix: 'GN',
					remark: '',
					uldAirport: '',
					shapeCode: '',
					packManCode: '',
					flightDate: this.currentDate,
					uldWeight: '',
					carrier: '',
					flight: '',
					loadVol: '0',
					uldStatus: '',
					origin: 'XMN',
					destination: ''
				}
				this.clear()
				this.list = []
        
        // 回到顶部
        uni.pageScrollTo({
            scrollTop: 0,
            duration: 100
        });
			},
			hide () {
				this.modal = false
			},
			handleClick (e) {
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					// let data = deepCopy(this.form)
					// data.flightDate = dayjs(this.form.flightDate).valueOf()
					// putIn(data).then(res => {
					// 	let options = {
					// 		msg: res.message,
					// 		duration: 2000,
					// 		type: 'green'
					// 	}
					// 	this.modal = false
					// 	this.$refs.toast.showTips(options)	
					// })
				}
			},
			bindDateChange: function(e) {
				this.form.flightDate = e.target.value
        this.getDestination(true)
			},
      // 此方法似乎被遗弃 
			// positionChange (val) {
			// 	this.form.origin = val.detail.value
			// },
			positionChange2 (val) {
				this.form.destination = this.positionArray[val.detail.value]
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
		}
	}
</script>

<style lang="scss">
	page {
		padding-top: 140upx;
	}
.uld {
	.lableWidth {
		width: 150upx;
		height: 80upx;
		line-height: 80upx;
		padding: 0 0 0 30upx;
		font-size: 35upx;
	}
	.disable {
		background: #999999;
	}
	.lableWidth2 {
		width: 90upx;
		height: 80upx;
		line-height: 80upx;
		padding: 0 0 0 30upx;
		font-size: 35upx;
	}
	.uld-input {
		font-size: 35upx;
		text-align: center;
		border: solid 3upx #dbdbdb;
		width: 180upx;
		height: 80upx;
	}
	.uld-input2 {
		font-size: 35upx;
		text-align: center;
		border: solid 3upx #dbdbdb;
		width: 139upx;
		height: 80upx;
	}
	.uld-input3 {
		font-size: 35upx;
		text-align: center;
		border: solid 3upx #dbdbdb;
		width: 400upx;
		height: 80upx;
	}
	.uld-input4 {
		font-size: 35upx;
		text-align: center;
		border: solid 3upx #dbdbdb;
		width: 119upx;
		height: 80upx;
	}
	.pick-text {
		font-size: 35upx;
		text-align: center;
		line-height: 80upx;
		border: solid 3upx #dbdbdb;
		width: 267upx;
		height: 80upx;
	}
	.flight {
		width: 90upx;
		height: 80upx;
		line-height: 80upx;
		padding: 0 0 0 30upx;
		font-size: 35upx;
	}
	.uld-textarea {
		font-size: 35upx;
		border: solid 3upx #dbdbdb;
		height: 160upx;
		width: 683upx;
	}
	.content-head {
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
		.head-text {
			padding: 20upx 0 0 30upx;
			color: red;
		}
	}
	.content-middle {
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
		.mid-last {
			display: flex;
			margin-top: 20upx;
			color: #595959;
			font-size: 35upx;
			.num-input {
				font-size: 35upx;
				text-align: center;
				border: solid 3upx #dbdbdb;
				width: 176upx;
				height: 80upx;
				line-height: 80upx;
			}
		}
		.middle-data {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20upx;
			.uld-date {
				height: 80upx;
				width: 535upx;
				font-size: 35upx;
				text-align: center;
				line-height: 80upx;
				border: solid 3upx #dbdbdb;
			}
		}
		.middle-position {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20upx;
		}
		.middle-bottom {
			margin-top: 20upx;
			margin-left: 30upx;
		}
		.middle-btn {
			padding: 30upx 35upx 0 30upx;
			button {
				width: 100%;
				color: #0ebf9c;
				border:1px solid #0ebf9c
			}
		}
	}
	.content-bottom {
		margin-top: 10upx;
		font-size: 35upx;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		.bottom-top {
			margin-top: 20upx;
			padding-bottom: 20upx;
			display: flex;
			flex-direction: row;
			border-bottom: dashed 1upx #dbdbdb;
		}
		.bottom-middle {
			display: flex;
			flex-direction: row;
			margin-top: 20upx;
		}
		.bottom-btn {
			padding: 30upx 35upx 20upx 30upx;
			border-bottom: dashed 1upx #dbdbdb;
			.active-button {
				width: 100%;
				color: #0ebf9c;
				border:1px solid #0ebf9c
			}
      .disable-button {
      	width: 100%;
      	color: #aaaaaa;
      	border:1px solid #aaaaaa
      }
			.btn {
				padding-top: 20upx;
			}
		}
	}
	.contend {
		margin-top: 10upx;
		color: #595959;
		display: flex;
    flex-direction: row;
		.left {
      width: 250upx;
			.head {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 0;
				border: solid 2upx #e5e5e5;
				>text {
					text-align: center;
					font-size: 32upx;
				}
			}
			.list-item {
				background: #ffffff;
				padding: 30upx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 2upx #e5e5e5;
				>text {
					text-align: center;
					font-size: 32upx;
				}
			}
		}
		.right {
      width: 500upx;
			overflow-x: auto;
			.head {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30upx 0;
				width: 1400upx;
				border: solid 2upx #e5e5e5;
				>text {
					display: block;
					text-align: center;
					font-size: 32upx;
				}
			}
			.list-item {
				width: 1400upx;
				background: #ffffff;
				padding: 30upx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				border: solid 2upx #e5e5e5;
				>text {
					display: block;
					text-align: center;
					font-size: 32upx;
				}
			}
		}
	}
	.title {
	}
	.tab-class {
		margin-top: 10upx;
		font-size: 32upx;
		font-weight: bold;
		padding: 0 0 0 30upx;
	}
}
</style>
