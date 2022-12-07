<template>
	<view class="pay">
		<view class="order-index" ref="container">
			<view class="donating">
				<view class="flexBox">
					<view class="item">
						<view class="title">可转数量</view>
						<view class="number">{{ssd.toFixed(4) || '0'}}</view>
					</view>
					<view class="item">
						<view class="title">冻结数量</view>
						<view class="number">{{frozenSSD.toFixed(4) || '0'}}</view>
					</view>
				</view>
				<view class="donatBox">	
					<view class="item">
						<view class="title">接收地址</view>
						<view class="t-info">
							<input v-model="acceptAddress" class="it" type="text" placeholder="请输入接收账户"  placeholder-style="font-size:34rpx;color:#C7C7C7;"/>
						<image class="scan" src="../../../static/icons/scan.png" mode="" @click="scan"></image>
						</view>
					</view>
					<view class="item">
						<view class="title">验证码</view>
						<view class="t-info verificationCode">
							<input type="number" placeholder="填写验证码" class="it" v-model="verificationCode" placeholder-style="font-size:34rpx;color:#C7C7C7;"/>
						</view>
					 
						<button class="code" @click="code">{{ verificationText }}</button>
					</view>
					<view class="item">
						<view class="title">转出数量</view>
						<view class="t-info">
							<input class="it" type="text" v-model="transferCount" />
							<text class="all" @click="handle_all()">转出全部</text>
						</view>
						<view class="td">
							<text>手续费 <text class="fs-32 font-weight-500 ml-10 mr-10"> {{ serviceCharge }} </text> SSD</text>
							<text>实际扣除 <text class="fs-32 font-weight-500 ml-10 mr-10"> {{ actualPrice }} </text> SSD</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="send mt-30" @click="handleSubmit()">转出</view>
			
			<view class="detailed text-center fs-24 mt-20" @click="handleDetail">查看转入转出明细</view>
		</view>
		
		<u-keyboard class="password-panel" @change="onChange" ref="uKeyboard" v-model="showKeyboard" @backspace="onBackspace" mode="number" :dot-enabled="false" :tooltip="false" default="">
			<view class="mt-40 mb-40 text-center" style="text-align: center;">
				{{ keyboardTitle }}
			</view>
			<view class="close" @click="handleClose">
				<image src="../../../static/icons/close.png" mode=""></image>
			</view>
			
			<view v-if="keyboardLevel == 0">
				<view class="mt-30 text-center fs-28">本次转出</view>
				<view class="mt-15 text-center">
					<text class="fs-48 font-weight-500" style="margin-right: 10rpx;">{{transferCount || '0'}}</text>
					<text>SSD</text>
				</view>
			</view>
			<u-message-input class="mt-30" mode="box" :maxlength="6" :dot-fill="true" v-model="secondPassword" :disabled-keyboard="true" @finish="finish"></u-message-input>
		</u-keyboard>
		
	</view>
</template>

