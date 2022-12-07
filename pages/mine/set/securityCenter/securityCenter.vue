<template>
  <view class="securityCenter">
    <u-cell-group>
      <u-cell-item title="修改账号密码" @click="navigateTo('/pages/mine/set/securityCenter/editPassword')"></u-cell-item>
      <u-cell-item :title="payPasswordTitle" @click="navigateTo('/pages/mine/set/securityCenter/editPayPassword')"></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script>
	
	import {checkPassword } from "@/api/login";
	export default {
		data() {
			return {
				payPasswordTitle: '修改支付密码',
				mobile: "", //存储手机号
			};
		},
		onLoad() {
			let self = this;
			checkPassword().then((res) => {
				uni.hideLoading();
				if (res.data.success) { 
					if(!res.data.result) {
						self.payPasswordTitle = '设置支付密码'
					}
				}
			});
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
.securityCenter {
  .u-cell {
    line-height: normal;
  }
}
</style>
