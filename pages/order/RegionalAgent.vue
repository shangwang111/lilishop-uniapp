<template>
	<view style="background-color: #e4e7ed">
      <u-navbar :background="navObj" :is-back="false">
		  <div class="title"> 区域名称</div>
			<u-search :show-action="true" :animation="true"
			  placeholder="搜索签约区域"
			  @search="submitSearchRegionList()"
			  @clear="submitSearchRegionList()"
			  @custom="submitSearchRegionList()"
			  v-model="params.areaName"
			>
			</u-search>
        <div class="btn" @click="submitSearchRegionList()"><i class="icon iconfont icon-ssk"></i></div>
		</u-navbar>
			<div style="color: brown;font-size: 28rpx;margin-left: 20rpx">※仅展示已签约的区域</div>
		<view class="container" >
		  <div class="region-list">
		  	<div class="region-item" v-for="(item, item_index) in serviceProviderList"
		  		:key="item_index">
		  		<div class="areaName">
		  				{{ item.parentName }} {{ item.areaName }}
		  		</div>
					<div class="signCreateTime">
            签约日期: {{ item.signCreateTime==null?'':item.signCreateTime.substring(0, 10) }}
					</div>
					<div class="region-img">
						<image class="no-icon" src="@/static/img/regionAgent.png"></image>
					</div>
		  	</div>
				
		  </div>
			
			<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		</view>
	</view>
</template>

<script>
	import { queryServiceProvider } from "@/api/mine-promoter.js";
	export default {
		data() {
			return {
				params:{
					pageNumber: 1,
					pageSize: 10,
					isSignIn: '0',
					areaName: '',
				},
        navObj: {
          background: "rgb(255, 87, 62)",
        },
				pages: 1,
				serviceProviderList: [],
				loadStatus: "",
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			submitSearchRegionList(){
				this.params.pageNumber = 1;
        this.pages = 1;
				this.serviceProviderList = [];
				this.getData();
			},
			onReachBottom() {
				this.getData();
			},
			onPullDownRefresh() {
				//下拉刷新
				this.params.pageNumber = 1;
        this.pages = 1;
				this.serviceProviderList = [];
				this.getData();
			},
			getData() {
				if (this.pages > this.params.pageNumber) {
					this.params.pageNumber++;
				} else if (this.params.pageNumber > 1 && this.pages == this.params.pageNumber) {
          this.loadStatus="没有更多数据了!"
          return
        }
				uni.showLoading({
					title: "加载中",
				});

				let that = this;
				queryServiceProvider(this.params).then((res) => {
					uni.hideLoading();
					console.log(res)
					that.pages = res.data.result.pages;
					res.data.result.records.forEach((item) => {
						that.serviceProviderList.push({
							"areaId": item.areaId,
							"areaName": item.areaName,
							"parentName": item.parentName,
              "areaServiceProviderMobile": item.areaServiceProviderMobile,
							"areaServiceProviderName": item.areaServiceProviderName,
							"signCreateTime": item.signCreateTime,
							"isSignIn": item.isSignIn,
						})
					})
				});
			},
			// handleClick(item) {
			// 	uni.navigateTo({
			// 		url: `/pages/passport/article?id=${item.id}&title=联德头条`,
			// 	});
			// },
	  },
  }
</script>

<style lang="scss" scoped>
.title {
  display: block;
  width: 200rpx;
  color:white;
  text-align: center;
  font-size: 28rpx;
  letter-spacing: 2rpx;
  // #ifdef MP-WEIXIN
  margin-left: 1rpx;
  // #endif
}
.nav-search {
  width: 200rpx;
  padding-left: 30rpx !important;
  padding-right: 20rpx !important;
}

.region-list {
	margin: 15rpx;
}

.region-item {
	background-color: white;
	border-radius: 10rpx;
	height: 120rpx;
	margin-top: 30rpx;
	border: 1px solid lightgrey;
	padding: 10rpx;
	position: relative;
}

.signCreateTime {
	margin-top: 30rpx;
	font-size: 22rpx;
}

.region-img {
	left: calc(100% - 80rpx);
	position: absolute;
	width: 60rpx;
	height: 60rpx;
	top: 15rpx;
	border-radius: 10rpx;
	overflow: hidden;
	>image {
		width: 100%;
		height: 100%;
	}
}


</style>
