<template>
	<view class="box">
		<view class="box-tips">
			<h2 class='h2'>
				{{verificationTitle[showKeyboard==false ? 0 : 1].title}}
			</h2>
			<view class="verification">{{verificationTitle[step].desc}}</view>
		</view>
		<view class="form">
			<u-form :model="codeForm" ref="validateCodeForm">
				<view>
					<u-form-item label-width="120" label="手机号" prop="mobile">
						<u-input maxlength="11" v-model="codeForm.mobile" placeholder="请输入您的手机号" />
					</u-form-item>

					<u-form-item class="sendCode" label-width="120" prop="code" label="验证码">
						<u-input v-model="codeForm.code" placeholder="请输入验证码" />
						<u-verification-code unique-key="page-edit" :seconds="seconds" @end="end" @start="start"
							ref="uCode" @change="codeChange"></u-verification-code>
						<view @tap="getCode" class="text-tips">{{ tips }}</view>
					</u-form-item>

					<view class="submit" @click="validatePhone">验证</view>
					<myVerification keep-running @send="verification" class="verification" ref="verification"
						business="FIND_USER" />
				</view>
				
				<u-keyboard class="password-panel" @change="onChange" ref="uKeyboard" v-model="showKeyboard" @backspace="onBackspace" mode="number" :dot-enabled="false" :tooltip="false" default="">
					<view class="mt-40 mb-40 text-center" style="text-align: center;">
						{{ keyboardTitle }}
					</view>
					<view class="close" @click="handleClose">
						<image src="@/static/icons/close.png" mode=""></image>
					</view>
					<u-message-input class="mt-30" mode="box" :maxlength="6" :dot-fill="true" v-model="password" :disabled-keyboard="true" @finish="finish"></u-message-input>
				</u-keyboard>
			</u-form>
		</view>
	</view>
</template>

