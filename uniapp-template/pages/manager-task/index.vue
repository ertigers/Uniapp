<template>
    <view>
		<Header title="巡店任务"></Header>
		<view class="time-wrapper">
			<uni-datetime-picker
				v-model="range"
				type="daterange"
				rangeSeparator="至" 
			/>
		</view>
		<view class="task-box">
			<view class="task-item" v-for="(item,index) in taskList" :key="index"
				@click="gotoProblem(item)">
				<view class="task-name">
					{{ item.name }}
				</view>
				<view class="number-content">
					<text class="yellow">{{item.status["0"]}}</text>
					<text class="red">{{item.status["8"]}}</text>
					<text class="grey">{{item.status["9"]}}</text>
				</view>
				<image src="../../static/icon/common/ico-details-nor@2x.png" mode=""></image>
			</view>
		</view>
    </view>
</template>

<script>
import Header from "../../component/Header.vue"
import moment from "moment"
import qxAPI from "../../api/index.js"
export default {
components:{ Header },
	data() {
		return {
			range:[moment().startOf('month').format('YYYY-MM-DD'),moment().endOf('month').format('YYYY-MM-DD')],
			userIndex: undefined, 
			taskList:[]
		}
	},
	watch:{
		range: {
			handler(newval) {
				this.fetchTaskList()
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		// 获取任务列表
		async fetchTaskList() {
			if(!this.range.length) {
				return uni.showToast({
					icon: 'none',
					title: "时间不能为空！",
					duration: 1000
				});
			}
			let loginData = this.getLocalStorage('loginData');
			this.userIndex = loginData.userData.index
			let begindate = this.range[0].split('-').join('')
			let enddate = this.range[1].split('-').join('')
			let query = {
				rows: 99999,
				manager_user_index: this.userIndex,  
				begindate,
				enddate
			}
			const data = await qxAPI.getTaskList(query)
			let taskList = [{name:'智能巡检',index: 0},...data.rows]
			let taskIndex = []
			taskList.forEach(item=>{
				taskIndex.push(item.index)
			})
			const query1 = {
				report_user_index: this.userIndex,
				task_index: taskIndex.join(','),
				begindate,
				enddate
			}
			const result = await qxAPI.getProblemStatistics(query1)
			taskList.forEach(item=>{
				item.status = {"0":0,"8":0,"9":0}
				result.rows.forEach(subItem =>{
					if(subItem.task_index === item.index) {
						item.status = subItem.status
					}
				})
			})
			this.taskList = taskList
			console.log(this.taskList);
		},
		
		// 跳转到问题列表
		gotoProblem(currentItem) {
			console.log(currentItem);
			let query = {
				manager_user_index: this.userIndex,  
				task_index: currentItem.index
			}
			uni.navigateTo({
				url:"./list?query=" + encodeURIComponent(JSON.stringify(query))
			})
		},
	
	}
}
</script>

<style lang="scss" scoped>
/deep/ {
	.uni-date-x--border {
		border: none;
	}
}
.right-image-wrapper {
	display: flex;
	align-items: center;
	
	image { 
		width: 40rpx;
		height: 40rpx;
	}
} 
.time-wrapper {
	padding-left: 20rpx;
	padding-right: 50rpx;
	background-color: #FFFFFF;
}
.task-box {
	margin-top: 32rpx;
	.task-item {
		position: relative;
		height: 96rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		.task-name {
			font-size: 24rpx;
			font-weight: 600;
			max-width: 500rpx;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		image {
			width: 28rpx;
			height: 28rpx;
		}
		.number-content {
			position: absolute;
			top: 22rpx;
			right: 70rpx;
			
			text {
				font-size: 26rpx;
				margin-right: 20rpx;
			}
			.yellow {
				color: #FF9900;
			}
			.red {
				color: red;
			}
			.grey {
				color: grey;
			}
		}
	}
}
</style>
