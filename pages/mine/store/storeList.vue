<template>
	<view class="address">

		<u-empty class="empty" v-if="storeList.length == 0" text="暂无商铺" mode="address"></u-empty>
		<view class="list" v-else>
			<view class="item c-content" v-for="(item, index) in storeList"
				  :key="index"
				  :data-index='index'>
				<view class="basic" @click="addStore(item.id)">
					<text>{{ item.storeName }}</text>
					<text>{{ item.memberName }}</text>
					<text class="pass_default" v-if="item.storeDisable ==='OPEN' ">审核通过</text>
					<text class="default"
						  v-if="item.storeDisable ==='APPLYING' && userInfo.member.serviceProvider ==='SERVICE_PROVIDER' && serviceProviderCode === item.storeAddressIdPath.split(',')[2] "
						  @click="addStore(item.id)">审核
					</text>
					<text class="auditing"
						  v-if="item.storeDisable ==='APPLYING' && userInfo.member.id === item.memberId  ">审核中
					</text>
					<text class="no_pass_default" v-if="item.storeDisable ==='REFUSED' ">审核失败</text>

					<view>
						<div class="region">
							<span>{{ item.storeAddressDetail }}</span>
						</div>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<button type="default" class="btn" @click="addStore('')">
			<u-icon name="plus-circle"></u-icon>
			商铺入驻
		</button>
	</view>
</template>

<script>
import * as API_Trade from "@/api/trade";
import * as API_Store from "@/api/store.js";

export default {
	data() {
		return {
			storeList: [], //地址列表
			showAction: false, //是否显示下栏框
			userInfo: null,
			serviceProviderCode: null,
			removeId: "", //删除的地址id
			routerVal: "",
			params: {
				pageNumber: 1,
				pageSize: 20,
			},
			pages: 1,
			loadStatus: 'more'
		};
	},
	onPullDownRefresh() {
		this.storeList = [];
		this.initData();
	},
	onLoad: function (val) {
		this.routerVal = val;
	},
	onShow() {
		this.getServiceProvider();
		this.userInfo = this.$options.filters.isLogin();
		this.storeList = [];
		this.getAddressList();
	},
	onReachBottom() {
		if (this.pages > this.params.pageNumber) {
			this.params.pageNumber++;
			this.getAddressList();
		}
	},
	onHide() {
	},
	methods: {
		initData() {
			this.pages = 1,
			this.loadStatus = "more";
			this.storeList = [];
			this.params.pageSize = 20;
			this.params.pageNumber = 1;
			this.getAddressList();
		},
		async selectAddressData(val) {
			await API_Trade.setAddressId(val.id, this.routerVal.way);
			uni.navigateBack({
				delta: 1,
			});
		},
		getServiceProvider() {
			API_Store.getServiceProvider().then((res) => {
				if (res.data.success) {
					this.serviceProviderCode = res.data.result;
				}
			});
		},
		//获取地址列表
		getAddressList() {
			let self = this;
			uni.showLoading({
				title: "加载中",
			});

			API_Store.getStoreList(
				this.params
			).then((res) => {
				uni.hideLoading();
				if (res.data.success) {
					self.pages = res.data.result.pages;
					let data = res.data.result.records;
					self.storeList.push(...data);
					if (data.length < self.params.pageSize) {
						self.loadStatus = "noMore";
					} else {
						self.loadStatus = "more";
					}
				}
			});
		},
		//删除地址
		removeAddress(id) {
			this.removeId = id;
			this.showAction = true;
		},
		deleteAddressMessage() {
			API_Address.deleteAddress(this.removeId).then((res) => {
				if (res.statusCode == 200) {
					uni.showToast({
						icon: "none",
						title: "删除成功",
					});
					this.getAddressList();
				} else {
					uni.showToast({
						icon: "none",
						title: res.data.message,
						duration: 2000,
					});
				}
			});
		},
		//商铺入住
		addStore(id) {
			if (id) {
				uni.navigateTo({
					url: "/pages/mine/store/addStore?id=" +
						id +
						"&way=" +
						this.routerVal.way +
						"&type=order",
				});
			} else {
				uni.navigateTo({
					url:
						"/pages/mine/store/addStore?way=" + this.routerVal.way + "&type=order",
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.empty {
	margin-top: 200rpx !important;
}

.alifont {
	display: inline-block;
}

.region {
	span {
		margin: 0 4rpx !important;
	}
}

.address {
	.auditing {
		color: #666;
		font-size: 22rpx;
		border-radius: 6rpx;
		align-self: center;
		padding: 2rpx 20rpx;
		float: right;
	}

	.default {
		border: 1px solid;
		font-size: 22rpx;
		border-radius: 6rpx;
		align-self: center;
		padding: 2rpx 20rpx;
		float: right;
		z-index: 1000;
	}

	.pass_default {
		color: #2ed881;
		font-size: 22rpx;
		border-radius: 6rpx;
		align-self: center;
		padding: 2rpx 20rpx;
		float: right;
	}

	.no_pass_default {
		color: #ff6262;
		font-size: 22rpx;
		border-radius: 6rpx;
		align-self: center;
		padding: 2rpx 20rpx;
		float: right;
	}

	.list {
		padding-bottom: 120rpx;
		
		.item:hover {
			background: #ededed;
		}

		.item {
			margin-top: 20rpx;
			font-size: $font-base;
			color: #666;

			.basic {
				padding: 30rpx;
				line-height: 1.5em;

				:nth-child(2) {
					margin: 0 20rpx;
				}

				:nth-child(4) {
					color: $font-color-light;
					font-size: $font-sm;
					margin-top: 10rpx;

					text:nth-child(2) {
						margin: 0;
					}

					view {
						font-size: 28rpx;
					}
				}
			}

			.edit {
				display: flex;
				justify-content: space-between;
				align-items: center;
				vertical-align: middle;
				height: 80rpx;
				font-size: $font-sm;
				color: $font-color-light;
				padding: 0 30rpx;

				.unchecked {
					width: 28rpx;
					height: 28rpx;
					border-radius: 50%;
					border: 1px solid #e0e0e0;
					display: inline-block;
					vertical-align: middle;
					margin-right: 8rpx;
					position: relative;
					top: -2rpx;
					left: 0;
				}

				view:nth-child(1) {
					view:nth-child(1) {
						font-size: $font-base;
						color: $main-color;
						margin-right: 8rpx;
						vertical-align: middle;
					}
				}

				view:nth-child(2) {
					text {
						margin-left: 5rpx;
					}

					.alifont {
						font-size: 32rpx;
					}

					.icon-bianji-copy {
						font-size: 28rpx;
						position: relative;
						top: 2rpx;
						left: 0;
					}

					.icon-lajitong {
						position: relative;
						top: 4rpx;
					}
				}

				.mr-40 {
					margin-right: 40rpx;
				}
			}
		}
	}

	.btn {
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
		.u-icon {
			margin-right: 10rpx;
		}
	}
}
</style>
