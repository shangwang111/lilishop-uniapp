<template>
	<view>
		<view class="head-info d-flex align-items-center justify-content-center">
			今日SSD推荐价格 ￥ {{unitPrice}}
		</view>
		
		<view class="content">
			<view class="item">
				<view class="label-input">挂单类型</view>
				<radio-group class="item-input" @change="typeChange">
					<view class="item-info">
						<label style="width: 50%;" v-for="(item, index) in typeItems" :key="index">
							<radio :value="item.value" style="transform: scale(0.7);" :checked="index == form.business"/>
							<text>{{ item.text }}</text>
						</label>
					</view>
				</radio-group>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">买卖数量</view>
				<input class="form-text" type="digit" v-model="form.salesVolume" placeholder="请输入SSD数量"/>
			</view>
			<view :class="outIshow">
				<view class="item">
					<view class="label-input">接收地址</view>
					<input class="form-text" type="text" v-model="form.acceptAddress" placeholder="接收通证地址"/>
				</view>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">价格</view>
				<input class="form-text" type="digit" v-model="form.price" placeholder="请输入价格"/>
			</view>

			
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">手机号</view>
				<input class="form-text" type="number" v-model="form.phoneNumber" placeholder="请输入手机号"/>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">微信号</view>
				<input class="form-text" v-model="form.wechatNumber" placeholder="请输入微信号"/>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">联系人</view>
				<input class="form-text" v-model="form.contacts" placeholder="请输入联系人"/>
			</view>
			<view class="split-line-1"></view>
			
			<view :class="inIsShow">
				<view class="item">
					<view class="label-input">银行卡号</view>
					<input class="form-text" type="number" v-model="form.bankNo" placeholder="银行卡号"/>
				</view>
				<view class="split-line-1"></view>
				<view class="item">
					<view class="label-input" >支付宝二维码</view>
					<u-upload :fileList="alipayFileArray" :header=" { accessToken: storage.getAccessToken() }" :action="action" width="150"
						@on-uploaded="alipayloaded" :max-count="1" :show-progress="false"></u-upload>
				</view>
				<view class="split-line-1"></view>
				<view class="item">
					<view class="label-input">微信收款二维码</view>
					<u-upload :fileList="wxFileArray" :header=" { accessToken: storage.getAccessToken() }" :action="action" width="150"
						@on-uploaded="weChatUploaded" :max-count="1" :show-progress="false"></u-upload>
				</view>
			</view>
			
		</view>
		<view class="uni-group">
			<button class="uni-button btn-submit" size="mini" @click="handleAdd">提交</button>
			<button class="uni-button btn-del" size="mini" type="warn" @click="handleDel">撤销</button>
		</view>
		<u-keyboard class="password-panel" @change="onChange" ref="uKeyboard" v-model="showKeyboard" @backspace="onBackspace" mode="number" :dot-enabled="false" :tooltip="false" default="">
			<view class="mt-40 mb-40 text-center" style="text-align: center;">
				{{ keyboardTitle }}
			</view>
			<view class="close" @click="handleClose">
				<image src="../../../static/icons/close.png" mode=""></image>
			</view>
			<view v-if="keyboardLevel == 0">
				<view class="mt-15 text-center" v-if="submitStatus == 1">
					数量
					<text class="fs-42 font-weight-500" style="margin-right: 10rpx;color: red;">
						{{ form.salesVolume }}
					</text>
					<text>个</text>, 挂单金额
					<text class="fs-42 font-weight-500" style="margin-right: 10rpx;color: red;">
						{{ form.price }}
					</text>
					<text>元</text>
				</view>
				<view class="text-center" style="color: red;"  v-if="submitStatus == 2">
					请输入密码“撤销”当前挂单
				</view>
			</view>
			<u-message-input class="mt-30" mode="box" :maxlength="6" :dot-fill="true" v-model="secondPassword" :disabled-keyboard="true" @finish="finish"></u-message-input>
		</u-keyboard>
	</view>
</template>

