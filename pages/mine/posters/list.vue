<template>
	<view class="b-content">
		<view class="head-info d-flex align-items-center justify-content-center">
			今日SSD推荐价格 
			<text class="price">￥{{ unitPrice }}</text>
		</view>
		<view class="navbar">
			<!-- 循环出头部tab栏 -->
			<view v-for="(item, index) in navList" :key="index" class="nav-item" @click="handleTabClick(index)">
				<text :class="{ current: tabCurrentIndex === index }">{{ item.text }}</text>
			</view>
		</view>
		<view class="bar-border"></view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(navItem, navIndex) in navList" :key="navIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					
					<uni-table border stripe>
						<uni-tr>
							<uni-th width="100" align="center">用户</uni-th>
							<uni-th width="60" sortable @sort-change="sortChangeSalesVolume" align="center">数量</uni-th>
							<uni-th width="60" sortable @sort-change="sortChangePrice" align="center">价格</uni-th>
							<uni-th width="80" align="center">联系方式</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in navItem.dataList" :key="index">
							<uni-td align="center">{{ item.username }}</uni-td>
							<uni-td align="center"> {{ item.salesVolume }} </uni-td>
							<uni-td align="center">￥{{ item.price }}</uni-td>
							<uni-td align="center">
								<button class="uni-button" size="mini" type="warn" @click="handleShow(item.username)">
									查看
								</button>
							</uni-td>
						</uni-tr>
					</uni-table>
					
					<uni-load-more :status="navItem.loadStatus"></uni-load-more>
				</scroll-view>
				
			</swiper-item>
		</swiper>
    <view class="btn-bottom"  @click="handleAdd">
      挂单
    </view>
	
	</view>
</template>

<script>
	
	import { listOfPendingOrders } from "@/api/mine-poster.js";
	import { queryConfigureByType } from "@/api/mine-common.js";
  import UButton from "../../../uview-ui/components/u-button/u-button";
  import WebView from "../../tabbar/home/web-view";
	
	export default {
    components: {WebView, UButton},
    data() {
			return {
				unitPrice: null,
				tabCurrentIndex: 0, 
				navList: [
					{
						text: "买单",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 30,
							status: 1,
							business: 0,
							sort: 'price',
							order: 'ASC'
						}
					},
					{
						text: "卖单",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 30,
							status: 2,
							business: 1,
							sort: 'price',
							order: 'ASC'
						}
					},
				]
			};
		},
		onShow() {
			this.navList[this.tabCurrentIndex].params.pageNumber = 1
			this.navList[this.tabCurrentIndex].dataList = [];
			this.getData();
		},
		onLoad() {
			let self = this;
			queryConfigureByType({
				'type': 'unitPrice'
			}).then((res) => {
				if (res.data.success) {
					self.unitPrice = res.data.result;
				} 
			})
		},
		watch: {
			tabCurrentIndex(val) {
				if (this.navList[val].dataList.length == 0) this.getData();
			},
		},
		methods: {
			getInitPage() {
				this.navList = [
					{
						text: "买单",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 30,
							status: 1,
							business: 0,
							sort: this.navList[this.tabCurrentIndex].params.sort,
							order: this.navList[this.tabCurrentIndex].params.order
						}
					},
					{
						text: "卖单",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 30,
							status: 2,
							business: 1,
							sort: this.navList[this.tabCurrentIndex].params.sort,
							order: this.navList[this.tabCurrentIndex].params.order
						}
					},
				];
				this.getData();
			},
			handleTabClick(index) {
				this.tabCurrentIndex = index;
			},
			sortChangeSalesVolume(e) {
				let order = 'ASC';
				if(e.order == 'ascending') {
					order = 'ASC'
				}
				else if(e.order == 'descending') {
					order = 'DESC'
				} 
				this.navList[this.tabCurrentIndex].params.sort = 'sales_volume';
				this.navList[this.tabCurrentIndex].params.order = order;
				this.getInitPage();
			},
			sortChangePrice(e) {
				let order = 'ASC';
				if(e.order == 'ascending') {
					order = 'ASC'
				}
				else if(e.order == 'descending') {
					order = 'DESC'
				} 
				this.navList[this.tabCurrentIndex].params.sort = 'price';
				this.navList[this.tabCurrentIndex].params.order = order;
				this.getInitPage();
			},
			handleAdd() {
				uni.navigateTo({
					url: 'poster_form'
				})
			},
			handleShow(username) {
				uni.navigateTo({
					url: 'poster?username=' + username
				})
			},
			async getData() {
				let index = this.tabCurrentIndex;
				let params = this.navList[index].params;
				
				uni.showLoading({ title: "加载中" });
				let res = await listOfPendingOrders(params);
				uni.hideLoading();
				
				if (res.data.success) {
					let data = res.data.result.records;
					if (data.length < 10) {
						this.navList[index].loadStatus = "noMore";
						this.navList[index].dataList.push(...data);
					} else {
						this.navList[index].dataList.push(...data);
					}
				}
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
			},
			loadData() {
				let index = this.tabCurrentIndex;
				if (this.navList[index].loadStatus != "noMore") {
					this.navList[index].params.pageNumber++;
					this.getData();
				}
			},
			dateToStr(date) {
				var year = date.getFullYear();//年
				var month = date.getMonth();//月
				var day = date.getDate();//日
				return year + "-" +
					((month + 1) > 9 ? (month + 1) : "0" + (month + 1)) + "-" +
					(day > 9 ? day : ("0" + day))
			 }
		},
	};
</script>

<style lang="scss" scoped>
	$item-color: #fff;
	
	page {
		height: 100%;
	}
	
	.head-info {
		background-color: #fff;
		height: 80rpx;
	}

	.b-content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100vh - 320rpx);
	}

	.list-scroll-content {
		height: 100%;
		width: 100%;
	}

	.navbar {
		display: flex;
		height: 80rpx;
		padding: 0 5px;
		background: #fff;
		color: $light-color;
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			height: 100%;
			font-size: 26rpx;
			color: $light-color;
			position: relative;
			text-align: center;
			text {
				line-height: 80rpx;
			}
			
			.current {
				font-weight: bold;
				font-size: 28rpx;
				padding-bottom: 10rpx;
				border-bottom: 2px solid $light-color;
			}
		}
	}

  .btn-bottom {
    width: calc(90% - 20rpx);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80rpx;
    line-height: 80rpx;
    background: #FF573E;
    font-size: 30rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    border-radius: 40rpx;
    margin-left:50rpx
  }

	.price {
		font-size: 32rpx;
		font-weight: 700;
		color: red;
	}
</style>
