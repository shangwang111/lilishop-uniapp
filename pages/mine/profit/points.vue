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
						<text>{{ item.orderId }}</text> 
					</view>
					<view class="count-danger fs-28">{{ item.integral }}分</view>
				</view>
				
				<view class="card-body break-all">
					<view class="d-flex">
						<text class="label-title">商铺：</text>
						<text>{{ item.merName }}</text>
					</view>
					<view class="d-flex">
						<text class="label-title">收益类型：</text>
						<text>{{ item.integralType === 0 ? '会员收益': '商户收益' }}</text>
					</view>
					<view class="d-flex">
						<text class="label-title">收益时间：</text>
						<text>{{ item.createTime }}</text>
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
	// function dateTimeFormat(dat){
	// 	var hours = dat.getHours()  < 10 ? "0"+(dat.getHours()) : dat.getHours();
	// 	var minutes = dat.getMinutes()  < 10 ? "0"+(dat.getMinutes()) : dat.getMinutes();
	// 	var seconds = dat.getSeconds()  < 10 ? "0"+(dat.getSeconds()) : dat.getSeconds();
	// 	var newTime = hours +":"+ minutes +":"+ seconds;
	// 	return dateFormat(dat)+' '+newTime;
	// }
	
	import { getScore } from "@/api/mine-make.js";
	export default {
		filters: {
			filterDate(val) {
				return dateFormat(new Date(val));
			}
			// ,
			// filterDateTime(val) {
			// 	return dateTimeFormat(new Date(val));
			// }
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
				getScore(params).then((res) => {
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
			
			/deep/ .uni-date-editor--x {
				height: 80rpx;
				border: 0;
			}
		}
		
		.items {
			padding-top: 100rpx;
			
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
