<template>
    <view>
		<Header title="选择专管员"></Header>
		<view class="task-box">
			<view class="task-item" v-for="(item,index) in staffList" :key="index"
				@click="gotoDetail(item)">
				<view class="task-name">
					{{  item.name }}
				</view>
				<image src="../../static/icon/common/ico-details-nor@2x.png" mode=""></image>
			</view>
		</view>
    </view>
</template>

<script>
import Header from "../../component/Header.vue"
import qxAPI from "../../api/index.js"
export default {
components:{ Header },
	data() {
		return {
			staffList:[]
		}
	},
	onLoad(options) {
		// 获取任务下专管员列表
		let staffItem = JSON.parse(options.taskItem).children
		let staffListAll = this.getLocalStorage('staffList')
		for(const item of staffItem) {
			for(const subItem of staffListAll) {
				if(item.manager_user_index == subItem.value) {
					item.name = subItem.name
				}
			}
		}
		this.staffList = staffItem
	},

	methods: {
		// 跳转到专管员下的巡店问题
		gotoDetail(currentItem) {
			console.log(currentItem);
			let query = {
				task_index: currentItem.index,
				report_user_index: currentItem.manager_user_index
			}
			uni.navigateTo({
				url:"./problem?query=" + encodeURIComponent(JSON.stringify(query))
			})
		},

	}
}
</script>

<style lang="scss" scoped>
.right-image-wrapper {
	image {
		width: 60rpx;
		height: 60rpx;
	}
}

.task-box {
	.task-item {
		height: 96rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		.task-name {
			font-size: 24rpx;
			font-weight: 600;
		}
		image {
			width: 28rpx;
			height: 28rpx;
		}
	}
}
</style>
