<template>
    <view>
		<Header title="打卡记录"></Header>
		<view class="time-wrapper">
			<uni-datetime-picker
				v-model="range"
				type="daterange"
				rangeSeparator="至" 
			/>
		</view>
		<view class="sign-list-box">
			<view class="" v-if="signList.length">
				<view class="item-sign" v-for="(item,index) in signList" :key="index">
					<image :src="item.snapurl" mode=""></image>
					<view class="content">
						<view class="name">
							{{ userInfo.name }}
						</view>
						<view class="name2">
							{{ item.district_index | districtFilter(districtMap) }} | {{ item.store_index | storeFilter(storeMap) }}
						</view>
					</view>
					<view class="time">
						{{ item.snaptime | snaptimeFilter }}
					</view>
				</view>
			</view>
			<view class="" v-else>
				暂无数据~
			</view>
		</view>
    </view>
</template>

<script>
import Header from "../../component/Header.vue"
import moment from "moment"
import qxAPI from "../../api/tools.js"
export default {
components:{ Header },
	data() {
		return {
			range:[moment().startOf('month').format('YYYY-MM-DD'),moment().endOf('month').format('YYYY-MM-DD')],
			userInfo:{},
			signList:[],
			districtMap: {},
			storeMap: {}
		}
	},
	watch:{
		range: {
			handler(newval) {
				console.log("wwwwww");
				this.fetchTaskList()
			},
			immediate: false,
			deep: true
		}
	},
	filters:{
		districtFilter(index,districtMap) {
			console.log(index);
			let value = districtMap[index]
			return value || '未知'
		},
		storeFilter(index,storeMap) {
			let value = storeMap[index]
			return value || '未知'
		},
		snaptimeFilter(time) {
			let value = moment(time*1000).format('YYYY-MM-DD HH:mm')
			return value
		}
	},
	onLoad(options) {
		if(options.length) {
			let userInfo = JSON.parse(options.query)
			this.userInfo = userInfo
			this.fetchTaskList()
		}else {
			let loginData = this.getLocalStorage('loginData');
			const userInfo = loginData.userData
			this.userInfo = { value:userInfo.index,name:userInfo.name }
			this.fetchTaskList()
		}
	},
	mounted() {
		this.districtMap = this.getLocalStorage('districtMap'),
		this.storeMap = this.getLocalStorage('storeMap')
	},
	methods: {
		// 获取打卡记录
		async fetchTaskList() {
			if(!this.range.length) {
				return uni.showToast({
					icon: 'none',
					title: "时间不能为空！",
					duration: 1000
				});
			}
			let query = {
				page: 1,
				rows: 10,
				type: 1,
				user_index: this.userInfo.value,
				begindate: this.range[0].split('-').join(''),
				enddate: this.range[1].split('-').join(''),
			}
			qxAPI.getRecognitionList(query).then(res=>{
				this.signList = res.rows
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
.sign-list-box {
	padding: 0 20rpx;
	margin-top: 20rpx;
	.item-sign {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		background-color: #FFFFFF;
		> image {
			width: 80rpx;
			height: 80rpx;
			// border: 1rpx solid red;
		}
		.content {
			flex: 1;
			margin-left: 20rpx;
			margin-right: 14rpx;
			.name {
				font-size: 24rpx;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.7);
			}
			.name2 {
				font-size: 24rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.7);
				margin-top: 14rpx;
			}
		}
		.time {
			width: 240rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.7);
		}
	}
}

</style>
