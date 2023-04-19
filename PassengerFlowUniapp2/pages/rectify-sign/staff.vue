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
import { getStaffList } from "../../utils/baseData.js"
export default {
components:{ Header },
	data() {
		return {
			staffList:[]
		}
	},
	onLoad() {

	},
	mounted() {
		this.fetchStaffList()
	},
	methods: {
		async fetchStaffList() {
			let staffList = await getStaffList()
			console.log(staffList);
			this.staffList = staffList
		},
	
		gotoDetail(currentItem) {
			console.log(currentItem);
			uni.navigateTo({
				url:"./index?query=" + encodeURIComponent(JSON.stringify(currentItem))
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
