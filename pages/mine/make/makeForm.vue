<template>
	<view class="container pb-120">
		<view class="content mb-70">
			<view class="form-group">
				<view class="form-label">类型</view>
				<input class="form-text" type="number" v-model="form.monetary" placeholder="金额"/>
			</view>
			<view class="form-group">
				<view class="form-label">店铺</view>
				<picker @change="bindPickerStoreChange" :value="storeIndex" :range="storeNames">
					<view class="form-text">{{ storeNames[storeIndex] }}</view>
				</picker>
				<view class="arrow-right"></view>
			</view>
			<view class="form-group">
				<view class="form-label">让利比例</view>
				<picker @change="bindPickerChange" :value="surrenderRatioIndex" :range="surrenderRatioDescs">
					<view class="form-text">{{ surrenderRatioDescs[surrenderRatioIndex] }}</view>
				</picker>
				<view class="arrow-right"></view>
			</view>
			<view class="form-group">
				<view class="form-label">让利金额</view>
				<input class="form-text" disabled type="text" v-model="form.surrenderPrice" placeholder="金额"/>
			</view>
			<view class="form-group">
				<view class="form-label">手机号码</view>
				<input class="form-text" type="text" v-model="form.vipPhone" placeholder="输入会员手机号"/>
			</view>
			<view class="desc fs-28 mt-20">今日SSD价格：{{ unitPrice }} </view>
		</view>
		
		<view class="tip-info fs-28" v-show="ssd > 0">本次做单大约需要 {{ ssd }}(SSD)</view>
		<view class="tips">
			<!-- <u-checkbox-group :icon-size="24" width="45rpx"> -->
			<!--	<u-checkbox
					shape="circle"
					v-model="enablePrivacy"
					active-color="#FF5E00"
				></u-checkbox>-->
		<!-- 	</u-checkbox-group> -->
			<!--<text style="color: #FF573E;margin-left: -15rpx">本单属额外赠送，绝无虚假消费或加价消费行为，如有以上行为，本人愿意承担一切后果！ </text>-->
		</view>
		
		
		<view class="btn-submit" @click="handleSubmit">确认让利</view>
		<u-keyboard class="password-panel" @change="onChange" ref="uKeyboard" v-model="showKeyboard" @backspace="onBackspace" mode="number" :dot-enabled="false" :tooltip="false" default="">
			<view class="mt-40 mb-40 text-center" style="text-align: center;">
				{{ keyboardTitle }}
			</view>
			<view class="close" @click="handleClose">
				<image src="../../../static/icons/close.png" mode=""></image>
			</view>
			<view v-if="keyboardLevel == 0">
				<view class="mt-30 text-center fs-28">本次做单需要</view>
				<view class="mt-15 text-center">
					<text class="fs-48 font-weight-500" style="margin-right: 10rpx;">
						{{ ssd }}
					</text>
					<text>SSD</text>
				</view>
			</view>
			
			
			<u-message-input class="mt-30" mode="box" :maxlength="6" :dot-fill="true" v-model="secondPassword" :disabled-keyboard="true" @finish="finish"></u-message-input>
		</u-keyboard>
	</view>
</template>

