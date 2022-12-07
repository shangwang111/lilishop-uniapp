<template>
	<view class="container">
		<view class="item d-flex">
			<view class="label">联系人：</view>
			<view class="value">{{ data.contacts }}</view>
		</view>
		<view class="item d-flex justify-content-space-between">
			<view class="d-flex">
				<view class="label">手机号码：</view>
				<view class="value">{{ data.phoneNumber }}</view>
			</view>
			<view class="copy" @click="copyValue(data.phoneNumber)">复制</view>
		</view>
		<view class="item d-flex justify-content-space-between">
			<view class="d-flex">
				<view class="label">微信号：</view>
				<view class="value">{{ data.wechatNumber }}</view>
			</view>
			<view class="copy" @click="copyValue(data.wechatNumber)">复制</view>
		</view>
		<view class="item d-flex">
			<view class="label">买卖数量：</view>
			<view class="value">{{ data.salesVolume }}</view>
		</view>
		<view class="item d-flex">
			<view class="label">价格：</view>
			<view class="value">{{ data.price }}</view>
		</view>
		
		<view :class="outIshow">
			
			<view class="item d-flex justify-content-space-between">
				<view class="d-flex">
					<view class="label">接收地址:</view>
					<view class="value">{{ data.acceptAddress }}</view>
				</view>
				<view class="copy" @click="copyValue(data.acceptAddress)">复制</view>
			</view>
		</view>
		
		<view :class="inIsShow">
			<view class="item d-flex justify-content-space-between">
				<view class=" d-flex">
					<view class="label">银行卡号:  </view>
					<view class="value">{{ data.bankNo }}</view>
				</view>
				<view class="copy" @click="copyValue(data.bankNo)">复制</view>
			</view>
			
			
			<view class="split-line-1"></view>
			<view class="item d-flex">
				<view class="label" >支付宝收款二维码  </view>
				<u-upload :fileList="alipayFileArray"  width="150" :deletable="false" :max-count="1" :show-progress="false"></u-upload>
			</view>
			
			<view class="item d-flex">
				<view class="label">微信收款二维码  </view>
				<u-upload :fileList="wxFileArray"   width="150" :deletable="false" :max-count="1" :show-progress="false"></u-upload>
			</view>
		</view>
		
		
		<!-- #ifdef H5 -->
		<a :href="'tel:'+ data.phoneNumber" style="text-decoration: none">
			<button class="btn-submit">联系他</button>
		</a>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<button class="btn-submit" @click="handleTel(data.phoneNumber)">联系他</button>
		<!-- #endif -->
	</view>
</template>

<script>
	
	import { contactInformation } from "@/api/mine-poster.js";
	
	export default {
		data() {
			return {
				username: null,
				data: {},
				alipayFileArray:[],
				wxFileArray:[],
				inIsShow:"domhide",
				outIshow:"domshow",
				contacts:null
			}
		},
		onLoad(options) {
			if(options && options.username) {
				this.username = options.username;
				this.getData();
			}
		},
		methods: {
			handleTel(tel) {
				uni.makePhoneCall({
					phoneNumber: tel, //电话号码
					success: function(e) {
					},
					fail: function(e) {
					}
				})
			},
			imgPreview(){
				uni.previewImage({
					indicator:"number",
					loop:true,
					urls: this.imgList
				})
			},
			copyValue(val) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000
						});
					}
				});
				
			},
			getData() {
				let self = this;
				let params = {
					username: this.username
				};
				contactInformation(params).then((res) => {
					if(res.data.success) {
						self.data = res.data.result;
						this.alipayFileArray.push({"url":self.data.alipayCollectionCodeUrl});
						this.wxFileArray.push({"url":self.data.wxCollectionCodeUrl});
						this.showChange(self.data.business)
					}
				})
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
		}
	}
</script>

<style lang="scss" scoped>
	.domhide{display: none;}
	.domshow{display: block;}
	
	.container {
		min-height: 100vh;
		background-color: #ffffff;
		padding: 60rpx 30rpx;
		
		.item {
			margin-bottom: 30rpx;
			line-height: 1.8;
			font-size: 32rpx;
			
			.label {
				font-weight: 700;
				color: $font-color-dark;
			}
			
			.value {
				color: $font-color-base;
			}
			
			.copy {
				padding: 0 20rpx;
				border: 2rpx $border-color-dark solid;
				color: $font-color-base;
				border-radius: 10rpx;
				line-height: 50rpx;
				height: 50rpx;
				font-size: 24rpx;
			}
		}
		
		
		.btn-submit {
			margin-top: 150rpx;
			width: calc(100vw - 60rpx);
			height: 100rpx;
			background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
			font-size: 40rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 100rpx;
			border-radius: 50rpx;
			text-align: center;
		}
		
		
	}
</style>
