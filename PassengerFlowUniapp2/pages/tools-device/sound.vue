<template>
	<view class="container">
		<Header title="门店播报"></Header>
		<view class="content">
			<view class="name">
				<view class="title"> 播报门店: </view>
				<uni-easyinput disabled type="text" v-model="storeData.name"/>
			</view>
			<view class="sound">
				<view class="title"> 播报内容: </view>
				<uni-easyinput type="textarea" autoHeight v-model="storeData.voicetext"
				  placeholder="请输入播报内容"
				></uni-easyinput>
			</view>
			<button class="btn-add" @click="formSubmitHandler">确定</button>
		</view>
	</view>
</template>

<script>
import qxAPI from '@/api/tools.js';
import Header from "../../component/Header.vue"
export default {
components:{ Header },
	data() {
		return {
			storeData:{
			}
		}
	},
	onLoad(options) {
		let params = JSON.parse(options.query)
		this.storeData = params
		this.fetchStoreData()
	},
	methods: {
		async fetchStoreData() {
			let query = {
				page: 1,
				rows: 10,
				store_index: this.storeData.storeId
			}
			const res = await qxAPI.getDeviceList(query)
			console.log(res);
			Object.assign(this.storeData,res.rows[0])
			console.log(this.storeData);
		},
		formSubmitHandler() {
			const query = {
				district_index: this.storeData.districtId,
				store_index: this.storeData.storeId,
				voicetext: this.storeData.voicetext
			}
			qxAPI.setVoiceText(query).then((res)=>{
				if(res.code === 0) {
					uni.navigateBack({
						delta: 1,
						success(res) {
							uni.showToast({
								icon: 'success',
								title: "添加成功！",
								duration: 1000
							});
						}
					});
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
/deep/ {
	.uni-easyinput__content, .is-input-border, .is-disabled {
		background-color: #F2F6FC !important;
		border-color: #F2F6FC !important;
	}
}
.container {
	height: 100vh;
	background-color: #FFFFFF;
	.content {
		padding: 40rpx;
		.name {
			
		}
		.sound {
			margin-top: 40rpx;
		}
		.title {
			font-size: 24rpx;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.7);
			margin-bottom: 24rpx;
		}
	}
}
.btn-add {
	height: 80rpx;
	font-size: 32rpx;
	color: #FFFFFF;
	background: #2A93FF;
	border: none;
	border-radius: 48rpx;
	margin-top: 170rpx;
}
</style>