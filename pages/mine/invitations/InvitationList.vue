<template>
	<view class="container">
		<view class="header">
			<view>
				<view>邀请人数</view>
				<view class="uni-top-2">{{ total }}</view>
			</view>
			<view v-if="isBind">
				<view>邀请我的人</view>
				<view class="uni-top-2">{{ userInfo.member.inviteeMobile }}</view>
			</view>
			<view v-else class="bind" @click="handleBind">绑定邀请人</view>
		</view>
		
		<view class="content">
			<view class="card-area">
				<view class="card-title">
					邀请记录
				</view>
				<view class="card-body" style="padding-top: 0;padding-bottom: 0;">
					<view v-for="(item, index) in list" :key="index">
						<view class="split-line-1" v-if="index > 0"></view>
						<view class="item fs-30 d-flex justify-content-space-between">
							<view class="title">{{ item.username }}</view>
							<view>{{ item.createTime }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center font-color-disabled">{{ loadStatus }}</view>
		
		<uni-popup ref="popupCellphone" type="center" :maskClick="true">
			<view class="popup">
				<view class="close" @click="close">
					<image src="../../../static/icons/close.png" mode=""></image>
				</view>
				<view class="popup-title">
					绑定邀请人
				</view>
				<view class="popup-content">
					<view class="form-label">邀请人手机号码</view>
					<input class="form-text mt-10" type="text" v-model="mobile" placeholder="请输入邀请人手机号码"/>
					<view class="btn-submit" @click="handleSubmit">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { queryInvitation, queryMyInvitee, checkInvitee, bindInvitee } from "@/api/mine-invitation.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import storage from "@/utils/storage.js"
	import { getUserInfo } from "@/api/members";
	
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				invitee: '',
				mobile: '',
				isBind: true,
				loadStatus: "加载更多",
				pages: 1,
				total: 0,
				userInfo: null
			};
		},
		onLoad() {
			this.userInfo = this.$options.filters.isLogin();
			this.initData();
			this.getList();
		},
		onReachBottom() {
			if(this.pages > this.params.pageNumber) {
				this.params.pageNumber++;
				this.getList();
			}
		},
		methods: {
			handleBind() {
				this.$refs.popupCellphone.open();
			},
			close() {
				this.$refs.popupCellphone.close();
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				queryInvitation(params).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						self.pages = res.data.result.pages;
						self.total = res.data.result.total;
						let data = res.data.result.records;
						if (data.length < self.params.pageSize) {
							self.loadStatus = "没有更多";
							self.list.push(...data);
						} else {
							self.list.push(...data);
							self.loadStatus = "加载更多";
						}
					}
				});
			},
			handleAdd() {
				uni.navigateTo({
					url:'makeForm?makeId=1'
				})
			},
			initData() {
				let self = this;
				checkInvitee().then((res) => {
					if (res.data.success) {
						self.isBind = res.data.result;
					}
				})
				
			},
			handleSubmit() {
				let self = this;
				if(!!!self.mobile) {
					uni.showToast({
						title: '邀请用户不能为空',
						icon: 'none',
						duration: 2000
					});
				} else {
					bindInvitee({
						'mobile': self.mobile
					}).then((res) => {
						if (res.data.success) {
							self.close();
							self.$nextTick(() => {
								getUserInfo().then((user) => {
									if (user.data.success) {
										self.isBind = true;
										storage.setUserInfo(user.data.result);
										self.userInfo = user.data.result;
										self.$forceUpdate();
									}
								});
							})
						}
					})
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.header {
      background-color:#FF573E;
		    background-size: cover;
		    background-repeat: no-repeat;
      border-radius: 10rpx 10rpx 20rpx 20rpx;
			position: fixed;
			// top: 80rpx !important;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: #FFFFFF;
			height: 240rpx;
			text-align: center;
			z-index: 10;
			box-shadow: 0px 4rpx 8rpx 0px rgba(255, 0, 0, 0.2);
			
			.bind {
				height: 60rpx;
				line-height: 60rpx;
				color: #ffffff;
				padding: 0 30rpx;
				border-radius: 30rpx;
				background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
			}
		}
		
		.content {
			padding-top: 268rpx;
			margin-bottom: 60rpx;
			background-color: #ffffff;
			
			.title {
				font-weight: 900;
			}
			
			.item {
				line-height: 100rpx;
			}
		}
		
	}
	
	.popup {
		background: #ffffff;
		background-size: cover;
		width: calc(100vw - 120rpx);
		color: $font-color-dark;
		text-align: center;
		opacity: 0.95;
		border-radius: 20rpx;
		padding: 30rpx 30rpx 60rpx 30rpx;
		
		.close {
			position: absolute;
			left: 0;
			top: 5rpx;
			
			image {
				padding: 30rpx 20rpx;
				width: 50rpx;
				height: 50rpx;
			}
		}
		
		.popup-title {
			font-size: 36rpx;
			font-weight: 700;
			text-align: center;
		}
		
		.popup-content {
			font-size: 28rpx;
			line-height: 1.6;
			margin-top: 80rpx;
			
			.form-label {
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: $font-color-dark;
				line-height: 2;
				text-align: left;
			}
			
			.form-text {
				text-align: left;
				border: 2rpx $border-color-base solid;
				height: 100rpx;
				border-radius: 15rpx;
				line-height: 100rpx;
				font-size: 32rpx;
				font-weight: 400;
				padding: 0 114rpx 0 24rpx;
			}
			
			.btn-submit {
				margin-left: 30rpx;
				margin-top: 60rpx;
				width: calc(100% - 60rpx);
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
		
		.popup-logo {
			margin-top: 60rpx;
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
