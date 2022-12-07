<template>
	<view class="b-content">
		
		<view class="navbar">
			<!-- 循环出头部tab栏 -->
			<view v-for="(item, index) in navList" :key="index" class="nav-item" @click="handleTabClick(index)">
				<text :class="{ current: tabCurrentIndex === index }">{{ item.text }}</text>
			</view>
		</view>
		<view class="screen">
			<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
		</view>
		<view class="bar-border"></view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(navItem, navIndex) in navList" :key="navIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">

					<view class="card-area ml-20 mr-20" v-for="(item, index) in navItem.dataList" :key="index">
						<view class="card-title d-flex justify-content-space-between align-items-center">
							<view class="fs-24">
								<text class="mr-10">订单号：</text> 
								<text>{{ item.orderId }}</text> 
							</view>
							
							<view class="count-danger fs-28">{{ item. quantity }}个</view>
						</view>
						
						<view class="card-body break-all">
							<view class="d-flex" v-if="tabCurrentIndex == 1">
								<text class="label-title">子区域：</text>
								<text>{{ item.subArea }}</text>
							</view>
							<view class="d-flex">
								<text class="label-title">做单商铺：</text>
								<text>{{ item.merName }}</text>
							</view>
							<view class="d-flex">
								<text class="label-title">收益时间：</text>
								<text>{{ item.creationTime|filterDateTime }}</text>
							</view>
						</view>
					</view>
					
					<uni-load-more :status="navItem.loadStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	
	</view>
</template>

<script>
	function getMonth() {
		let fdate = new Date()
		let fyears = fdate.getFullYear()
		let fmoths = fdate.getMonth()
		let fdate_sgy = new Date(fyears, fmoths - 1, fdate.getDate())
		return fdate_sgy;
	}
	function dateFormat(dat){
		//获取年月日，时间
		var year = dat.getFullYear();
		var mon = (dat.getMonth()+1) < 10 ? "0"+(dat.getMonth()+1) : dat.getMonth()+1;
		var data = dat.getDate()  < 10 ? "0"+(dat.getDate()) : dat.getDate();
		var newDate = year +"-"+ mon +"-"+ data;
		return newDate;
	}
	function dateTimeFormat(dat){
		var hours = dat.getHours()  < 10 ? "0"+(dat.getHours()) : dat.getHours();
		var minutes = dat.getMinutes()  < 10 ? "0"+(dat.getMinutes()) : dat.getMinutes();
		var seconds = dat.getSeconds()  < 10 ? "0"+(dat.getSeconds()) : dat.getSeconds();
		var newTime = hours +":"+ minutes +":"+ seconds;
		return dateFormat(dat)+' '+newTime;
	}
	
	
	import { profitArea } from "@/api/mine-profit.js";
	
	export default {
		filters: {
			filterDate(val) {
				return dateFormat(new Date(val));
			},
			filterDateTime(val) {
				return dateTimeFormat(new Date(val));
			}
		},
		data() {
			return {
				tabCurrentIndex: 0, 
				range: [this.dateToStr(getMonth()) , this.dateToStr(new Date())],
				nav1: {
					text: "区域收益",
					loadStatus: "more",
					dataList: [],
					params: {
						pageNumber: 1,
						pageSize: 10,
						incomeType: 0,
					}
				},
				nav2: {
					text: "子区域收益",
					loadStatus: "more",
					dataList: [],
					params: {
						pageNumber: 1,
						pageSize: 10,
						incomeType: 1,
					}
				},
				nav3: {
					text: "合伙人收益",
					loadStatus: "more",
					dataList: [],
					params: {
						pageNumber: 1,
						pageSize: 10,
						incomeType: 2,
					}
				},
				navList: []
			};
		},
		onLoad() {
			this.initData();
		},
		onShow() {
			this.navList[this.tabCurrentIndex].params.pageNumber = 1
			this.navList[this.tabCurrentIndex].dataList = [];
			this.getData();
		},
		watch: {
			tabCurrentIndex(val) {
				if (this.navList[val].dataList.length == 0) this.getData();
			},
			range(newVal, oldVal) {
				this.getInitPage();
			},
		},
		methods: {
			initData() {
				let isServiceProvider = getApp().globalData.isServiceProvider;
				let isPromoters = getApp().globalData.isPromoters;
				if(isServiceProvider && !isPromoters) {
					this.navList = [this.nav1, this.nav2,this.nav3]
				} else if(!isServiceProvider && isPromoters) {
					this.navList = [this.nav2, this.nav3,this.nav3]
				} else {
					this.navList = [this.nav1, this.nav2, this.nav3]
				}
				this.getInitPage();
			},
			getInitPage() {
				this.getData();
			},
			handleTabClick(index) {
				this.tabCurrentIndex = index;
			},

			async getData() {
				let index = this.tabCurrentIndex;
				let params = this.navList[index].params;
				params['beginDate'] = this.range[0];
				params['endDate'] = this.range[1];
				let res = null;
				
				uni.showLoading({ title: "加载中" });
				res = await profitArea(params);
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
			useItNow(item) {
				if (item.storeId && item.storeId!='0') {
					uni.navigateTo({
						url: `/pages/product/shopPage?id=${item.storeId}`,
					});
				} else {
					uni.switchTab({
						url: "/pages/navigation/search/searchPage",
					});
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
	
	.screen {
		background-color: #ffffff;
		height: 80rpx;
		z-index: 900;
		
		/deep/ .uni-date-editor--x {
			height: 80rpx;
			border: 0;
		}
	}

	.b-content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100vh - 152rpx);
	}

	.list-scroll-content {
		height: 100%;
		width: 100%;
		padding: 0 20rpx;
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
	
	
	
	
</style>
