<!-- <template>
	<view class="saoma">
		<qrcode-stream :camera="auto" :torch="torchActive" @decode="onDecode" @init="onInitData" />
	</view>
</template>

<script>
	import { QrcodeStream } from 'vue-qrcode-reader'
	
	export default {
	        components: {
	            QrcodeStream
	        },
	        data() {
	            return {
					torchActive: false,
					camera: 'front',
	            }
	        },
	        methods: {
	            onDecode(result) {
					getApp().globalData.acceptAddress = result;//扫码获取到的数据
					uni.navigateBack({
					    delta: 1
					});
	            },
	            async onInitData(promise) {
	                try {
	                    await promise
	                } catch (error) {
	                    if (error.name === 'NotAllowedError') {
	                        this.error = "ERROR: 您需要授予相机访问权限"
	                    } else if (error.name === 'NotFoundError') {
	                        this.error = "ERROR: 这个设备上没有摄像头"
	                    } else if (error.name === 'NotSupportedError') {
	                        this.error = "ERROR: 所需的安全上下文(HTTPS、本地主机)"
	                    } else if (error.name === 'NotReadableError') {
	                        this.error = "ERROR: 相机被占用"
	                    } else if (error.name === 'OverconstrainedError') {
	                        this.error = "ERROR: 安装摄像头不合适"
	                    } else if (error.name === 'StreamApiNotSupportedError') {
	                        this.error = "ERROR: 此浏览器不支持流API"
	                    }
	                }
	            }
	        }
	    }
	</script>
	
	<style lang="scss" scoped>
	    .saoma {
	        width: 100vw;
	        height: 100vh;
			background-color: #000000;
	    }
	</style> -->