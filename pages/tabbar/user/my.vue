<template>
  <view class="user">
    <!-- 个人信息 -->
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="header" @click="userDetail">
      <view class="head-1">
        <image :src="userInfo.face || '/static/missing-face.png'"></image>
      </view>
      <view class="head-2" v-if="userInfo.id">
     <!--   <view class="user-name">{{ userInfo.username }}</view> -->
        <view class="user-name">{{ userInfo.member.mobile }}</view>
		
		<view v-for="(item, index) in userInfo.member.roles" :key="index">
		  <view>
			   <view class="head-image">
					<image :src ="item.imgUrl" class="mr-10"></image>  {{ item.roleName }}
			   </view>
		  </view>
		</view>
      </view>
      <view class="head-2" v-else>
        <view class="user-name">登录/注册</view>
      </view>
	  
      <u-icon name="arrow-right"></u-icon>
	  
    </view>
    <!-- 积分，优惠券，关注， -->
    <div class="pointBox box">
      <u-row text-align="center" gutter="16" class="point">
        <u-col text-align="center" span="4" @click="navigateTo('/pages/mine/profit/memberProfit')">
          <view>SSD券</view>
          <view class="money">{{ ssd.toFixed(4) || 0 }}</view>
        </u-col>

        <u-col text-align="center" span="4" @click="navigateTo('/pages/mine/profit/points')">
          <view>积分</view>
          <view >{{  point || 0 }}</view>
        </u-col>

        <u-col text-align="center" span="4">
          <view>今日SSD价格</view>
          <view>{{ unitPrice.toFixed(4) || 0 }}</view>
        </u-col>
      </u-row>
      <!-- 我的订单，代付款 -->
      <view class="order">
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=0')">
          <div class="bag bag1">
            <u-icon name="order" size="35" color="#fff"></u-icon>
          </div>
          <view style="width: 50px;">我的订单</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=1')">
          <div class="bag bag2">
            <u-icon name="bag-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>待付款</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=3')">
          <div class="bag bag3">
            <u-icon name="car-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>待收货</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/evaluate/myEvaluate')">
          <div class="bag bag4">
            <u-icon name="star-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>待评价</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/mine/address/addressManage')">
          <div class="bag bag5">
            <u-icon name="server-fill" size="35" color="#fff"></u-icon>
          </div>
          <view style="width:90rpx;">地址管理</view>
        </view>
      </view>
    </div>
    <!-- 常用工具 -->

    <tool :storeId="storeId" :serviceProvider="serviceProvider" :promoters="promoters"/>

  </view>
</template>
<script>
import tool from "@/pages/tabbar/user/utils/tool.vue";
import { getUserWallet,getUserInfo,queryConfigureByType,getPromoters} from "@/api/members";
export default {
  components: {
    tool,
  },
  data() {
    return {
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false,
			ssd: 0,
			point: 0,
      userInfo: {},
			storeId: null,
			serviceProvider: null,
      unitPrice: 0,
			walletNum: 0,
			promoters: null,
      footNum: "",
      walletNum: "",
    };
  },
  onLoad() {},
  onShow() {
    this.userInfo = this.$options.filters.isLogin();
    if (this.$options.filters.isLogin("auth")) {
      this.getUserOrderNum();
    } else {
      this.walletNum = 0;
    }
  },
  onPullDownRefresh() {
    this.getUserOrderNum();
    this.userInfo = this.$options.filters.isLogin();
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navigateTo("/pages/mine/set/setUp");
    }
  },
  // #endif

  mounted() {},
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
		member(){
			
		},
    userDetail() {
      this.userInfo.id
        ? this.navigateTo("/pages/mine/set/personMsg")
        : this.$options.filters.navigateToLogin();;
    },
    async getUserOrderNum() {
      uni.stopPullDownRefresh();

      Promise.all([
				getUserInfo(),
				queryConfigureByType({'type': 'unitPrice'}),
				getPromoters(),
			]).then((res) => {
				this.userInfo = res[0].data.result;
				this.serviceProvider = res[0].data.result.member.serviceProvider;
				this.ssd = res[0].data.result.member.ssd;
				this.point = res[0].data.result.member.point;
				this.storeId = res[0].data.result.member.storeId;
				this.unitPrice = res[1].data.result;
				this.promoters = res[2].data.result;
				
				getApp().globalData.isServiceProvider = !!this.serviceProvider;
				getApp().globalData.isPromoters = this.promoters;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
html,
body {
  overflow: auto;
}
.money {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.user {
	
  .header {
    max-width: 100%;
    padding: 0 30rpx 0 6%;
    height: calc(var(--status-bar-height) + 360rpx);
    background-size: cover;
    border-bottom-left-radius: 15rpx;
    border-bottom-right-radius: 15rpx;
    background-color:#FF573E;
    background-position: bottom;
    background-repeat: no-repeat;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
	align-items: center;
	
    .head-1 {
      text-align: center;
      width: 152rpx;
      position: relative;
      display: flex;
      align-items: center;
	  
      image {
        width: 152rpx;
        height: 144rpx;
        border-radius: 50%;
        border: 3px solid #fff;
      }
	  
    }
    .head-2 {
      flex: 1;
      margin-left: 30rpx;
      line-height: 1.5;
    }
	.head-image{
		image{
			padding-top: 10rpx;
			width: 25rpx;
			height: 25rpx;
		}
	}
  }
  .pointBox {
    width: 94%;
    margin: 0 3%;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);
  }
  .point {
    text-align: center;
    height: 160rpx;

    font-size: $font-sm;
    // #ifdef MP-WEIXIN
    padding: 24rpx;
    // #endif
    .u-col {
      view {
        color: $u-main-color;
        font-size: 28rpx;
      }
      view:last-child {
        margin-top: 8rpx;
        color: $main-color;
        font-size: $font-lg;
      }
    }
  }
  .order {
    height: 140rpx;
    text-align: center;
    font-size: $font-sm;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 3%;
    color: #999;
    .order-item {
      position: relative;
      line-height: 2em;
      width: 96rpx;
      :first-child {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}

.box {
  transform: translateY(-30rpx);
}
.user-name {
  font-size: 34rpx;
}

.bag {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin: 0 auto;
}

.bag1 {
  background: #ff4a48;
}

.bag2 {
  background: #ff992f;
}

.bag3 {
  background: #009ee0;
}

.bag4 {
  background: #00d5d5;
}

.bag5 {
  background: #28ccb0;
}
</style>
