<template>
  <view class="category-wrap">
    <u-navbar class="navbar" :is-back="false">
      <view class="title" >{{ currentPosition }}</view>
				
      <u-search
        placeholder="商铺分类"
        @search="submitSearchOrderList()"
        @clear="submitSearchOrderList()"
        @custom="submitSearchOrderList()"
        v-model="params.storeName"
      >
      </u-search>
    </u-navbar>
    <view class="content">
      <scroll-view scroll-y scroll-with-animation class="left-aside">
        <view v-for="(item, index) in tabList" :key="item.id" class="f-item b-b" :class="{ active: item.id === currentId }" @click="tabtap(item, index)">
          {{ item.name }}
        </view>
      </scroll-view>
      <scroll-view scroll-with-animation scroll-y class="right-aside" :upper-threshold="-100" :lower-threshold="-100">
        <view v-for="item in storeList" @click="storeDetail(item.id)" :key="item.id" class="s-list d-flex pb-20 pt-20" :id="'main-' + item.id">
          <view class="t-list">
              <u-image width="70px" height="70px" :src="item.storeLogo" :lazy-load="true"></u-image>
          </view>
					<view>
						<view class="s-item fs-30">{{ item.storeName }}</view>
						<view class="s-item fs-20">{{ item.memberName }}</view>
						<view class="fs-20"> {{ item.storeAddressDetail }}</view>
					</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getStoreByCategoryList ,getCategoryList} from "@/api/store.js";
import config from '@/config/config'
import * as API_Members from "@/api/members.js";
export default {
  data() {
    return {
      currentId: 0,
      tabList: [], //左侧标题列表
      storeList: [], //右侧分类数据列表
			params: {
				pageNumber: 1,
				pageSize: 10,
				categoryId: "",
				storeName: "",
			},
			currentPosition: "",
			loadStatus: "加载更多",
			pages: 1,
			total: 0,
    };
  },
  onLoad() {
    this.loadData();
	this.getLocation();
  },
  methods: {
		getLocation(){
			let self = this;
			uni.getLocation({
				type: 'gcj02',
				geocode: true,
				success: function (res) {
					uni.request({
					  url: `https://restapi.amap.com/v3/geocode/regeo`,
					  method: "GET",
					  data: {
					    key: config.aMapKey, 
					    location: `${res.longitude},${res.latitude}`,
					  },
					  success: ({ data }) => {
							self.currentPosition = data.regeocode.addressComponent.district;
					  }
					});
				}
			});
		},
		storeDetail(id){
			uni.navigateTo({
			  url: `/pages/product/shopPage?id=` + id,
			});
		},

    async loadData() {
      let list = await getCategoryList();
      this.tabList = list.data.result;
      this.currentId = list.data.result[0].id;
      this.loadListContent();
    },

    /**
     * 加载列表内容
     */
    loadListContent(index) {
			this.loadStoreList();
    },
		
		submitSearchOrderList(storeName){
			this.loadStoreList();
		},
		
		loadStoreList(){
			let self = this;
			let params = this.params;
			uni.showLoading({
				title: "加载中",
			});
			getStoreByCategoryList(params).then((res) => {
				uni.hideLoading();
				if (res.data.success) {
					self.pages = res.data.result.pages;
					this.storeList = res.data.result.records;
					if (this.storeList.length < self.params.pageSize) {
						self.loadStatus = "没有更多";
					//	self.list.push(...data);
					} else {
						//self.list.push(...data);
						self.loadStatus = "加载更多";
					}
				}
			});
		},
    /**
     * 一级分类点击
     */
    tabtap(item, i) {
      if (item.id != this.currentId) {
				this.params.categoryId = item.id;
				this.currentId = item.id;
        this.loadListContent();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #fdfaff;
}
/* 解决小程序和app滚动条的问题 */
/* #ifdef MP-WEIXIN || APP-PLUS */
::-webkit-scrollbar {
  display: none;
}
/* #endif */
/* 解决H5 的问题 */
/* #ifdef H5 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
  /* 隐藏滚动条，但依旧具备可以滚动的功能 */
  display: none;
}
/* #endif */
.s-list {
  box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.05);
}
.item {
  display: flex;
	justify-content: start;
}
.nav-search {
  padding-left: 30rpx !important;
  padding-right: 20rpx !important;
}
.title {
  display: block;
  width: 200rpx;
  text-align: center;
  font-size: 34rpx;
  letter-spacing: 2rpx;
  // #ifdef MP-WEIXIN
  margin-left: 26rpx;
  // #endif
}
.category-wrap {
  height: 100%;
  .content {
    height: calc(100vh - 94px);
    display: flex;
    color: #333;
    font-size: 28rpx;
    background: #fff;
  }
  .left-aside {
    flex-shrink: 0;
    width: 200rpx;
    height: 100%;
    background-color: #f7f7f7;
  }
  .f-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 97rpx;
    position: relative;
    &.active {
      font-weight: bold;
      color: $light-color;
      background: #fff;
    }
  }
  .right-aside {
    flex: 1;
    overflow: hidden;
    padding: 40rpx 0 0 30rpx;
  }

  .top-img {
    width: 500rpx;
    height: 230rpx;
    border-radius: 8px;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .s-item {
    display: flex;
    align-items: center;
    height: 50rpx;
    padding-top: 16rpx;
    font-weight: 500;
  }
  .t-list {
    display: flex;
    flex-wrap: wrap;
    padding: 12rpx 20rpx 0 0;
  }
  .margin-right {
    margin-right: 0 !important;
  }
  .t-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 150rpx;
    margin-right: 25rpx;
    font-size: 24rpx;
    padding-bottom: 20rpx;
    image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8px;
      margin-bottom: 20rpx;
    }
    /deep/ .u-image {
      width: 140rpx !important;
      height: 140rpx !important;
      border-radius: 8px !important;
      margin-bottom: 20rpx !important;
    }
  }
	
	
}
</style>
