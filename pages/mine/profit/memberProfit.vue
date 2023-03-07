<template>
	<view class="container">
		<view class="screen">
			<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
			
			<view class="bar-border"></view>
		</view>
		
		<view class="items">
			<view class="card-area" v-for="(item, index) in list" :key="index">
				<view class="card-title d-flex justify-content-space-between align-items-center">
					<view class="fs-24">
						<text>订单号：</text> 
						<text v-if="item.orderId === null">空投收益暂无订单号</text> 
						<text v-else>{{ item.orderId }}</text> 
					</view>

				</view>

				<view class="card-body break-all">
					<view class="d-flex">
						<text class="label-title">收益类型：</text>
						<text>{{ item.incomeType|filterType }}</text>
            <view style="margin-left:35px" class="count-danger fs-28">{{ item.quantity }}个</view>
					</view>

					<view class="d-flex">
						<text class="label-title">收益时间：</text>
						<text>{{ item.creationTime }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		
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
	
	import { profitMember } from "@/api/mine-profit.js";
	export default {
		filters: {
			filterDate(val) {
				return dateFormat(new Date(val));
			},
			filterType(val) {
				if(val == 0) return '邀请收益';
				if(val == 3) return '商城消费';
        if(val == 4) return '商品收益';
        if(val == 9) return '奖励收益';
				return '空投收益';
			},
		},
		data() {
			return {
				range: [this.dateToStr(getMonth()) , this.dateToStr(new Date())],
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
					beginDate: dateFormat(getMonth()),
					endDate: dateFormat(new Date())
				},
				loadStatus: "加载更多",
				pages: 1,
				total: 0
			};
		},
		watch: {
			range(newVal, oldVal) {
				this.params.beginDate = this.range[0];
				this.params.endDate = this.range[1];
				this.initData();
			},
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
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				profitMember(params).then((res) => {
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
	.container {
		width: 100%;
		
		
		.screen {
			background-color: #ffffff;
			height: 80rpx;
			position: fixed;
			left: 0;
			right: 0;
			border-bottom: 1rpx $border-color-base solid;
			
			/deep/ .uni-date-editor--x {
				height: 80rpx;
				border: 0;
			}
		}
		
		.items {
			padding-top: 120rpx;
			
			.card-area {
				margin-left: 20rpx;
			}
		}
		
		.loadStatus {
			padding-top: 60rpx;
			padding-bottom: 180rpx;
		}
	}
</style>
