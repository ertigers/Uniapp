<template>
	<view class="container">
		<Header title="实时视频"></Header>
		<TreeData :treeData='deviceTreeData' @searchVideo="playVideo"></TreeData>
	</view>
</template>

<script>
	// import $conf from '../../config.js';
	import qxAPI from "../../api/index.js"
	import Header from "../../component/Header.vue"
	import TreeData from "../../component/TreeData.vue"
	export default {
		components: {
			Header,
			TreeData
		},
		data() {
			return {
				deviceTreeData: []
			}
		},
		mounted() {
			this.fetchDeviceTree()
		},
		methods: {
			// 获取区域门店设备树
			async fetchDeviceTree() {
				let query = {
					treetype: 1
				}
				let data = await qxAPI.getDeviceTree(query)
				this.deviceTreeData = data.rows
			},
			playVideo(currentItem) {
				console.log(currentItem);
				let token = uni.getStorageSync('qx_tc_token');
				let keyData = {
					"method": "playVideo",
					"data": {
						"url": `http://${getApp().globalData.host}:${getApp().globalData.port}`,
						// "url": `http://${$conf.host}:${$conf.port}`,
						"token": token,
						"res-list": [
							{
								"mName": currentItem.name,
								"mPuid": currentItem.puid,
								"mResType": "IV",
								"mResIdx": currentItem.idx
							}
						]
					}
				};
				console.log(keyData);
				// 调用安卓原生的类,数据交互,让安卓唤起页面
				let VideoPlugin = plus.android.importClass('com.tsinglink.qx_tc_dclound.plugin.VideoPlugin');
				VideoPlugin.onMethodCall(JSON.stringify(keyData));
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navigator-wrapper {
		padding: 20px;
		font-size: 16px;
		line-height: 24px;

		.navigator-item {
			display: flex;
			align-items: center;
			padding: 20rpx 0;

			image {
				width: 30rpx;
				height: 30rpx;
				padding-right: 30rpx;
			}
		}
	}

	.form-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 22rpx;
	}

	.popup-wrapper {
		height: 400rpx;
		background-color: #FFFFFF;
		padding: 60rpx;

		.title {
			font-size: 28rpx;
			font-weight: 600;
			text-align: center;
			margin-bottom: 40rpx;
		}
		.label {
			margin-right: 20rpx;
		}
		.type, .dateTime {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			margin-bottom: 40rpx;
		}
		uni-button {
			margin-top: 60rpx;
			width: 60%;
		}
	}
</style>
