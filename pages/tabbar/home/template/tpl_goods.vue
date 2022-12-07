<template>
	<div class="layout">
		<u-sticky>
			<div class="goods-cell-title">
				<div class="goods-item-title" :class="{ 'selected-title': selected.index == index }"
					@click="handleClickTitle(title, index)" v-for="(title, index) in res.list[0].titleWay" :key="index">
					<h4 class="h4">{{ title.title }}</h4>
					<div>{{ title.desc }}</div>
				</div>
			</div>
		</u-sticky>
		<div class="goods-list" v-if="selected.val !='店铺'">
			<div v-if="item.___index != undefined  ?   (selected.index == item.___index) : ( selected.val == item.type)"
				@click="handleClick(item)" class="goods-item" v-for="(item, item_index) in res.list[0].listWay"
				:key="item_index">
				<div class="goods-img">
					<u-image :src="item.img" height="350rpx" mode="aspectFill" width="100%">
						<u-loading slot="loading"></u-loading>
					</u-image><!--  -->
				</div>
				<div class="goods-desc">
					<div class="goods-title">
						{{ item.title }}
					</div>
					<div class="goods-bottom">
						<div class="goods-price">￥{{ item.price | unitPrice }}</div>
					</div>
				</div>
			</div>
		</div>

		<div class="goods-list" v-if="selected.val ==='店铺'">
			<div @click="handleClick(item)" class="goods-item" v-for="(item, item_index) in storeList"
				:key="item_index">
				<div class="goods-img">
					<u-image :src="item.img" height="350rpx" mode="aspectFill" width="100%">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</div>
				<div class="store-goods-desc">
					<div class="store-goods-title">
						{{ item.title }}
					</div>
					<div class="store-goods-price">
						{{ item.distance.toFixed(2)   || 0  }} km
					</div>
				</div>
			</div>
		</div>
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
	</div>

</template>
<script>
	import { getAppByPage } from "@/api/store.js";
	export default {
		title: "商品分类以及商品",
		data() {
			return {
				selected: {
					index: 0,
					val: "店铺",
				},
				params: {
					pageNumber: 1,
					pageSize: 10,
					longitude: null,
					latitude: null,
				},
				loadStatus: "加载更多",
				pages: 1,
				storeList: [],
			};
		},
		props: ["res"],
		watch: {
			res: {
				handler(val) {
					this.getStoreList();
				},
				immediate: true,
			},
		},
		methods: {
			getStorePage() {
				if (this.pages > this.params.pageNumber) {
					this.params.pageNumber++;
					this.getStoreList();
				}
			},
			getStoreList() {
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res1) {
						that.params.longitude = res1.longitude.toFixed(6),
							that.params.latitude = res1.latitude.toFixed(6),

							getAppByPage(that.params).then((res2) => {
								
								that.pages = res2.data.result.pages;
								res2.data.result.records.forEach((item) => {
									that.storeList.push({
										"id": item.id,
										"img": item.storeLogo,
										"title": item.storeName,
										"price": 0,
										"distance": item.distance
									})
								})
							});
					}
				});
			},

			handleClick(item) {
				if (this.selected.val === '店铺') {
					uni.navigateTo({
						url: `/pages/product/shopPage?id=` + item.id,
					});
				} else {
					uni.navigateTo({
						url: `/pages/product/goods?id=${item.id}&goodsId=${item.goodsId}`,
					});
				}
			},
			closeGoods(val, index) {
				this.res.list[0].listWay.splice(index, 1);
			},
			handleClickTitle(val, index) {
				this.selected.index = index;
				this.selected.val = val.title;
			},
		},
	};
</script>
<style lang="scss" scoped>
	$w_94: 94%;

	.layout {
		padding: 8px 0;
		background: #f9f9f9;
	}

	.selected-title {
		>h4 {
			font-size: 30rpx;
			color: #666 !important;
		}

		>div {
			font-weight: bold;
			color: $main-color !important;
		}
	}

	.goods-cell-title {
		background: #f9f9f9;
		padding: 10px;
		transition: 0.35s;
		display: flex;
		cursor: pointer;

		>.goods-item-title {
			flex: 1;
			text-align: center;

			>h4 {
				font-size: 32rpx;
			}

			>div {
				color: #999;
				font-size: 24rpx;
			}
		}
	}

	.goods-list {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.goods-item {
		width: 50%;
		margin-bottom: 10px;
		border-radius: 0.4em;
		overflow: hidden;
	}

	.goods-img {
		position: relative;
		margin: 0 auto;
		width: $w_94;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		overflow: hidden;

		>img {
			width: 100%;
			height: 100%;
		}
	}

	.goods-desc {
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		width: $w_94;
		background: #fff;
		padding: 8rpx 0 8rpx 8rpx;
		margin: 0 auto;

		>.goods-title {
			font-size: 24rpx;
			height: 70rpx;
			display: -webkit-box;
			font-weight: 500;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		>.goods-bottom {
			display: flex;
			font-weight: bold;

			>.goods-price {
				line-height: 2;
				color: $main-color;
			}
		}
	}

	.store-goods-desc {
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		width: $w_94;
		background: #fff;
		padding: 8rpx 0 8rpx 8rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;

		>.store-goods-title {
			font-size: 24rpx;
			display: -webkit-box;
			font-weight: 500;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		>.store-goods-price {
			line-height: 2;
			color: $main-color;
		}
	}

	.loadStatus {
		padding-bottom: 180rpx;
	}

	.goods-icon {
		right: 10rpx;
		top: 10rpx;
		position: absolute;
	}
</style>
