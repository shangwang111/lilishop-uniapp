<template>
	<view class="container">
		<view class="header">
			<view>
				<view class="title">{{ userInfo.member.myRegion || "暂无" }}</view>
				<view class="sub-title" v-if="!!userInfo.member.myParentRegion">（上级区域是 {{ userInfo.member.myParentRegion }}）</view>
			</view>
		</view>
		
		<view  class="content">
			<view class="card-area">
				<view class="card-title">
					邀请记录
				</view>
				<view class="card-body" style="padding-top: 0;padding-bottom: 0;">
					<view v-for="(item, index) in list" :key="index">
						<view class="split-line-1" v-if="index > 0"></view>
						<view class="item fs-30 d-flex justify-content-space-between">
							<view class="title">{{ item.title }}</view>
							<view>{{ item.createTime }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center font-color-disabled">{{ loadStatus }}</view>
	</view>
</template>

<script>
	import { queryInvitationRegion } from "@/api/mine-invitation.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				userInfo: null,
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				inviter: '',
				tel: '',
				loadStatus: "加载更多",
				pages: 1
			};
		},
		onLoad() {
			this.userInfo = this.$options.filters.isLogin();
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
				uni.switchTab({
					url: '/pages/home/index'
				});
			},
			getList() {
				let self = this;
				let params = self.params;
				uni.showLoading({
					title: "加载中",
				});
				queryInvitationRegion(params, self.userInfo.member.myRegionId).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						self.pages = res.data.result.pages;
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
			
			.title {
				font-size: 35rpx;
				font-weight: 500;
			}
			
			.sub-title {
				margin-top: 15rpx;
				font-size: 24rpx;
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
	
</style>
