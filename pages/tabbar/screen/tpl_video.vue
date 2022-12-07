<template>
  <view class="video-view" :style="{height:screenHeight+'px'}">
		 <video id="myVideo" class="video-content" :src="src" controls="true" autoplay="true"></video> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:"",
				screenHeight:"200"
			}
		},
		onLoad(params) {
			this.src = decodeURIComponent(params.src);
			console.log(this.src);
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
			console.log(this.screenHeight);
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.video-view {
    width: 100%;
		position: relative;
		background-color: black;
		.video-content {
			height: 100%;
			width: 100%;
		}
}


</style>
