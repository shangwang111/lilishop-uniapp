<template>
	<div class="layout">

		<qiun-data-charts class="charts" type="column"
		 background="none"
		 :chartData="chartData"
		 :opts="{enableScroll: true, xAxis: { scrollShow: true,legend:{fontcolor:'#333333',lineHeight:20},itemCount: 4, disableGrid: true,boundaryGap: false,axisLabel:{interval:0,roate:20} }}"
		 :ontouch="true"></qiun-data-charts>

	</div>
</template>

<script>
	import { getStoreStatisticsTop } from "@/api/store.js";
	export default {
		title: "TOP商家",
		data() {
			return {
				params: {
					searchType: '',
					timeType: '',
				},
				pages: 1,
				storeList: [],
				chartData:{},
				screenHeight:"460",
			};
		},
		onLoad(params) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight - 130;
		},
		mounted() {
			this.getStoreList();
		},
		methods: {
			getStoreList() {
				let that = this;
				getStoreStatisticsTop(that.params).then((res) => {
	
					const dataList = res.data.result;
					let arr = [], arr1=[];
					
					dataList.forEach((value, _index) => {
						arr.push(value.storeName);
					  arr1.push(value.nickNum);
					});
					
					let data1 = {
						categories: arr,
						series: [
							{
								name: "会员数量",
								data: arr1,
							}
						]
					};
					
					this.chartData = JSON.parse(JSON.stringify(data1));
					
				
					console.log(this.chartData)
					
				});
			},
			// handleClick(item) {
			// 	uni.navigateTo({
			// 		url: `/pages/product/shopPage?id=` + item.id,
			// 	});
			// },
		},
	};
</script>
<style lang="scss" scoped>
	.charts {
		margin-top: 50rpx;
		width: 100%;
    height: 100%;
	}
</style>