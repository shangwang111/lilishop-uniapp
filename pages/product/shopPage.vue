<template>
	<div>
		<div class="wrapper">
			<!-- 店铺信息模块 -->
			<div class="store flex">
				<image :src="storeInfo.storeLogo" style="width: 100%;height: 150px; border-radius: 10px;"></image>
			<!-- 	<u-image border-radius="10" style="width: 100%;height: 150px;" :src="storeInfo.storeLogo" mode="aspectFill">
				</u-image> -->
			</div>
			
			<div class="box">
				<div class="store-name" >
					{{ storeInfo.storeName || ''}}
					<div class="collection">
						<div class="collection-btn" @click="whetherCollection"> {{ isCollection  ? '已关注' : '+ 关注' }}</div>
					</div>
				</div>
			</div>
			
			
			<view class="addressWrap">
				<view class="script">
					<view class="address">{{storeInfo.storeAddressDetail}}</view>
				</view>
				<view class="btns">
					<view class="btnBar" @click="goMap()"><image class="mapBtn" src="../../static/img/mapBtn.png"></image></view>
					<view class="btnBar" @click="handleTel(storeInfo.memberName)"><image class="telBtn" src="../../static/img/telBtn.png"></image></view>
				</view>
			</view>
			
		</div>

		<div>
			<view class="detail-box">
				<view class="goods-detail">
					<view class="detail_padding">
						<div class="goods-detail-box">
							<div class="goods-detail-item goods-active">商铺介绍</div>
						</div>
						<u-empty class="empty" text="暂无商铺介绍" mode="data"	v-if="!storeInfo.storeDesc"></u-empty>
						<u-parse class="vhtml" :lazy-load="true"	:use-cache="true" :show-with-animation="true"	>
							{{storeInfo.storeDesc}}
						</u-parse>
					</view>
				</view>
			</view>
		</div>

		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</div>
</template>