<script>
	import { md5 } from '@/utils/md5.js';
	import { transferAccounts } from "@/api/mine-transfer.js";
	import { queryConfigureByType } from "@/api/mine-common.js";
	import { sendMobile, checkPassword, paymentPassword } from "@/api/login";
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
		name: 'donating',
		data() {
			return {
				userInfo: null,
				verificationCode: "",
				acceptAddress: '',
				transferCount: null,
				secondPassword: '',
				frozen: '',
				verificationText: '获取验证码',
				countdown: -1,
				addressCode: '',
				showKeyboard: false,
				keyboardTitle: '请输入密码',
				keyboardLevel: 0,
				password1: null,
				password2: null,
				serviceCharge: 0,
				ssd: 0,
				frozenSSD: 0,
			};
		},
		onShow() {
			this.userInfo = this.$options.filters.isLogin();
			if(this.userInfo) {
				this.ssd = getFloat(this.ssd - this.frozenSSD, 4);
				this.frozen = getFloat(this.frozenSSD, 4);
			}
			// #ifdef H5
			let acceptAddress = getApp().globalData.acceptAddress;
			if(acceptAddress) {
				this.acceptAddress = acceptAddress;
				getApp().globalData.acceptAddress = '';
			}
			// #endif
			this.getInfo();
			
		},
		computed: {
			actualPrice() {
				return parseFloat(this.serviceCharge) + parseFloat(this.transferCount || 0);
			}
		},
		watch: {
			countdown(newVal, oldVal) {
				if(newVal == -1) {
					this.verificationText = '获取验证码';
				}
				else if(newVal > 0) {
					this.verificationText = '剩余 '+ newVal +'s';
				}
				else {
					this.verificationText = '重新获取';
				}
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
			acceptAddress(newVal, oldVal) {
				this.getServiceCharge();
			},
		},
		methods:{
			getServiceCharge() {
				let self = this;
				let acceptAddress = this.acceptAddress;
				if(acceptAddress != null) {
					queryConfigureByType({
						'type': 'serviceCharge',
						'acceptAddress': acceptAddress
					}).then((res) => {
						if (res.data.success) {
							self.serviceCharge = res.data.result;
						} 
					})
				}
			},
			getInfo(){
				getUserInfo().then((res) =>{
					if (res.data.success) {
						this.ssd = res.data.result.member.ssd;
						this.frozenSSD = res.data.result.member.frozenSSD;
					}
				})
			},
			async code() {
				uni.showLoading({});
				let res = await sendMobile(this.userInfo.member.username);
				uni.hideLoading();
				if (!res.data.success) {
					uni.showToast({
						title: res.data.message,
						duration: 2000,
						icon: "none",
					});
				}
				
				this.countdown = 60;
				this.getCountdown();
			},
			getCountdown() {
				let self = this;
				setTimeout(() => {
					if(self.countdown > 0) {
						self.countdown--;
						self.getCountdown();
					}
				}, 1000)
			},
			scan() {
				//#ifdef H5
					uni.navigateTo({
						url: '/pages/mine/transfer/scan'
					})
				//#endif
				//#ifndef H5
				uni.scanCode({
					success: (res) => {
						this.acceptAddress = res.result
					}
				})
				//#endif
			},
			getInputVerification(val) {
				var self = this;
				if(val.length == 6) {
					self.secondPassword = val
				}
			},
			getInputVerification(val) {
				var self = this;
				
				if(val.length == 6) {
					self.secondPassword = val
				}
			},
			onBackspace(e) {
				if (this.secondPassword.length > 0) {
					this.secondPassword = this.secondPassword.substring(0, this.secondPassword.length - 1);
				}
			},
			handle_all() {
				this.transferCount = this.ssd.toFixed(4);
			},
			checkStatus() {
				var self = this;
				if (!self.acceptAddress) {
					uni.showToast({
						title: '接受账户不能为空',
						icon: 'none',
						duration: 2000
					});
					return false
				}
				else if (0 > +self.transferCount) {
					uni.showToast({
						title: '数量需要大于0',
						icon: 'none',
						duration: 2000
					});
					return false
				} else if( +self.transferCount > +self.ssd ) {
					uni.showToast({
						title: '输入数量不超过可捐数量',
						icon: 'none',
						duration: 2000
					});
					return false
				} else {
					return true
				}
			},
			handleDetail() {
				uni.navigateTo({
					url: '/pages/mine/transfer/transferLogs'
				})
			},
			onChange(val) {
				if (this.secondPassword.length < 6) {
					this.secondPassword += val;
				}
				if (this.secondPassword.length >= 6) {
					this.finish();
				}
			},
			finish() {
				let self = this;
				let password = self.secondPassword;
				if(self.keyboardLevel == 1) {
					self.password1 = password;
					self.keyboardLevel = 2;
					self.secondPassword='';
				}
				else if(self.keyboardLevel == 2) {
					self.password2 = password;
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
					uni.showLoading({
						title: "正在转出",
					});
					transferAccounts({
						'acceptAddress': self.acceptAddress,
						'secondPassword': md5(self.secondPassword),
						'transferCount': self.transferCount,
						'verificationCode': self.verificationCode
					}).then((res) => {
						uni.hideLoading();
						if (res.data.success) {
							self.$nextTick(() => {
								getUserInfo().then((user) => {
									if (user.data.success) {
										storage.setUserInfo(user.data.result);
										self.userInfo = user.data.result;
										uni.navigateBack();
									}
								});
							})
						}
					});
				}
				
			},
			handleClose() {
				this.showKeyboard = false;
			},
			handleSubmit() {
				let self = this;
				if(self.checkStatus()) {
					uni.showLoading({
						title: "加载中...",
					});
					checkPassword().then((res) => {
						uni.hideLoading();
						if (res.data.success) { 
							if(res.data.result) {
								self.keyboardLevel = 0;
							} else {
								self.keyboardLevel = 1;
							}
							self.showKeyboard = true;
							self.secondPassword='';
						}
					});
				}
				
			},
			
		}
	};
</script>