<script>
	import { md5 } from '@/utils/md5.js'
	import { makeAccount, getStoreList } from "@/api/mine-make.js";
	import {checkPassword, paymentPassword } from "@/api/login";
	import { queryConfigureByType } from "@/api/mine-common.js";
	import { getUserInfo } from "@/api/members";
	import storage from "@/utils/storage.js";
	
	let getFloat = function(number, n) {
		n = n ? parseInt(n) : 0;
		if(n <= 0) {
			return Math.round(number);
		}
		number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
		return number;
	};
	
	export default {
		data() {
			return {
				userInfo: null,
				surrenderRatioIndex: 9,
				surrenderRatios: [0.1, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01],
				surrenderRatioDescs: ['10%','9%','8%','7%','6%','5%','4%','3%','2%','1%'],
				storeIndex: 0,
				storeIds: [],
				storeNames: [],
				enablePrivacy: false,
				form: {
					monetary: null,
					merId: 0,
					merName: null,
					surrenderRatio: 0.01,
					surrenderPrice: 0,
					vipPhone: null,
					secondPassword: null,
					wantPrice: null
				},
				secondPassword: '',
				showKeyboard: false,
				keyboardTitle: '请输入密码',
				keyboardLevel: 0,
				password1: null,
				password2: null,
				unitPrice: 0,
			};
		},
		computed: {
			ssd() {
				if(this.unitPrice > 0) {
					return getFloat(parseFloat(this.form.surrenderPrice) / parseFloat(this.unitPrice), 8);
				}
				return 0;
			}
		},
		watch: {
			storeIndex(newVal, oldVal) {
				this.form.merId = this.storeIds[newVal];
				this.form.merName = this.storeNames[newVal];
				console.log(this.form)
			},
			form: {
				handler(newObj, oldObj) {
					this.getSurrenderPrice();
				},
				immediate: true,
				deep: true
			},
			keyboardLevel(newVal, oldVal) {
				if(newVal == 0) {
					this.keyboardTitle = "请输入密码"
				}
				else if(newVal == 1) {
					this.keyboardTitle = "设置密码"
				}
				else if(newVal == 2) {
					this.keyboardTitle = "确认密码"
				}
			},
		},
		onShow() {
			this.init();
		},
		onBackspace(e) {
			if (this.secondPassword.length > 0) {
				this.secondPassword = this.secondPassword.substring(0, this.secondPassword.length - 1);
			}
		},
		methods: {
			getSurrenderPrice() {
				this.$nextTick(() => {
					this.form.surrenderPrice = this.form.monetary * (this.form.surrenderRatio * 100) / 100;
				})
			},
			async init() {
				let self = this;
				this.userInfo = this.$options.filters.isLogin();
				let res = await getStoreList();
				if (res.data.success) {
					let data = res.data.result;
					let storeIds = [];
					let storeNames = [];
					data.records.forEach(item => {
						storeIds.push(item.id);
						storeNames.push(item.storeName)
					})
					self.storeIds = storeIds;
					self.storeNames = storeNames;
					
					self.form.merId = self.storeIds[self.storeIndex];
					self.form.merName = self.storeNames[self.storeIndex];
				}
				self.form.surrenderPrice = self.form.monetary * self.form.surrenderRatio / 100;
				
				queryConfigureByType({
					'type': 'unitPrice'
				}).then((res) => {
					if (res.data.success) {
						self.unitPrice = res.data.result;
					} 
				})
			},
			bindPickerChange(e) {
				this.surrenderRatioIndex = e.target.value
				this.form.surrenderRatio = this.surrenderRatios[this.surrenderRatioIndex];
			},
			bindPickerStoreChange(e) {
				this.storeIndex = e.target.value
			},
			onChange(val) {
				if (this.secondPassword.length < 6) {
					this.secondPassword += val;
				}
				if (this.secondPassword.length >= 6) {
					this.finish();
				}
			},
			onBackspace(e) {
				if (this.secondPassword.length > 0) {
					this.secondPassword = this.secondPassword.substring(0, this.secondPassword.length - 1);
				}
			},
			checkStatus() {
				let self = this;
				let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!self.form.monetary) {
					uni.showToast({
						title: '消费金额不能为空',
						icon: 'none',
						duration: 2000
					});
					return false
				}else if(!reg.test(self.form.vipPhone)){
					uni.showToast({
						title: '手机号码不正确',
						icon: 'none',
						duration: 2000
					});
					return false
				}
				else if (self.merId > 0) {
					uni.showToast({
						title: '店铺不能为空',
						icon: 'none',
						duration: 2000
					});
					return false
				} else {
					return true
				}
			},
			finish() {
				let self = this;
				let secondPassword = self.secondPassword;
				if(self.keyboardLevel == 1) {
					self.password1 = secondPassword;
					self.keyboardLevel = 2;
					self.secondPassword='';
				}
				else if(self.keyboardLevel == 2) {
					self.password2 = secondPassword;
					if(self.password1 == self.password2) {
						
						uni.showLoading({
							title: "正在设置密码",
						});
						paymentPassword({
							'paymentPassword': md5(self.password2)
						}).then((res) => {
							uni.hideLoading();
							if (res.data.success) { 
								self.keyboardLevel = 0;
							} 
							
							self.showKeyboard = false;
						});
						
					} else {
						uni.showToast({
							title: '两次密码输入不一样，重新输入',
							icon: 'none',
							duration: 3000
						});
						self.keyboardLevel = 1;
						self.password1 = '';
						self.password2 = '';
					}
					self.secondPassword = '';
				}
				else {
					self.showKeyboard = false;
					self.form.secondPassword = md5(self.secondPassword);
					self.form.wantPrice = self.unitPrice;
					uni.showLoading({
						title: "正在提交...",
					});
					makeAccount(self.form).then((res) => {
						uni.hideLoading();
						self.showKeyboard = false;
						if (res.data.success) { 
							self.keyboardLevel = 0;
							self.$nextTick(() => {
								getUserInfo().then((user) => {
									if (user.data.success) {
										storage.setUserInfo(user.data.result);
										self.userInfo = user.data.result;
									}
								});
							})
							uni.navigateBack()
						} else {
              uni.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 3000
              });
            }
					});
				}
			},
			handleClose() {
				this.showKeyboard = false;
			},
			handleSubmit() {
				let self = this;

				// if (!self.enablePrivacy) {
				//   uni.showToast({
				//     title: "请同意做单声明！",
				//     duration: 2000,
				//     icon: "none",
				//   });
				//   return false;
				// }
				if(self.checkStatus()) {
          uni.showModal({
            title: '温馨提示',
            content: '本单属额外赠送，绝无虚假消费或加价消费行为，如有以上行为，本人愿意承担一切后果！ ',
            confirmColor:'#FF573E',
            success: function(res) {
              if (res.confirm) {
                // 执行确认后的操作
                uni.showLoading({
                  title: "加载中...",
                });
                checkPassword().then((res) => {
                  uni.hideLoading();
                  if (res.data.success) {
                    if(res.data.result) {
                      self.keyboardLevel = 0;
                    } else {
                      uni.navigateTo({
                        url: '/pages/mine/set/securityCenter/editPayPassword'
                      })
                      //self.keyboardLevel = 1;
                    }
                    self.showKeyboard = true;
                    self.secondPassword='';
                  }
                });
              }
              else {
                // 执行取消后的操作
              }
            }
          });
				}
				
			}
			
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: calc(100vh - 88rpx);
		background-color: #ffffff;
		
		.content {
			width: 100%;
			padding: 20rpx 40rpx;
			
	
		}
		.tips {
		  font-size: 12px;
		  margin-top: 10rpx;
      margin-bottom: 30rpx;
			margin-left: 45rpx;
		  width: 546rpx;
		  > span {
		    color: $light-color;
		  }
		}
		.form-group {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			border-bottom: 1rpx $border-color-dark solid;
			
			.form-label {
				width: 180rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
			}
			
			.form-text {
				margin-left: 30rpx;
				width: 504rpx;
				height: 120rpx;
				border-radius: 15rpx;
				line-height: 120rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #000000;
				padding: 0 114rpx 0 24rpx;
			}
			
			.arrow-right {
				position: absolute;
				right: 10rpx;
				width: 30rpx;
				height: 30rpx;
				background-image: url("/static/icons/arrow-right.png");
				background-size: cover;
				background-repeat: no-repeat;
			}
		}
		
		
		.desc {
			text-align: right;
			color: $main-color;
		}
		
		.tip-info {
			text-align: center;
			color: $main-color;
		}
		
		.password-panel {
			
			.close {
				position: absolute;
				left: 0;
				top: 10rpx;
				
				image {
					padding: 30rpx 20rpx;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		
		
		.btn-submit {
      width: calc(90% - 20rpx);
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      border-radius: 40rpx;
      text-align: center;
      background: #FF573E;
      margin:auto;
		}
		
		
	}
</style>
