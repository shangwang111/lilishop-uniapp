<template>
	<view class="pay">
		<view class="order-index" ref="container">
			<view class="wrapper">
				<view class="title pt-20">
					商户信息
				</view>
				<view class="attention">单笔充值最小到账数量:0.00000001,低于该数量充币将不会到账</view>
				<view class="title-box" v-if="isShow">
					<tki-qrcode v-if="isShow" style="margin: 0 auto;" ref="qrcode" :cid="cid" :val="val" :size="size" background="#fff" :loadMake="loadMake"/>
				</view>
				<view class="title-text">扫描二维码付款</view>
				<view class="text">
					{{text}}
				</view>
			</view>
			<view @click="copy()">
				<text class="c-btn">点击复制内容</text>
			</view>
			<view class="detailed text-center fs-24 mt-20" @click="handleDetail">查看转入转出明细</view>
		</view>
	</view>
</template>

<script>
	const NAME = 'pay';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	import { getUserInfo } from "@/api/members";
	import storage from "@/utils/storage.js";
	
	export default {
		name: NAME,
		props: {},
		components: {
			tkiQrcode
		},
		data: function() {
			return {
				cid: 'qrcode',
				val: '',
				size: 450,
				result: '',
				loadMake: true,
				text: '',
				isShow: false,
			};
		},
		created: function() {
			this.init()
		},
		methods: {
			init(){
				this.userInfo = this.$options.filters.isLogin();
				if(this.userInfo && this.userInfo.member) {
					this.text = this.userInfo.member.blockAddress;
					this.val = this.userInfo.member.blockAddress;
					this.isShow = true
				}
			},
			copy() {
				var self = this;
				uni.setClipboardData({
					data: self.text,
					success: function() {
					}
				 });
				uni.showToast({
					title: '复制成功',
					icon: 'none',
					duration: 2000
				});
			},
			handleDetail() {
				uni.navigateTo({
					url: '/pages/mine/transfer/transferLogs'
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
.pay {
	background-color: #FF573E;
	min-height: 100vh;
	padding: 50rpx 30rpx;
	
	
	.wrapper {
		padding-bottom: 30rpx;
		background: url("/static/img/account_bg.png") no-repeat;
		background-size: 100% 100%;
		
		.d-input {
			display: flex;
			padding: 0 40rpx;
			
			.input {
				flex: 1;
				border: 1px solid #dcdfe6;
				color: #606266;
				padding: 0 14px;
				height: 50rpx;
				line-height: 50rpx;
				vertical-align: middle;
				border-radius: 5px;
				font-size: 10px;
			}
			
			.btn {
				font-size: 24rpx;
				color: #fff;
				width: 120rpx;
				height: 50rpx;
				border-radius: 6rpx;
				background-image: linear-gradient(to right, #409eff 0%, #409eff 100%);
				background-image: -webkit-linear-gradient(to right, #409eff 0%, #409eff 100%);
				background-image: -moz-linear-gradient(to right, #409eff 0%, #409eff 100%);
				text-align: center;
				line-height: 50rpx;
				margin-left: 20rpx;
			}
		}
		
		.attention {
			padding: 10rpx 0;
			color: #FF573E;
			font-size: 28rpx;
			text-align: center;
			padding:0 20px;
			margin-top: 6px;
		}
		
		.btns {
			display: flex;
			justify-content: space-around;
			text-align: center;
			
			.b-pay {
				width: 180rpx;
				font-size: 24rpx;
				color: #fff;
				padding: 0 60rpx;
				height: 50rpx;
				text-align: center;
				border-radius: 6rpx;
				background-color: #409eff;
				text-align: center;
				line-height: 50rpx;
				margin-left: 20rpx;
			}
			
			.b-list {
				width: 180rpx;
				font-size: 24rpx;
				color: #fff;
				padding: 0 60rpx;
				height: 50rpx;
				text-align: center;
				border-radius: 6rpx;
				text-align: center;
				line-height: 50rpx;
				margin-left: 20rpx;
				background-color: #dd0a20;
				background-image: -webkit-linear-gradient(top, #ea1e4c, #dd0a20);
				background-image: -moz-linear-gradient(top, #ea1e4c, #dd0a20);
				background-image: -o-linear-gradient(top, #ea1e4c, #dd0a20);
				background-image: linear-gradient(top, #ea1e4c, #dd0a20);
			}
			
		}
	}
	.pay-wrapper {
		
		.qr {
			text-align: center;
			image {
				width: 350rpx;
				height: 350rpx;
			}
		}
		
		.name {
			text-align: center;
		}
		
		.code {
			text-align: center;
		}
		
	}
	
	.title{
		text-align: center;
		color:#808080;
		font-size:34rpx;
	}
	
	.title-box {
		display: flex;
		margin-top: 120rpx;
		position: relative;
	}
	
	.title-text {
		margin-top: 20rpx;
		text-align: center;
		color:#FF573E;
		font-size: 34rpx;
		font-weight: 700;
	}
	
	.text {
		font-size: 12px;
		color: #222222;
		margin: 30rpx;
		text-align: center;
	}
	
	.c-btn {
		display: block;
		width: calc(100% - 30px);
		font-size: 38rpx;
		color: #FF573E;
		height: 100rpx;
		text-align: center;
		border-radius: 56rpx;
		text-align: center;
		line-height: 100rpx;
		margin-left: 20rpx;
		background-color: #fff;
		margin: 0 auto;
		font-weight: 500;
		margin-top: 60rpx;
	}
	
	.detailed {
		color: #F3F4F6;
		text-decoration:underline;
	}
}
.order-index .wrapper .title {
	margin-bottom: 0;
}

.payDetail {
	padding-top: 40px;
	font-size: 12px;
	text-align: center;
	color: #dd0a20;
}
</style>