<script>
	import { md5 } from '@/utils/md5.js';
	import storage from "@/utils/storage.js";
	import { upload } from "@/api/common.js";
	import { getUserInfo } from "@/api/members";
	import { queryConfigureByType } from "@/api/mine-common.js";
	import { checkPassword, paymentPassword } from "@/api/login";
	import { insertPendingOrder, deletePendingOrder, updatePendingOrder, pendingOrderInformation } from "@/api/mine-poster.js";

	export default {
		data() {
			return {
				unitPrice: 0,
				alipayFileArray:[],
				wxFileArray:[],
				ssd: 0,
				action: upload, //图片上传地址
				storage,
				inIsShow:"domhide",
				outIshow:"domshow",
				typeItems: [
					{
						text: '买单',
						value: '0',
						checked: 'true'
					},
					{ 
						text: '卖单',
						value: '1'
					}
				],
				
				form: {
					contacts: null,
					phoneNumber: null,
					wechatNumber: null,
					salesVolume: null,
					price: null,
					business: 0,
					acceptAddress:"",
					bankNo:null,
					alipayCollectionCodeUrl:null,
					wxCollectionCodeUrl:null,
				},
				
				secondPassword: '',
				showKeyboard: false,
				keyboardTitle: '请输入密码',
				keyboardLevel: 0,
				password1: null,
				password2: null,
				unitPrice: 0,
				submitStatus: 0,
        searchHistoryList: []
			};
		},
		onLoad() {
			this.getData();
			this.getUnitPricee();
			this.getInfo();
			this.getBackNo();
		},
		methods: {
			getUnitPricee(){
				let self = this;
				queryConfigureByType({
					'type': 'unitPrice'
				}).then((res) => {
					if (res.data.success) {
						self.unitPrice = res.data.result;
					} 
				})
			},
			getData() {
				let self = this;
				pendingOrderInformation().then((res) => {
					if(res.data.success && res.data.result) {
						self.form = res.data.result;
						this.showChange(this.form.business);
						this.alipayFileArray.push({"url":self.form.alipayCollectionCodeUrl});
						this.wxFileArray.push({"url":self.form.wxCollectionCodeUrl});
					}
				})
			},
			getInfo(){
				getUserInfo().then((res) =>{
					if (res.data.success) {
						this.ssd = res.data.result.member.ssd;
					}
				})
			},
      getBackNo() {
			  let backNo = uni.getStorageSync('saveBankNo');
        if (backNo) {
          this.form.bankNo=JSON.parse(backNo);
        }
      },
			typeChange: function(evt) {
				this.form.business = evt.target.value;
				this.showChange(this.form.business);
			},
			showChange(business){
				if(business === '1' ){
					this.inIsShow = 'domshow';
					this.outIshow ='domhide';
				}else{
					this.inIsShow = 'domhide';
					this.outIshow ='domshow';
				}
			},
			handleClose() {
				this.showKeyboard = false;
			},
			onChange(val) {
				if (this.secondPassword.length < 6) {
					this.secondPassword += val;
				}
				if (this.secondPassword.length >= 6) {
					this.finish();
				}
			},
			//图片上传
			alipayloaded(lists) {
				let images = [];
				lists.forEach((item) => {
					images.push(item.response.result);
					this.form.alipayCollectionCodeUrl = images.join(",");
				});
			},
			//图片上传
			weChatUploaded(lists) {
				let images = [];
				lists.forEach((item) => {
					images.push(item.response.result);
					this.form.wxCollectionCodeUrl = images.join(",");
				});
			},
			handleDel() {
				let self = this;
				self.submitStatus = 2;
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
			},
			handleAdd() {
				let self = this;
				self.submitStatus = 1;
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
			},
			checkStatus() {
				if (!this.form.salesVolume || this.form.salesVolume <= 0) {
					this.showMsg('数量不能为空');
					return false
				}else if(this.form.business==0 && (!this.form.acceptAddress)){
					this.showMsg('买单接收地址不能为空');
					return false
				}else if(this.form.business==1 && this.form.salesVolume > this.ssd){
					this.showMsg('卖单数量不能大于拥有的SSD数量');
					return false
				}else if(!this.form.price || this.form.price <= 0 || ((this.form.price > (this.unitPrice * 1.1) || this.form.price < (this.unitPrice * 0.9) ))){
					this.showMsg('价格范围不能超过当日推荐价格上下的 10%');
					return false
				}else if(this.form.business==1 && (!this.form.bankNo && !this.form.alipayCollectionCodeUrl && !this.form.wxCollectionCodeUrl)){
					this.showMsg('银行卡号、支付宝收款码、微信收款码至少填写一个');
					return false
				}else if (!this.form.phoneNumber) {
					this.showMsg('手机号不能为空');
					return false
				}else if (!this.form.wechatNumber) {
					this.showMsg('微信不能为空');
					return false
				}else if (!this.form.contacts) {
					this.showMsg('联系人不能为空');
					return false
				} else {
					return true
				}
			},
			showMsg(title){
				uni.showToast({
					title: title,
					icon: 'none',
					duration: 2000
				});
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
					if(self.submitStatus == 1) {
						this.addSubmit();
					} else if(self.submitStatus == 2) {
						this.delSubmit();
					}
				}

				//银行卡号保存
        uni.setStorageSync('saveBankNo',this.form.bankNo);
			},
			addSubmit() {
				let self = this;
				self.showKeyboard = false;
				self.submitStatus = 0;
				self.form.secondPassword = md5(self.secondPassword);
				
				delete self.form.id;
				uni.showLoading({
					title: "正在提交...",
				});
				insertPendingOrder(self.form).then((res) => {
					uni.hideLoading();
					self.showKeyboard = false;
					if (res.data.success) { 
						self.keyboardLevel = 0;
						uni.navigateBack()
					} 
				});
			},
			delSubmit() {
				let self = this;
				self.submitStatus = 0;
				self.form.secondPassword = md5(self.secondPassword);
				uni.showLoading({
					title: "正在撤销...",
				});
				deletePendingOrder().then((res) => {
					uni.hideLoading();
					self.showKeyboard = false;
					if (res.data.success) { 
						self.keyboardLevel = 0;
						uni.navigateBack()
					} 
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head-info {
		background-color: #fff;
		height: 80rpx;
	}
	.domhide{display: none;}
	
	.domshow{display: block;}
	
	.content {
		width: 100%;
		background-color: #ffffff;
		border-radius: 20rpx;
		
		.item {
			padding: 40rpx 30rpx;
			display: flex;
			align-items: center;
			
			.item-info {
				display: flex;
				align-items: center;
				height: 80rpx;
				width: 100%;
				justify-content: space-around;
			}
			
			.label-input {
				font-size: 28rpx;
				font-weight: 700;
				width: 200rpx;
			}
			
			.item-input-radio {
				display: flex;
				align-items: center;
			}
			
			.item-input {
				width: calc(100% - 200rpx);
			}
		}
		
		
	}
	
	.uni-group {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 80rpx;
		padding: 30rpx;
		
		.uni-button {
			width: calc(50% - 20rpx);
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			border-radius: 40rpx;
			text-align: center;
		}

    .btn-submit {
      background: #FF573E;
    }
    .btn-del{
      background: #c0c0c0;
    }
		
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
</style>