<script>
	import {
		sendMobile,
		resetByMobile,
		modifyPass
	} from "@/api/login";

	import {
		md5
	} from "@/utils/md5.js"; // md5
	import myVerification from "@/components/verification/verification.vue"; //验证
	import uuid from "@/utils/uuid.modified.js";
	
	import {checkPassword, paymentPassword } from "@/api/login";
	
	export default {
		components: {
			myVerification,
		},
		data() {
			return {
				uuid,
				verificationTitle: [{
						title: "安全验证",
						desc: "请输入当前手机号进行安全验证",
					},
					{
						title: "设置密码",
						desc: "",
					}
				],
				step: 0, //当前验证步骤
				flage: false, //是否验证码验证

				codeForm: {
					mobile: "", //手机号
					code: "", //验证码
				},
				newPassword: "", //新密码
				confirmPassword: "", //确认密码
				showKeyboard: false,
				keyboardTitle: '请设置密码',
				keyboardLevel: 1,
				password: "", //密码
				tips: "", //提示
				seconds: 69, // 60s等待时间

				// 验证码登录校验
				codeRules: {
					mobile: [{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: "手机号码不正确",
						trigger: ["blur"],
					}, ],
					code: [{
						min: 4,
						max: 6,
						required: true,
						message: "请输入验证码",
						trigger: ["blur"],
					}, ],
				},
			};
		},
		watch: {
			flage(val) {
				if (val) {
		
					if (this.$refs.uCode.canGetCode) {
						uni.showLoading({
							title: "正在获取验证码",
						});
						sendMobile(this.codeForm.mobile, "FIND_USER").then((res) => {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							if (res.data.success) {
								this.$refs.uCode.start();
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
								this.flage = false;
								// this.$refs.verification.getCode();
							}
						})
					} else {
						this.$u.toast("请倒计时结束后再发送");
					}
				}
			},
			keyboardLevel(newVal, oldVal) {
				if(newVal == 1) {
					this.keyboardTitle = "设置密码"
				}
				else if(newVal == 2) {
					this.keyboardTitle = "确认密码"
				}
			},
		},
		onLoad() {
			let self = this;
			checkPassword().then((res) => {
				uni.hideLoading();
				if (res.data.success) { 
					if(res.data.result) { 
						uni.setNavigationBarTitle({
							title: '修改支付密码'
						});
					} else {
						uni.setNavigationBarTitle({
							title: '设置支付密码'
						});
					}
				}
			});
		},
		onReady() {
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
			this.$refs.validateCodeForm.setRules(this.codeRules);
		},
		methods: {
			
			onChange(val) {
				if (this.password.length < 6) {
					this.password += val;
				}
				if (this.password.length >= 6) {
					this.finish();
				}
			},
			onBackspace(e) {
				if (this.password.length > 0) {
					this.password = this.password.substring(0, this.password.length - 1);
				}
			},
			finish() {
				let self = this;
				let password = self.password;
				if(self.keyboardLevel == 1) {
					self.newPassword = password;
					self.keyboardLevel = 2;
					self.password='';
				}
				else {
					self.confirmPassword = password;
					if(self.newPassword == self.confirmPassword) {
						
						uni.showLoading({
							title: "正在设置密码",
						});
						paymentPassword({
							'paymentPassword': md5(self.confirmPassword)
						}).then((res) => {
							uni.hideLoading();
							if (res.data.success) { 
								uni.showToast({
									title: '设置成功',
									icon: 'none',
									duration: 1000
								});
								setTimeout(() => {
									let delta = 1;
									if(getCurrentPages().length == 2 && getCurrentPages()[getCurrentPages().length - 2].route == "pages/passport/login") {
										uni.switchTab({
										  url: "/pages/tabbar/home/index",
										});
									}
									if(getCurrentPages().length > 2 && getCurrentPages()[getCurrentPages().length - 2].route == "pages/passport/login") {
										delta = 2;
									}
									uni.navigateBack({
										delta: delta
									});
								})
							} 
							
							self.showKeyboard = false;
						});
						
					} else {
						self.keyboardLevel = 1;
						self.password = '';
						self.newPassword = '';
						self.confirmPassword = '';
						uni.showToast({
							title: '两次密码输入不一样，重新输入',
							icon: 'none',
							duration: 3000
						});
					}
				}
			},
			handleClose() {
				this.showKeyboard = false;
			},
			// 验证码验证
			verification(val) {
				this.flage = val == this.$store.state.verificationKey ? true : false;
			},

			// 验证手机号
			validatePhone() {
				let self = this;
				self.$refs.validateCodeForm.validate((valid) => {
					if (valid) {
						resetByMobile(self.codeForm).then((res) => {
							if (res.data.success) {
								self.showKeyboard = !self.showKeyboard;
								// 登录成功
								uni.showToast({
									title: "验证成功!",
									icon: "none",
								});
							}
						});
					}
				});
			},

			codeChange(text) {
				this.tips = text;
			},
			end() {
				this.flage = false;
			},
			/**判断是否是当前用户的手机号 */
			isUserPhone() {
				let flage = false;
				let user = this.$options.filters.isLogin();
				if (user.member.mobile != this.codeForm.mobile) {
					uni.showToast({
						title: "请输入当前绑定手机号",
						icon: "none",
					});
					flage = false;
				} else {
					flage = true;
				}

				return flage;
			},
			/**获取验证码 */
			getCode() {
				if (this.isUserPhone()) {
					if (!this.$u.test.mobile(this.codeForm.mobile)) {
						uni.showToast({
							title: "请输入正确手机号",
							icon: "none",
						});
						return false;
					}
					
					this.flage = true;
				}
			},
			start() {
				this.$u.toast("验证码已发送");
				this.flage = true;
			},
		},
	};
</script>
<style lang="scss" scoped>
	@import url("@/pages/passport/login.scss");

	/deep/ .u-form-item {
		margin: 40rpx 0;
	}

	.sendCode {
		/deep/ .u-form-item--right__content__slot {
			display: flex;
		}
	}

	.h2 {
		font-size: 40rpx;
		font-weight: bold;
	}

	page {
		background: #fff;
	}

	.box {
		padding: 80rpx 0;
		border-radius: 20rpx;
	}

	.submit {
		background: $light-color;
	}

	.box-tips {
		margin: 0 72rpx;
	}

	.verification {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
</style>