<script>
import { getStoreBaseInfo, getStoreCategory } from "@/api/store.js";
import {  receiveCoupons,  deleteStoreCollection,  collectionGoods,  getGoodsIsCollect,} from "@/api/members.js";
import config from "@/config/config";
import storage from "@/utils/storage";
export default {
	data() {
		return {
			config,
			scrollTop: 0,
			mainColor: this.$mainColor, //主色调
			current: 0, //初始tabs的索引
			storeId: "",
			storeInfo: {}, //店铺详情
			isCollection: false, //是否关注
		};
	},

	/**
	 * 加载
	 */
	async onLoad(options) {
		this.storeId = options.id;
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onPullDownRefresh() {
		this.init();
	},
	mounted() {
		// #ifdef MP-WEIXIN
		// 小程序默认分享
		uni.showShareMenu({ withShareTicket: true });
		// #endif
		this.init();
	},

	// 下拉加载
	onReachBottom() {
		this.goodsParams.pageNumber++;
	},

	methods: {
		init() {
			// 店铺信息
			this.getStoreData();
			this.enableGoodsIsCollect();
		},
		handleTel(tel) {
			uni.makePhoneCall({
				phoneNumber: tel, //电话号码
				success: function(e) {
				},
				fail: function(e) {
				}
			})
		},
		/**是否收藏店铺 */
		async enableGoodsIsCollect() {
			let res = await getGoodsIsCollect("STORE", this.storeId);
			if (res.data.success) {
				this.isCollection = res.data.result;
			}
		},
		//#ifdef H5
		goMap() {
			console.log('打开地图');
			let self = this
			uni.showActionSheet({
				title: '选择地图应用',
				itemList: ['高德地图', '百度地图', '腾讯地图'],
				success: function(res) {
					self.guide(res.tapIndex)
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		//#endif
		//#ifndef H5
		goMap() {
			let self = this;
			let local = self.storeInfo.storeCenter.split(",");
			let longitude = local[0];
			let latitude = local[1];
			let address = self.storeInfo.storeAddressDetail;
			uni.showLoading({
				title: '跳转中'
			});
			// 获取定位信息
			uni.getLocation({
				type: 'wgs84', 
				success: function(res) {
					if (res.errMsg == "getLocation:ok") {
						uni.openLocation({
							latitude: Number(latitude),
							longitude: Number(longitude),
							address: address,
							scale: 18,
							success: function() {
								console.log('success');
							}
						});
					}
				},
				fail: function(res) {
					console.log(res)
					if (res.errMsg == "getLocation:fail auth deny") {
						uni.showModal({
							content: '检测到您没打开获取信息功能权限，是否去设置打开？',
							confirmText: "确认",
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success: (res) => {
										}
									})
								} else {
									return false;
								}
							}
						})
					}
				}
			});
			setTimeout(function() {
				uni.hideLoading();
			}, 3000);
		},
		//#endif
		guide(signMap) {
			let self = this;
			uni.showLoading({
				title: '跳转中'
			});
			let { position } = this;
			let local = self.storeInfo.storeCenter.split(",");
			let addressName = self.storeInfo.storeAddressDetail;
			if (addressName && addressName != '') {
				var lng = local[0];
				var lat = local[1];
				
				// 高德地图
				uni.getSystemInfo({
					success: (res) => {
						if (res.platform === "android") {
							window.location.href = "androidamap://viewMap?sourceApplication=appname&poiname=" + addressName + "&lat=" + lat + "&lon=" + lng + "&dev=0";
						} else {
							window.location.href ="iosamap://viewMap?sourceApplication=appname&poiname=" + addressName + "&lat=" + lat + "&lon=" + lng + "&dev=0";
						}
						setTimeout(function() {
							if (signMap == 0) {
								window.location.href = "https://uri.amap.com/marker?position=" + lng + "," + lat + "&name=" + addressName;
							} else if (signMap == 1) {
								window.location.href = "https://api.map.baidu.com/marker?location=" + lat + "," + lng + "&title=" + addressName + "&output=html&src=webapp.baidu.openAPIdemo";
							} else {
								window.location.href = `https://apis.map.qq.com/uri/v1/marker?marker=coord:(${lat},${lng})&addr:${addressName}`
							}
						}, 2500);
					}
				})
				
			} else {
				uni.showToast({
					title: '暂不知道该地点位置',
					icon: 'none',
					duration: 300,
				});
			}
			setTimeout(function() {
				uni.hideLoading();
			}, 3000);
		},

		/**
		 * 店铺信息
		 */
		async getStoreData() {
			let res = await getStoreBaseInfo(this.storeId);
			res.data.success
				? (this.storeInfo = res.data.result)
				: uni.reLaunch({ url: "/" });
		},

		/**
		 *  是否收藏
		 */
		whetherCollection() {
			if (this.isCollection) {
				deleteStoreCollection(this.storeId).then((res) => {
					if (res.data.success) {
						this.isCollection = false;
						uni.showToast({
							icon: "none",
							duration: 3000,
							title: "取消关注成功！",
						});
					}
				});
			} else {
				collectionGoods("STORE", this.storeId).then((res) => {
					if (res.data.success) {
						this.isCollection = true;
						uni.showToast({
							icon: "none",
							duration: 3000,
							title: "关注成功！",
						});
					}
				});
			}
		},

	},
};
</script>

<style lang="scss" scoped>
@import "product/product.scss";

.wrapper {
	background: #fff;
	padding: 32rpx;
}
.store {
	align-items: center;
}
.box {
		padding-top: 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 24rpx;
		color: #999;
		flex: 2;
		> .store-name {
			font-size: 34rpx;
			color: #333;
			letter-spacing: 1rpx;
			> .collection{
				float: right;
			}

		}
		> .store-message {
			margin-top: 18rpx;
			> div {
				font-size: 26rpx;
				margin: 0 2rpx;
				> span {
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
					margin-right: 8rpx;
				}
			}
		}
	}
	
	.addressWrap{
		margin:20rpx;
		padding-top: 30rpx;
		background-color:#fff;
		display:flex;
		.script{
			border-radius:30rpx;
			font-size:24rpx;
			width: 300rpx;
			.address{
				color:#2A2A2A;
				margin-bottom:15rpx;
			}
			.distance{
				color:#E26257;
				
			}
		}
		.btns{
			margin-left:40rpx;
			display:flex;
			font-size:20rpx;
			color:#B4B4B4;
			padding-left: 153rpx;
			.btnBar{
				display:flex;
				flex-direction:column;
				align-items:center;
				justify-content:center;
				&:nth-child(2){
					margin-left:30rpx;
				}
			}
			.mapBtn{
				width:73rpx;
				height:73rpx;
				border-radius:50%;
				margin-bottom:10rpx;
			}
			.telBtn{
				width:67rpx;
				height:67rpx;
				border-radius:50%;
				margin-bottom:13rpx;
			}
		}
	}
.collection-btn {
	background: $main-color;
	padding: 6rpx 0;
	width: 140rpx;
	font-size: 24rpx;
	color: #fff;
	border-radius: 100px;
	text-align: center;
}





</style>