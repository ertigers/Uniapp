<template>
	<view class="container">
		<!-- <Notice></Notice> -->
		<view class="notes">
			体彩门店合规监督平台
		</view>
		<view class="ad-wrapper">
			<image src="../../static/image/index/swiper-img.png" mode="aspectFit"></image>
		</view>
		<view class="tools">
			<text class="title-font">视频监控</text>
			<view class="tools-wrapper">
				<navigator url="../video-real/index" hover-class="none" v-if="showModules('video_real')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/video.png" mode=""></image>
						</view>
						<text>实时视频</text>
					</view>
				</navigator>
				<navigator url="../video-history/index" hover-class="none" v-if="showModules('video_history')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/playback.png" mode=""></image>
						</view>	
						<text>历史回放</text>
					</view>
				</navigator>
			</view>
		</view>
		<view class="tools">
			<text class="title-font">门店工具</text>
			<view class="tools-wrapper">
				<navigator url="../tools-manage/index" hover-class="none" v-if="showModules('tools_manage')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/management.png" mode=""></image>
						</view>						
						<text>经营</text>
					</view>
				</navigator>
				
				<navigator url="../tools-device/index" hover-class="none" v-if="showModules('tools_device')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/device.png" mode=""></image>
						</view>						
						<text>设备管理</text>
					</view>
				</navigator>
				<navigator url="../tools-time/index" hover-class="none" v-if="showModules('tools_time')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/time.png" mode=""></image>
						</view>
						<text>时间设置</text>
					</view>
				</navigator>
				<navigator url="../tools-armed/index" hover-class="none" v-if="showModules('tools_armed')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/time.png" mode=""></image>
						</view>
						<text>布防时间</text>
					</view>
				</navigator>
			</view>
		</view>
		<view class="tools">
			<text class="title-font">巡店管理</text>
			<view class="tools-wrapper">
				<navigator url="../rectify-warning/index" hover-class="none" v-if="showModules('patrol_warning')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/warning.png" mode=""></image>
						</view>						
						<text>告警事件</text>
					</view>
				</navigator>
				<navigator url="../leader-task/index" hover-class="none" v-if="showModules('patrol_leader_task')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/task.png" mode=""></image>
						</view>
						<text>任务管理</text>
					</view>
				</navigator>
				<navigator url="../manager-task/problem" hover-class="none" v-if="showModules('patrol_staff_problem')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/problem.png" mode=""></image>
						</view>						
						<text>提交问题</text>
					</view>
				</navigator>
				<navigator url="../manager-task/index" hover-class="none" v-if="showModules('patrol_staff_task')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/task-list.png" mode=""></image>
						</view>
						<text>巡店任务</text>
					</view>
				</navigator>
				<navigator url="../store-problem/index" hover-class="none" v-if="showModules('patrol_store_problem')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/problem.png" mode=""></image>
						</view>						
						<text>问题记录</text>
						<view class="number" v-if="problemNumber">
							{{ problemNumber }}
						</view>
					</view>
				</navigator>
				<navigator url="../rectify-sign/index" hover-class="none" v-if="showModules('patrol_sign')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/problem.png" mode=""></image>
						</view>						
						<text>打卡记录</text>
					</view>
				</navigator>
				
				<navigator url="../rectify-sign/staff" hover-class="none" v-if="showModules('patrol_sign_leader')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/problem.png" mode=""></image>
						</view>						
						<text>打卡记录</text>
					</view>
				</navigator>
			</view>
		</view>
		<view class="tools">
			<text class="title-font">其他</text>
			<view class="tools-wrapper">
				<navigator url="../setting/index" hover-class="none" v-if="showModules('other_setting')">
					<view class="tool-item">
						<view class="img-wrapper">
							<image src="../../static/icon/index/setting.png" mode=""></image>
						</view>						
						<text>设置</text>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import moment from "moment"
import Notice from "../../component/Notice.vue"
import { Modules } from "../../utils/auth.js"
import { setBaseData } from "../../utils/baseData.js"
import qxAPI from "../../api/index.js"
export default {
	components:{ Notice },
	data() {
		return {
			problemNumber: 0
		}
	},
	computed:{
		
	},
	onLoad() {
		
	},
	mounted() { 
		setBaseData()  // 初始化数据，字典
		this.fetchProblemStatistics()  // 店主的问题记录统计
	},
	methods: {
		// 展示模块
		showModules(value) {
			return Modules(value)
		},
		// 获取问题统计
		async fetchProblemStatistics() {
			let store_indexs = this.getLocalStorage("loginData").userData.store_indexs
			let query = {
				begindate: moment().subtract(1,'months').format('YYYY-MM-DD').split('-').join(''),
				enddate: moment().format('YYYY-MM-DD').split('-').join(''),
				store_index: store_indexs,
				count: 1,
				status: 0
			}
			let data = await qxAPI.getProblemList(query)
			this.problemNumber = data.total
		},
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
}
.title-font {
	font-size: 28rpx;
	font-weight: 600;
	border-left: 8rpx solid #5695D2;
	padding-left: 16rpx;
}
.notes {
	padding: 20rpx;
	font-size: 24rpx;
}
.ad-wrapper {
	padding: 20rpx;
	image {
		width: 100%;
		height: 344rpx;
		border-radius: 20rpx;
	}
}
.tools {
	padding: 20rpx;
	.tools-wrapper {
		display: grid;
		justify-content: space-between;
		grid-template-columns: repeat(auto-fill, 210rpx);
		grid-gap: 20rpx;
		padding: 40rpx 0 0;
	}
	.tool-item {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		font-size: 24rpx;
		padding-bottom: 20rpx;
		.img-wrapper {
			width: 120rpx;
			height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FBF9F9;
			border-radius: 40rpx;
			// border: 1rpx solid #e3e3e3;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 10rpx #c8c8c8;
		}
		
		image {
			width: 60rpx;
			height: 60rpx;
		}	
		.number {
			position: absolute;
			top: -6rpx;
			right: 30rpx;
			width: 40rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
			background-color: red;
			border-radius: 50%;
			color: #FFFFFF;
		}
	}
}
</style>
