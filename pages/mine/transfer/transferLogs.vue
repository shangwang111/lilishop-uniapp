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
							<view v-if="tabCurrentIndex == 0">{{ item.intoTime | filterDate }}</view>
							<view v-else>{{ item.rechargeTime | filterDate }}</view>
							
							<view v-if="tabCurrentIndex == 0">
								<view class="badge badge-success" v-if="item.rechargeStatus == 0">成功</view>
								<view v-else class="badge badge-warning">转入中</view>
							</view>
							<view v-if="tabCurrentIndex == 1">
								<view class="badge badge-success" v-if="item.receiptStatus == 0">成功</view>
								<view v-else class="badge badge-warning">转出中</view>
							</view>
						</view>
						<view class="card-body break-all">
							<view class="d-flex">
								<text class="label">数量：</text>
								<text v-if="tabCurrentIndex == 0">{{ item.arrivalAmount }}</text>
								<text v-else>{{ item.rechargeAmount }}</text>
							</view>
							<view class="d-flex">
								<text class="label">账户：</text>
								<text v-if="tabCurrentIndex == 0">{{ item.paymentAddress }}</text>
								<text v-else>{{ item.intoAddress }}</text>
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
	
	import { transferInDetails, transferOutDetails } from "@/api/mine-transfer.js";
	
	export default {
		filters: {
			filterDate(val) {
        var date=new Date(val);
        var year=date.getFullYear();
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        // 拼接
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
				//return dateFormat(new Date(val));
			}
		},
		data() {
			return {
				tabCurrentIndex: 0, 
				range: [this.dateToStr(getMonth()) , this.dateToStr(new Date())],
				navList: [
					{
						text: "转入",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 1,
						}
					},
					{
						text: "转出",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 2,
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
		watch: {
			tabCurrentIndex(val) {
				if (this.navList[val].dataList.length == 0) this.getData();
			},
			range(newVal, oldVal) {
				this.getInitPage();
			},
		},
		methods: {
			getInitPage() {
				this.navList = [
					{
						text: "转入",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 1,
						}
					},
					{
						text: "转出",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 2,
						}
					},
				];
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
				if(index == 0)  res = await transferInDetails(params);
				else res = await transferOutDetails(params);
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
