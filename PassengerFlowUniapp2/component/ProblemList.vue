<template>
    <view>
		<view class="" v-if="problemList.length">
			<view class="problemItem" v-for="(item,index) in problemList" @click="gotoDetail(item)">
				<view class="flex-left">
					<view class="store-name">
						{{storeMap[item.store_index] || "未知门店"}}
					</view>
					<view class="description">
						{{item.description}}
					</view>
					<view class="content-bottom">
						<view class="date"> {{ item.report_time | timeFilter}} </view>
						<view class="day-wrapper" v-if="!item.rectify_time && !item.accept_time">
							<view class="block" :class="computeDay(item.report_time)"></view>
							<view class="">已逾期 {{ item.report_time | dayFilter}} 天</view>
						</view>
						<view class="day-wrapper" v-else-if="item.rectify_time && !item.accept_time">
							<view class="block" :class="computeDay(item.report_time)"></view>
							<view class="">已逾期 {{ item.rectify_time | dayFilter}} 天</view>
						</view>
						<view class="day-wrapper" v-else>
						</view>
					</view>
				</view>
				<view class="main-img">
					<image src="../static/icon/common/ico-details-nor@2x.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="none-data" v-else>
			暂无数据~
		</view>
    </view>
</template>

<script>
import moment from "moment"
export default {
components:{ },
	props: {
		problemList: {
			type: Array,
			default () {
				return []
			}
		},
		navigateString: {
			type: String,
			default () {
				return ''
			}
		}
	},
	data() {
		return {
			storeMap: this.getLocalStorage("storeMap") || {}
		}
	},
	computed:{
		
	},
	filters: {
	  timeFilter: function (value) {
	    if (!value) return ''
	    return moment(value*1000).format('YYYY-MM-DD HH:mm')
	  },
	  dayFilter: function (value) {
		  if (!value) return ''
		  let day = Math.floor((moment().unix() - value)/24/60/60)
		  day = day < 0 ? 0 : day
		  return day
	  }
	},
	mounted() {
	},
	methods: {
		computeDay(value) {
			if (!value) return 0
			let day = Math.floor((moment().unix() - value)/24/60/60)
			let className = ''
			if(day > 4) {
				className = 'red'
			}
			if(day < 5 && day > 3) {
				className = 'yellow'
			}
			return className
		},
		gotoDetail(currentItem) {
			console.log(currentItem);
			if(!this.navigateString) return
			let navigateMap = {
				"P-L-P": "/pages/problem-look/problem?problemDetail=",
				"P-L-R": "/pages/problem-look/rectify?problemDetail=",
				"P-L-A": "/pages/problem-look/accept?problemDetail=",
				"P-E-P": "/pages/problem-edit/problem?problemDetail=",
				"P-E-R": "/pages/problem-edit/rectify?problemDetail=",
				"P-E-A": "/pages/problem-edit/accept?problemDetail="
			}
			uni.navigateTo({
				url: navigateMap[this.navigateString] + encodeURIComponent(JSON.stringify(currentItem))
			})
		},

	}
}
</script>

<style lang="scss" scoped>
.none-data {
	height: 200rpx;
	line-height: 200rpx;
	text-align: center;
}
.problemItem {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 40rpx;
	height: 200rpx;
	border-bottom: 1rpx solid #dedede;
	.flex-left {
		flex: 1;
	}
	.store-name {
		font-size: 28rpx;
		font-weight: 600;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.description {
		color: rgba(0, 0, 0, 0.7);
		font-weight: 600;
		font-size: 24rpx;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		margin: 10rpx 0;
	}
	.content-bottom { 
		// font-size: 24rpx;
		// color: #999999;
		width: 100%;
		display: flex;
		justify-content: space-between;
		
		.date { 
			font-size: 24rpx;
		}
		.day-wrapper {
			font-size: 24rpx;
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			.block {
				width: 18rpx;
				height: 18rpx;
				margin-right: 16rpx;
				background-color: grey;
			}
			.red {
				background-color: red;
			}
			.yellow {
				background-color: yellow;
			}
		}
	}
		
	
	.main-img {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
}
</style>