<style lang="scss" scoped>
.pay {
	background-color: #FF573E;
	min-height: 100vh;
	padding: 50rpx 30rpx;
	
}

.donating {
	padding-bottom: 30rpx;
	background: url("/static/img/account_bg.png") no-repeat;
	background-size: 100% 100%;
	padding-top:20rpx;
	border-radius: 10rpx;
	z-index: 2;
	
	.flexBox{
		display: flex;
		padding: 0 60rpx;
		
		.item{
			flex:1;
			text-align: center;
			padding:  12rpx 16rpx;
			
			.title{
				text-align: center;
				color:#808080;
				font-size: 36rpx;
			}
			
			.number{
				text-align: center;
				color:#FF573E;
				font-size:56rpx;
			}
		}
	}
	
	.donatBox{
	  margin-top: 40rpx;
	}
	
	.item {
		padding:  40rpx;
		
		.td {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			color: #EB5659;
			padding-bottom: 20rpx;
			margin-top: 10px;
		}
		
		.title {
			font-size: 40rpx;
			padding-bottom: 20rpx;
			text-align: left;
			color: #222;
		}
		
		.t-info {
			display: flex;
			align-items: center;

			.it {
				border-bottom: 1px solid #d1d1d1;
				padding: 6rpx 20rpx;
				height: 70rpx;
				font-size: 34rpx;
				flex: 1;
				color: #000000;
				text-align: left;
			}
		}
		
		.verificationCode{
			width: calc(100% - 130px);
			display: inline-block;
			margin-right: 5px;
		}
		
		.all {
			font-size: 34rpx;
			color: #fff;
			width: 100px;
			height: 70rpx;
			border-radius: 3px;
			background-image: -webkit-linear-gradient(left, #FF573E 0%, #FF573E 100%);
			background-image: linear-gradient(to right, #FF573E 0%, #FF573E 100%);
			background-image: -webkit-linear-gradient(to right, #FF573E 0%, #FF573E 100%);
			background-image: -moz-linear-gradient(to right, #FF573E 0%, #FF573E 100%);
			text-align: center;
			line-height: 70rpx;
			margin-left: 10px;
		}
	}
	
	.notice {
		padding: 15rpx;
		background-color: #eee;
		font-size: 12px;
		margin: 7px;
		border-radius: 10rpx;
	}
	
	.btn {
		padding-bottom: 30rpx;
		justify-content: center;
		text-align: center;
		margin: 0 7px; 
		
	}
	
	.second-wrapper {
		background-color: #fff;
		height: 90rpx;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		padding-top: 20rpx;
		width: 520rpx;
		
		.p-title {
			text-align: center;
			font-size: 14px;
			font-weight: bold;
			// margin: 20rpx 0;
			display: block;
			border-radius: 0;
			// padding-top: 40rpx;
		}
		
		.content {
			background-color: #fff;
			padding-left: 20rpx;
		}
		
		.p-btns {
			display: flex;
			background-color: #fff;
			padding: 20rpx 0;
			border-bottom-right-radius: 10rpx;
			border-bottom-left-radius: 10rpx;
			
			.cancel {
				font-size: 12px;
				height: 25px;
				text-align: center;
				border-radius: 25rpx;
				line-height: 25px;
				background-color: #eb3729;
				color: #fff;
				display: inline-block;
				flex: 1;
				margin: 0 40rpx;
			}
		}
	}
	
	 
}
.send {
	width: calc(100% - 30px);
	font-size: 38rpx;
	color: #FF573E;
	height: 100rpx;
	border-radius: 56rpx;
	text-align: center;
	text-align: center;
	line-height: 100rpx;
	background-color: #fff;
	margin-left: auto;
	margin-right: auto;
}

.code {
    width: 125px;
	display: inline-block;
	height: 35px;
	background-image: -webkit-linear-gradient(left, #FF573E 0%, #FF573E 100%);
	background-image: linear-gradient(to right, #FF573E 0%, #FF573E 100%);
	background-image: -webkit-linear-gradient(to right, #FF573E 0%, #FF573E 100%);
	background-image: -moz-linear-gradient(to right, #FF573E 0%, #FF573E 100%);
	border-radius: 3px;
	color: #fff;
	line-height: 35px;
	text-align: center;
	font-size: 34rpx;
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

.scan {
	margin-bottom: 10rpx;
	width: 50rpx;
	height: 50rpx;
}

	
.detailed {
	color: #F3F4F6;
	text-decoration:underline;
}
</style>
