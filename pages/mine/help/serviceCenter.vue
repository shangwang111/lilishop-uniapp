<template>
  <div class="wrapper container"  :style="{height:screenHeight+'px'}">
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				screenHeight:"200"
			}
		},
		onLoad(params) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight - 130;
		},
		methods: {
			
		}
	}
</script>

<style>
	.container {
		width: 100%;
		height: 100%;
		background: url('http://wangzix.com:9000/hlm/%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F.jpg') no-repeat;
		background-size: 100% 100%;
	}

</style>
