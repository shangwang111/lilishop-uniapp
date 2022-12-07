<template>
	<div class="layout">
		<u-sticky style="margin-left: 5px;margin-top: 5px">
			<div class="title">
				<image class="ico-article" src="../../../../static/icons/ico_article.png"></image>
				<view class="article-title fs-28 ml-10" style="font-size:30rpx">联德头条</view>
				
				<div
				  @click="moreClick"
				  class="more-btn"
				>
				  更多资讯 >
				</div>
			</div>
		</u-sticky>
		<div class="article-list">
			
			<swiper class="swiper-box" duration="300" @change="" :indicator-dots="true" indicator-color="#ae8d8d96">
				<swiper-item @click="handleClick(item)" v-for="(item, item_index) in articleList"
					:key="item_index" class="swiperItem">
					<div class="article-item" >
						<div class="store-goods-desc">
							<div class="store-goods-title">
								{{ item.title }}
							</div>
							<div class="store-goods-price">
								{{ item.createTime }}
							</div>
						</div>
						<div class="goods-img">
							<u-image :src="item.url" class="img" height="100%" mode="aspectFill" width="100%">
								<u-loading slot="loading"></u-loading>
							</u-image>
						</div>
					</div>
				</swiper-item>
			</swiper>
			
		</div>
	</div>
</template>

<script>
import { getNewList } from "@/api/article.js";
	export default {
		data() {
			return {
				params:{
					pageNumber: 1,
					pageSize: 5,
				},
				pages: 1,
				articleList: [],
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
			getData() {
				if (this.pages > this.params.pageNumber) {
					this.params.pageNumber++;
				}
				
				let that = this;
				getNewList(this.params).then((res) => {
					console.log(res)
					that.pages = res.data.result.pages;
					res.data.result.records.forEach((item) => {
						that.articleList.push({
							"id": item.id,
							"title": item.title,
							"articleCategoryName": item.articleCategoryName,
              "createTime": item.createTime,
							"url": item.url,
						})
					})
				});
				
			},
			handleClick(item) {
				uni.navigateTo({
					url: `/pages/passport/article?id=${item.id}&title=联德头条`,
				});
			},
			moreClick() {
				uni.navigateTo({
					url: `/pages/passport/articleList`,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./tpl.scss";
	$w_94: 94%;

  .swiper-box {
    height: 210rpx;
  }
	.layout {
		padding: 8px 0;
		background: #f9f9f9;
	}
.ico-article {
	width: 30rpx;
	height: 30rpx;
	margin-left: 13rpx;
	display: inline-block;
	vertical-align: middle;
}

.title{
	display: inline-block;
	vertical-align: middle;
	height: 80rpx;
	width: 100%;
}

.article-title {
	display: inline-block;
	vertical-align: middle;
}

.more-btn {
		float: right;
		width: 170rpx;
		height: 40rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		text-align: center;
		margin-top: 10rpx;
		margin-right: 10rpx;
	display: inline-block;
}

.article-list {
		width: 100%;
		height: 100%;
}

.swiperItem {
	height: 180rpx;
	background-color: white;
}

.article-item {
	width: 100%;
	margin-bottom: 10px;
	border-radius: 0.4em;
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	height: 150rpx;
	background-color: white;
	position: relative;
	// border-bottom: 1rpx $border-color-base solid;
}

	.store-goods-desc {
		width: calc(90% - 200rpx);
		height: 100%;
		background: #fff;
		padding: 8rpx 0 8rpx 8rpx;
		margin: 0 auto;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		left: 10rpx;

		.store-goods-title {
			font-size: 24rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		>.store-goods-price {
			line-height: 2;
			font-size: 20rpx;
			color: $font-color-light;
			bottom: 15rpx;
			position: absolute;
		}
	}
	
	.goods-img {
		left: calc(90% - 160rpx);
		position: absolute;
		width: 220rpx;
	  height: 150rpx;
		top: 5rpx;
		border-radius: 10rpx;
		overflow: hidden;
		>img {
			width: 100%;
			height: 100%;
		}
	}

</style>
