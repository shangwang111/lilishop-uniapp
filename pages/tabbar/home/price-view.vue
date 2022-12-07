<template>
	<view class="wrapper">

		<qiun-data-charts class="charts" type="demotype"
		 background="none" 
		 :chartData="chartData" :style="{height:screenHeight+'px'}"
		 :opts="{enableScroll: true, xAxis: { scrollShow: true, itemCount: 6, disableGrid: true }}"
		 :ontouch="true"></qiun-data-charts>
	</view>
</template>

<script>
	import { getSsdPriceTopData } from "@/api/home"; //获取楼层装修接口
	
	export default {
		data() {
			return {
				title:"行情走势",
				wssdHisDataList:[],
				chartData:{},
				screenHeight:"200"
			}
		},
		onLoad(params) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight - 130;
		},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				let self = this;
				getSsdPriceTopData().then((res) => {
					if (res.data.success) {
						self.wssdHisDataList = res.data.result;
						
						let arr = [], arr1=[];
						self.wssdHisDataList.forEach((value, _index) => {
							arr.push(value.createTime.substr(5, 5));
						  arr1.push(parseFloat(value.numericalAlue));
						});

					  let data1 = {
							categories: arr,
							series: [
								{
									name: "价格",
									data: arr1,
									index: 0
								}
							]
						};
						
						this.chartData = JSON.parse(JSON.stringify(data1));
					}
					
					console.log(this.chartData)
				});
				
			}
		}
	}
</script>

<style>
.charts {
  margin-top: 50rpx;
	width: 100%;
}
</style>
