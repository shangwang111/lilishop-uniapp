<template>
	<view class="container">
		<view class="mine-header">
			<view>
				<view>邀请总商铺数</view>
				<view class="uni-top-2">{{ sumStoreCount || 0 }}</view>
			</view>
		</view>

		<view class="items" style="background-color: #e4e7ed">
			<u-search placeholder="请输入商铺名称" shape="square" :showAction="false" @change="searchStoreName()" v-model="params.storeName" />
			
			<view class="card">
				 <text class="iconfont icon-jingyanzhi"></text>商铺列表
			</view>
			
			<view class="card-area" v-for="(item, index) in list" :key="index">
				<view class="card-title d-flex justify-content-space-between align-items-center">
					<view class="fs-24">
						<text > {{ item.storeName }} </text> 
					</view>
					<view class="btn-wrap">
						<button type="primary" size="mini"  @click="handleTel(item.memberName)" class="btnTap">联系商家</button>
					</view>
				</view>
				
				<view class="card-body break-all">
					<view>
						<text class="label-title">商铺地址：</text>
						<text>{{ item.storeAddressDetail }}</text>
					</view>
					<view>
						<text class="label-title">总让利额：</text>
						<text> {{ item.sumSurrenderPrice || 0 }} </text>
					</view>
					
				</view>
			</view>
			
		</view>
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
	
	</view>
</template>

<script>
	import { getAppInvitationStore} from "@/api/members.js";

	export default {
		data() {
			return {
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
					storeName:""
				},
				userInfo: null,
				loadStatus: "加载更多",
				pages: 1,
				total: 0,
				sumStoreCount: 0,
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
				this.getSum();
			},
			handleTel(tel) {
				uni.makePhoneCall({
					phoneNumber: tel, //电话号码
					success: function(e) {
					},
					fail: function(e) {
					}
				})
			},
			searchStoreName(){
				this.list = [];
				this.getList();
			},
			getSum() {
				getAppInvitationStore(this.params).then((res) => {
					if (res.data.success) {
						let data = res.data.result.records;
						this.sumStoreCount = data.length;
					}
				})
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				getAppInvitationStore(params).then((res) => {
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
			top: -30rpx;
			right: 0;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: #FFFFFF;
			height: 240rpx;
			text-align: center;
			z-index: 10;
			box-shadow: 0px 4rpx 8rpx 0px rgba(255, 0, 0, 0.2);
		}
		
		.items {
			padding-top: 220rpx;
			
			.card{
				margin: 10px 13px;
				.iconfont {
				  width: 32rpx;
				  color: #bbbbbb;
				  margin-right: 10rpx;
				}
			}		

			.card-area {
				margin-left: 20rpx;
				.card-title{
          color: black;
					line-height: 50rpx;
					border-top-left-radius: 8px;
					border-top-right-radius: 8px;
					
					.btn-wrap {
					  display: flex;
					  align-items: center;
					  .btnTap {
              font-size:30rpx;
					    background-color: #FF573E;
					  }
					}
				}
			}

		}
		
		.loadStatus {
			padding-bottom: 180rpx;
		}
	}
</style>
