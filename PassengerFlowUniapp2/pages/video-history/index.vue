<template>
	<view class="container">
		<Header>
			<template slot='center'>
				<view class="form-wrapper" @click="openPopup">
					<view class="">
						{{ videoTypeMap[searchForm.type] }}
					</view>
					<view class="">
						{{ searchForm.date }}
					</view>
				</view>
			</template>
		</Header>
		<TreeData :treeData='deviceTreeData' @searchVideo="playVideo"></TreeData>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-wrapper">
				<view class="title"> 修改查询条件 </view>
				<view class="type">
					<view class="label">类型：</view>
					<uni-data-checkbox v-model="searchForm.type" :localdata="videoTypeRange"></uni-data-checkbox>
				</view>
				<view class="dateTime">
					<view class="label">日期：</view>
					<view class="example-body">
						<uni-datetime-picker
							type="date"
							:value="searchForm.date"
							@change="change"
						/>
					</view>				
				</view>
                <button @click="saveFormData" type="primary" plain="true">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// import $conf from "../../config.js"
	import moment from "moment"
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
				videoTypeRange: [{
					"value": '0',
					"text": "前端存储"
				}, {
					"value": '1',
					"text": "云存储"
				}],
				videoTypeMap: {
					'0': '前端存储',
					'1': '云存储',
				},
				
				searchForm: {
					type: '0',
					date: moment().startOf("day").format('YYYY-MM-DD')
				},
				deviceTreeData: []
			}
		},
		mounted() {
			this.fetchDeviceTree()
		},
		methods: {
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
				// 调用安卓原生的类,数据交互,让安卓唤起页面
				let keyData = {
					"method": "playHistoryVideo",
					"data": {
						"url": `http://${getApp().globalData.host}:${getApp().globalData.port}`,
						// "url": `http://${$conf.host}:${$conf.port}`,
						"token": token,
						"puid": currentItem.puid,
						"resIdx": currentItem.idx,
						"isCloud": this.searchForm.type === '1' ? true : false,
						"utc_time": moment(this.searchForm.date).unix()
					}
				};
				console.log(keyData);
				let VideoPlugin = plus.android.importClass('com.tsinglink.qx_tc_dclound.plugin.VideoPlugin');
				VideoPlugin.onMethodCall(JSON.stringify(keyData));
			},
			change(e) {
				this.searchForm.date = e
			},
			openPopup() {
				this.$refs.popup.open('top')
			},
			saveFormData() {
				this.$refs.popup.close()
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
		::v-deep .uni-calendar--fixed {
			bottom: -316rpx;
		}
		uni-button {
			margin-top: 60rpx;
			width: 60%;
		}
	}
</style>
