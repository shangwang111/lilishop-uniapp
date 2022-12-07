<template>
	<!-- 经营范围选择 -->
	<view class="screenCon" @tap.stop="tapstop">
		<view class="headbar">
			<image class="leftArrow" @click="tapCancel" src="/static/index/arrow.png" mode=""></image>
			<text class="labelTitle">选择{{title}}</text>
			<text class="confirm" @click="tapback">确定</text>
		</view>
		<scroll-view scroll-y="true" style="height: 450rpx; width: 710rpx;" :show-scrollbar="false">
			<view class="optionCon"> 
				<view class="optionitem" :class="ids.indexOf(item.id) >=0 ?'activeitem':''" v-for="(item,index) in lists" :key="index"
					@click="tapitem(item.id,item.name)">
					<text class="optionname" :class="ids.indexOf(item.id) >=0 ?'activename':''">{{item.name}}</text>
				</view>
			</view>
			<view class="" style="height: 40rpx;"></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "indexScreen",
		props:{
			title:{
				type:String,
				default:'经营范围(最多三项)'
			},
			list:{
				type: Array,
				default: [],
			},
			setType:{
				type: Boolean,
				default: false, //表示为注册，true 搜索为false
			},
			defultValue:{
				type:String,
				default:''
			},
			defultName:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				current: 0,
				ids:[],
				names:[],
				indexs:[],
				lists:[],
			};
		},
		created() {
			if(this.defultValue != ''){
				this.ids = this.defultValue.split(','); 
				this.names = this.defultName.split(',');
			}
			setTimeout(()=>{
				this.lists = this.list;
			},300)
		},
		destroyed() {
			this.$off('change')
		},
		methods: {
			tapstop() {},
			tapitem(id,name){
				if(this.ids.indexOf(id) >=0){
					this.ids.splice(this.ids.indexOf(id),1)
					this.names.splice(this.names.indexOf(name),1)
				}else{ 
					if(this.setType){//注册情况
						if(this.ids.length< 3){
							this.ids.push(id);
							this.names.push(name);
							return
						}
					}else{
						this.ids.push(id);
						this.names.push(name);
						return
					}
				}
			},
			tapback(){ 
				let idss = this.ids.join(',');
				let namess = this.names.join(",");
				this.$emit('change',idss,namess)
			},
			tapCancel(){
				this.$emit('close',{})
			}
		}
	}
</script>

<style lang="scss">
	.screenCon {
		width: 750rpx;
		padding: 0rpx 20rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		background-color: #FFFFFF;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.headbar {
		width: 710rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-bottom: 1px solid #EEEEEE;
		padding: 25rpx 20rpx;
	}

	.leftArrow {
		width: 43rpx;
		height: 43rpx;
	}

	.labelTitle {
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
	}

	.confirm {
		font-size: 30rpx;
		color: #F39D0E;
		font-weight: bold;
	}

	.optionCon {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		padding-bottom: 20rpx;
	}

	.optionitem {
		width: 340rpx;
		height: 80rpx;
		margin-top: 25rpx;
		padding: 0 5rpx;
		font-size: 26rpx;
		border-radius: 20rpx;
		background: #EEEEEE;
		text-align: center;
		border: 1px solid #EEEEEE;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.optionname {
		width: 330rpx;
		height: 80rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #333333;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		line-height: 80rpx; 
		overflow: hidden;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
		text-overflow: ellipsis;

	}

	.activeitem {
		background-color: #FFE9D2;
		border: 1px solid #FB8C16;
		color: #F39A10;
		// text-align: center;
	}

	.activename {
		color: #F39A10;
	}
</style>