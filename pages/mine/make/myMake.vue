<template>
	<view class="container">
		<view class="mine-header">
			<view>
				<view>通证</view>
			<!-- 	<view class="uni-top-2">{{ userInfo.member.ssd.toFixed(4) || 0 }}</view> -->
				<view class="uni-top-2">{{ ssd.toFixed(4) || 0 }}</view>
			</view>
			<view>
				<view>积分</view>
				<!-- <view class="uni-top-2">{{ userInfo.member.point || 0 }}</view> -->
				<view class="uni-top-2">{{ point || 0 }}</view>
			</view>
		</view>
		
		<view  class="mine-content">
			<view class="card-area">
				<view class="card-title" style="color:#FF573E">
					做单记录
				</view>
				<view class="card-body">
					<view v-for="(item, index) in list" :key="index">
						<view class="split-line-1 mt-20" v-if="index > 0"></view>
						<view class="fs-30 d-flex justify-content-space-between" :class="index>0 ? 'mt-20' : ''">
							<view class="title">{{ item.merName }}</view>
							<view>{{ item.monetary }}</view>
						</view>
						<view class="mt-20 font-light d-flex justify-content-space-between">
							<view>{{ item.createTime }}</view>
							<view>{{ item.vipPhone }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		
		<view class="btn-bottom"  @click="handleAdd">
			去打赏
		</view>
	</view>
</template>

<script>
	import { getPointsData, getUserInfo,getMemberPointSum } from "@/api/members.js";
	import { queryMakeAccount } from "@/api/mine-make.js";
	export default {
		data() {
			return {
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				userInfo: null,
				loadStatus: "加载更多",
				pages: 1,
				total: 0,
				ssd: 0,
				point: 0,
			};
		},
		onShow() {
			this.initData();
		},
		onReachBottom() {
			if(this.pages > this.params.pageNumber) {
				this.params.pageNumber++;
				this.getList();
			}
		},
		methods: {
			initData() {
				this.total = 0;
				this.pages = 1,
				this.loadStatus = "加载更多";
				this.list = [];
				this.params.pageSize = 10;
				this.params.pageNumber = 1;
				this.userInfo = this.$options.filters.isLogin();
				this.getList();
				this.getInfo();
		
			},
			getInfo(){
				getUserInfo().then((res) =>{
					if (res.data.success) {
						this.ssd = res.data.result.member.ssd;
						this.point = res.data.result.member.point;
					}
				})
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				queryMakeAccount(params).then((res) => {
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
			},
			
			handleAdd() {
				// uni.showToast({
				// 	icon:"none",
				// 	duration: 3000,
				// 	title: '做单更新中，请稍后'
				// })
				// return;
				uni.navigateTo({
					url:'makeForm?makeId=1'
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.mine-header {
		    background-color:#FF573E;
		    background-size: cover;
		    background-repeat: no-repeat;
			border-radius: 10rpx 10rpx 10rpx 10rpx;
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
		}
		
		.mine-content {
			padding-top: 268rpx;
			margin-bottom: 60rpx;
			background-color: #ffffff;
			
			.title {
				font-weight: 900;
			}
		}
		
		.btn-bottom {
      background: #FF573E;
      position: fixed;
      width: calc(90% - 20rpx);
      bottom: 0;
      margin-left:50rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      border-radius: 40rpx;
      text-align: center;
		}
		
		.loadStatus {
			padding-bottom: 180rpx;
		}
	}
</style>
