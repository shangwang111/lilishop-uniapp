<template>
	<view>
		<!-- 常用工具 -->
		<view class="interact-tools" style="margin-bottom: 15px">

			<div class="paddingBox">
				<view class="interact-container">
					<view v-if="storeId != null" class="interact-item" @click="navigateTo('/pages/mine/make/myMake')">
						<image src="/static/mine/couponcenter.png" mode=""></image>
						<view>商户打赏</view>
					</view>
					<view class="interact-item" @click="navigateTo('/pages/mine/transfer/transferInto')">
						<image src="/static/mine/mypoint.png" mode=""></image>
						<view>转入</view>
					</view>
					<view class="interact-item" @click="navigateTo('/pages/mine/transfer/transferOut')">
						<image src="/static/mine/myhistory.png" mode=""></image>
						<view>转出</view>
					</view>

					<view class="interact-item" @click="navigateTo('/pages/mine/store/storeList')">
						<image src="/static/mine/mycommit.png" mode=""></image>
						<view>商铺管理</view>
					</view>


					<view class="interact-item" @click="navigateTo('/pages/mine/posters/list')">
						<image src="/static/mine/shensu.png" mode=""></image>
						<view>挂单</view>
					</view>

					<view class="interact-item" v-show="!!serviceProvider"
						@click="navigateTo('/pages/mine/regional/promoters')">
						<image src="/static/mine/sign.png" mode=""></image>
						<view>推广员</view>
					</view>

				<!-- 	<view class="interact-item" @click="navigateTo('/pages/mine/set/feedBack')">
						<image src="/static/mine/feedback.png" mode=""></image>
						<view>意见反馈</view>
					</view> -->
					<view class="interact-item" @click="navigateTo('/pages/mine/member/storeMember')">
						<image src="/static/mine/myfavorite.png" mode=""></image>
						<view>商铺会员</view>
					</view>

		
			
					<view class="interact-item" v-if="serviceProvider != null || promoters == true"
						@click="navigateTo('/pages/mine/profit/area')">
						<image src="/static/mine/mycommit.png" mode=""></image>
						<view>区域收益</view>
					</view>
					
					<view class="interact-item" @click="navigateTo('/pages/mine/invitations/InvitationList')">
						<image src="/static/mine/distribution.png" mode=""></image>
						<view>绑定邀请人</view>
					</view>
					
					<view class="interact-item" v-show="!!serviceProvider"
						@click="navigateTo('/pages/mine/invitations/InvitationArea')">
						<image src="/static/mine/kanjia.png" mode=""></image>
						<view>邀请区域</view>
					</view>
					
					<view class="interact-item"
						@click="navigateTo('/pages/mine/invitations/InvitationStoreList')">
						<image src="/static/mine/pointgift.png" mode=""></image>
						<view>我邀请的商铺</view>
					</view>
					
					<view class="interact-item" @click="navigateTo('/pages/mine/set/setUp')">
						<image src="/static/mine/setting.png" mode=""></image>
						<view>设置</view>
					</view>
				</view>
			</div>
		</view>
	</view>
</template>

<script>
	import {
		distribution
	} from "@/api/goods";
	export default {
		props: ['storeId', 'serviceProvider', 'promoters'],
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url,
				});
			},
			distribution() {
				distribution().then((res) => {
					if (res.data.result) {
						let type = res.data.result.distributionStatus;
						if (type == "PASS") {
							uni.navigateTo({
								url: "/pages/mine/distribution/home",
							});
						} else if (type == "REFUSE") {
							uni.navigateTo({
								url: "/pages/mine/distribution/auth",
							});
						} else if (type == "RETREAT") {
							uni.showToast({
								title: "您的分销资格已被清退。请联系管理员！",
								duration: 2000,
								icon: "none",
							});
						} else {
							uni.showToast({
								title: "您的信息正在审核",
								duration: 2000,
								icon: "none",
							});
						}
					} else if (!res.data.success && res.data.code == 22000) {
						uni.showToast({
							title: "分销功能暂未开启",
							duration: 2000,
							icon: "none",
						});
					} else {
						// 没有资格申请 先去实名认证
						uni.navigateTo({
							url: "/pages/mine/distribution/auth",
						});
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.interact-tools {
		border-left: none;
		border-right: none;


		.interactBox {
			height: 156rpx;
		}

		.interact-container {
			margin: 0 20rpx;
			background: #fff;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);

			.interact-item-img {
				width: 52rpx !important;
				height: 52rpx !important;
				// margin-bottom:  !important;
				margin: 0 auto 6rpx auto !important;
			}

			image {
				width: 52rpx;
				height: 52rpx;
				margin-bottom: 6rpx;
			}

			display: flex;
			align-items: center;
			flex-wrap: wrap;
			text-align: center;

			.interact-item {
				font-size: $font-sm;
				width: 25%;
				height: 160rpx;
				padding: 30rpx;
			}
		}
	}
</style>
