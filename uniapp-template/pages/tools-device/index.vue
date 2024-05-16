<template>
	<view class="container">
		<Header title="设备管理"></Header>
		<view class="device-list-wrapper">
			<view class="device-list">
				<view class="" v-if="storeList.length">
					<view class="item" v-for="(item,index) in storeList" :key="index">
						<image class="item-icon" src="../../static/icon/tools/ico-store@2x.png" mode=""></image>
						<view class="item-title">
							{{ item.name }}
						</view>
						<button class="btn-close" type="default" @click="closeAlarm(item)">关闭报警</button>
						<view class="item-btn">
							<switch :checked='item.warning' @change="switch1Change(item)" />
							<text>报警功能</text>
						</view>
						<view class="item-btn" @click="gotoSetting(item)">
							<image class="item-icon" src="../../static/icon/tools/ico-bobao@2x.png" mode=""></image>
							<text>播报设置</text>
						</view>
					</view>
				</view>
				<view class="" v-else>
					暂无数据！
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	import qxAPI from '@/api/tools.js';
	export default {
		components: {
			Header,
		},
		data() {
			return {
				storeList:[],
			}
		},
		mounted() {
			this.fetchStoreList()
		},
		methods: {
			async fetchStoreList() {
				let res = this.getLocalStorage("storeList")
				res.forEach((item)=>{
					item.warning = true,
					item.puid = ''
				})
				for(const store of res) {
					let query = {
						page: 1,
						rows: 100,
						store_index: store.storeId
					}
					const result = await qxAPI.getDeviceList(query)  // 获取设备列表
					// 获取子资源
					let alarmDevice = result.rows.filter(subItem => subItem.type == 2)
					if(!alarmDevice.length) continue
					store.puid = alarmDevice[0].puid || ''
					let query1 = {
						puid: alarmDevice[0].puid || ''
					}
					 qxAPI.getSoundLightAlarm(query1).then(res=>{
						 if(res.code == 0) {
							 store.warning = (res.rows.Value === '1') ? true : false
							 console.log(store.warning);
						 }
					 }).catch(err=>{
						 console.log(err);
					 })
					console.log(store);
				}
				this.storeList = res
				console.log(this.storeList);
			},
			switch1Change(item) {
				let query = {
					puid: item.puid,
					// puid: '201115200352322443',
					value: !item.warning ? 1 : 0
				}
				qxAPI.setSoundLightAlarm(query).then(res=>{
					if(res.code == 0) {
						item.warning = !item.warning
						 uni.showToast({
						 	icon: 'success',
						 	title: "设置成功！",
						 	duration: 1000
						 });
					}
				})
			},
			closeAlarm(item) {
				qxAPI.closeSoundLightAlarm({puid: item.puid}).then(res=>{
					if(res.code == 0) {
						 uni.showToast({
						 	icon: 'success',
						 	title: "已关闭~",
						 	duration: 1000
						 });
					}
				})
			},
			gotoSetting(item) {
				uni.navigateTo({
					url:"./sound?query=" + encodeURIComponent(JSON.stringify(item))
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
uni-page-body {
	height: 100vh;
}
.container {
	height: 100%;
}
.device-list-wrapper {
	.device-list {
		.item {
			display: flex;
			align-items: center;
			padding: 40rpx;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		}
	}
}
.item {
	.btn-close {
		font-size: 12rpx;
		color: #FFFFFF;
		background-color: #007AFF;
	}
	.item-icon {
		width: 44rpx;
		height: 44rpx;
	}
	.item-title {
		flex: 1;
		margin: 0 20rpx;
		
		font-size: 28rpx;
		font-weight: bold;
		color: rgb(0, 0, 0);
		
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.item-btn {
		width: 100rpx;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		> switch {
			transform: scale(0.7);
		}
		> image {
			width: 38rpx;
			height: 38rpx;
			margin: 12rpx 0;
		}
		> text {
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.7);
		}
	}
}
</style>
