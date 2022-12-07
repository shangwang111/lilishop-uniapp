<template>
	<view>
		<view class="content">
			<view class="item">
				<view class="label-input">手机号</view>
				<input class="form-text" type="number" v-model="form.userName" placeholder="请输入手机号"/>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">姓名</view>
				<input class="form-text" v-model="form.name" placeholder="请输入姓名"/>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">推广员(%)</view>
				<slider class="slider" :value="progress1" @changing="sliderChange1" @change="sliderChange1" :max="max" step="1" show-value/>
			</view>
			<view class="split-line-1"></view>
			<view class="item">
				<view class="label-input">服务商(%)</view>
				<slider class="slider" :value="progress2" @changing="sliderChange1" @change="sliderChange1" :max="max" step="1" show-value/>
			</view>
		</view>
		<button class="btn-submit" size="mini" @click="handleAdd">提交</button>
		
	</view>
</template>

<script>
	import { addOfPromoters, updateOfPromoters } from "@/api/mine-promoter.js";
	
	export default {
		data() {
			return {
				progress1: 0,
				progress2: 12,
				max: 12,
				form: {
					name: null,
					userName: null,
					incomeComparison: 0
				},
				bottonType: 0,//0插入  1修改
			};
		},
		onLoad() {
			let data = getApp().globalData.promoter;
			if(data) {
				this.form = data;
				this.bottonType = 1;
				this.progress1 = data.incomeComparison
				this.progress2 = this.max - data.incomeComparison
			}
		},
		methods: {
			sliderChange1(e) {
				this.progress1 = e.detail.value;
				this.progress2 = this.max - e.detail.value;
			},
			sliderChange2(e) {
				this.progress2 = e.detail.value;
				this.progress1 = this.max - e.detail.value;
			},
			checkStatus() {
				if (!this.form.userName) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none',
						duration: 2000
					});
					return false
				}
				else if (!this.form.name) {
					uni.showToast({
						title: '姓名不能为空',
						icon: 'none',
						duration: 2000
					});
					return false
				}
				else if (!this.form.incomeComparison) {
					uni.showToast({
						title: '收入比例不能为空',
						icon: 'none',
						duration: 2000
					});
					return false
				} else {
					return true
				}
			},
			
			handleAdd() {
				let self = this;
				
				uni.showLoading({
					title: "正在提交...",
				});
				self.form.incomeComparison = self.progress1;
				if(self.bottonType == 0) {
					addOfPromoters(self.form).then((res) => {
						uni.hideLoading();
						if (res.data.success) { 
							uni.navigateBack()
						} 
					});
				} else {
					updateOfPromoters(self.form).then((res) => {
						uni.hideLoading();
						if (res.data.success) { 
							uni.navigateBack()
						} 
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head-info {
		background-color: #fff;
		height: 80rpx;
	}
	
	.content {
		width: 100%;
		background-color: #ffffff;
		border-radius: 20rpx;
		
		.item {
			padding: 40rpx 30rpx;
			display: flex;
			align-items: center;
			
			.item-info {
				display: flex;
				align-items: center;
				height: 80rpx;
				width: 100%;
				justify-content: space-around;
			}
			
			.label-input {
				font-size: 32rpx;
				font-weight: 700;
				width: 200rpx;
			}
			
			.item-input-radio {
				display: flex;
				align-items: center;
			}
			
			.item-input {
				width: calc(100% - 200rpx);
			}
			
			.slider {
				width: calc(100% - 200rpx);
			}
		}
		
		
	}
	
	.btn-submit {
		margin-left: 40rpx;
    width: calc(90% - 20rpx);
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		border-radius: 40rpx;
		text-align: center;
		margin-top: 100rpx;
		background: #FF573E;
	}
	
</style>
