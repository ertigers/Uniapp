<template>
	<view class="container">
		<Header title="经营统计"></Header>
		<!-- 下拉框 -->
		<view class="select-top">
			<view class="store-select">
				<picker :value="storeIndex" :range="storeNameList"  @change="storeChange">
					<view class="uni-input">{{storeNameList[storeIndex]}}</view>
				</picker>
				<image src="../../static/icon/common/icon-xiala.png" mode=""></image>
			</view>
			<view class="uni-list" v-if="currentIndex != 2">
				<picker mode="date" fields="month" :value="dateStr" @change="bindDateChange">
					<view class="uni-input">{{dateStr}}</view>
				</picker>
				<image src="../../static/icon/common/icon-xiala.png" mode=""></image>
			</view>
			
			<view class="uni-list uni-list2" v-else>
				<picker mode="date" fields="month" :value="date[0]" @change="bindDateChangeStart">
					<view class="uni-input">{{date[0]}}</view>
				</picker>
				<text>对比</text>
				<picker mode="date" fields="month" :value="date[1]" @change="bindDateChangeEnd">
					<view class="uni-input">{{date[1]}}</view>
				</picker>
			</view>
		</view>
		<view class="manage-content">
			<view class="content-left">
				<view class="content-item" :class="currentIndex===index ? 'selected' : '' " 
				v-for="(item,index) in arrList" :key="index" @click="changeIndex(index)">{{item}}</view>
			</view>
			<view class="content-right">

				<!-- 年龄 -->
				<view class="content-right-item" v-if="currentIndex === 0">
					<view class="charts-box" v-if="chartData1.series[0].data.length">
					  <qiun-data-charts
					    type="bar"
					    :chartData="chartData1"
					    :errorShow="false"
					    background="none"
					  />
					</view>
					<view class="" v-else>
						<zdx-noMore name='no-collection' txt='暂时没有数据啦~' />
					</view>
				</view>
				<!-- 性别 -->
				<view class="content-right-item" v-if="currentIndex === 1">
					<view class="charts-box" v-if="this.chartData2.series[0].data[0].value && this.chartData2.series[0].data[1].value">
					  <qiun-data-charts
					    type="pie"
					    :chartData="chartData2"
					    :errorShow="false"
					    background="none"
					  />
					</view>
					<view class="" v-else>
						<zdx-noMore name='no-collection' txt='暂时没有数据啦~' />
					</view>
				</view>
				<!-- 新老顾客 -->
				<view class="content-right-item" v-if="currentIndex === 2">
					<view class="charts-box">
					  <qiun-data-charts
					    type="pie"
					    :chartData="chartData3"
					    :errorShow="false"
					    background="none"
					  />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	import qxAPI from "../../api/tools.js"
	import moment from "moment"
	import { debounce,throttle } from "../../utils/help.js"
	export default {
		components: {
			Header,
		},
		data() {
			return {
				storeNameList:[],
				storeIndex: 0,
				timerId: null,
				currentIndex: 0,
				arrList:['年龄','性别','新老顾客'],
				dateStr:'',
				date:[],
				
				chartData1:{
				  categories: [],
				  series: [{
				    name: "人数",
				    data: []
				  }]
				},
				chartData2:{
				  categories:[],
				  series: [
					  {
						  data: [
							  {
								  "name": "女性",
								  "value": 0
							  },
							  {
								  "name": "男性",
								  "value": 0
							  }
						  ]
					  }
				  ]
				},
				chartData3:{
				  categories:[],
				  series: [
					  {
						  data: [
							  {
								  "name": "新顾客",
								  "value": 70
							  },
							  {
								  "name": "老顾客",
								  "value": 50
							  },
							  {
								  "name": "流失顾客",
								  "value": 60
							  }
						  ]
					  }
				  ]
				},
			}
		},
		watch:{
			currentIndex:{
				handler(val) {
					if(val == 2) {  // 新老顾客
						this.fetchComparison()
					}else{
						this.fetchStatistics()
					}
				}
			}
		},
		mounted() {
			this.storeList = this.getLocalStorage("storeList")
			this.storeNameList = this.storeList.map(item=>{
				return item.name
			})
			this.dateStr = moment().subtract(1,'months').startOf('month').format('YYYY-MM')
			this.date = [moment().subtract(2,'months').startOf('month').format('YYYY-MM'),
						 moment().subtract(1,'months').endOf('month').format('YYYY-MM')]
			this.fetchStatistics()
		},
		methods: {
			storeChange(e) {
			 	this.storeIndex = e.target.value
				if(this.currentIndex == 2) {
					this.fetchComparison()
				}else {
					this.fetchStatistics()
				}
			},
			async fetchStatistics() {
				let query = {
					store_index: this.storeList[this.storeIndex].storeId,
					begindate: moment(this.dateStr).startOf('month').format('YYYY-MM-DD').split('-').join(''),
					enddate: moment(this.dateStr).endOf('month').format('YYYY-MM-DD').split('-').join(''),
				}
				const res = await qxAPI.getStatistics(query)
				console.log(res);
				let categories = Object.keys(res.data.age)
				let seriesData = Object.values(res.data.age)
				this.$set(this.chartData1, 'categories',categories)
				this.$set(this.chartData1.series[0], 'data',seriesData)
				
				let sexData = Object.values(res.data.sex)
				this.$set(this.chartData2.series[0].data[0], 'value',sexData[0])
				this.$set(this.chartData2.series[0].data[1], 'value',sexData[1])
				console.log(this.chartData2.series[0].data);
			},
			async fetchComparison() {
				let query = {
					store_index: this.storeList[this.storeIndex].storeId,
					source_begindate: moment(this.date[0]).startOf('month').format('YYYY-MM-DD').split('-').join(''),
					source_enddate: moment(this.date[0]).endOf('month').format('YYYY-MM-DD').split('-').join(''),
					target_begindate: moment(this.date[0]).startOf('month').format('YYYY-MM-DD').split('-').join(''),
					target_enddate: moment(this.date[1]).endOf('month').format('YYYY-MM-DD').split('-').join(''),
				}
				console.log(query);
				const res = await qxAPI.getComparison(query)
				console.log(res);
				this.$set(this.chartData3.series[0].data[0], 'value', res.data.newNumber )
				this.$set(this.chartData3.series[0].data[1], 'value', res.data.regularNumber )
				this.$set(this.chartData3.series[0].data[2], 'value', res.data.lostNumber )
			},
			
			changeIndex: debounce(function(index){
				this.currentIndex = index
			},500),
			bindDateChange(e) {
				this.dateStr =  e.detail.value
				this.fetchStatistics()
			},
			bindDateChangeStart(e) {
				let time = moment(e.detail.value).unix()
				let time2 = moment(this.date[1]).unix()
				if(time >= time2) {
					uni.showToast({
						icon: 'error',
						title: "日期选择失败！",
						duration: 1000
					});
					return
				}
				console.log(time);
				this.$set(this.date, 0 , e.detail.value)
				this.fetchComparison()
			},
			bindDateChangeEnd(e) {
				let time = moment(this.date[0]).unix()
				let time2 = moment(e.detail.value).unix()
				if(time >= time2) {
					uni.showToast({
						icon: 'error',
						title: "日期选择失败！",
						duration: 1000
					});
					return
				}
				this.$set(this.date, 1 , e.detail.value)
				this.fetchComparison()
			}
		}
	}
</script>

<style lang="scss" scoped>
uni-page-body {
	height: 100vh;
}
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	.select-top {
		height: 72rpx;
		display: flex;
		align-items: center;
		padding: 0 16rpx;
		border-bottom: 1px solid #d0d1d3;
		.store-select {
			width: 50%;
			height: 72rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 10rpx;
			border-right: 1px solid #d0d1d3;
			image {
				width: 40rpx;
				height: 40rpx;
				margin-left: 20rpx;
			}
			/deep/ .uni-input {
				font-size: 26rpx !important;
			}
		}
		.uni-list {
			width: 50%;
			height: 72rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 10rpx;
			margin-left: 40rpx;
			image {
				width: 40rpx;
				height: 40rpx;
				margin-left: 20rpx;
			}
			/deep/ .uni-input {
				font-size: 26rpx !important;
			}
		}
		.uni-list2 {
			text {
				font-size: 20rpx;
				margin: 0 14rpx;
			}
		}
	}
}

.manage-content {
	flex: 1;
	display: flex;
	height: 100%;
	.content-left {
		height: 100%;
		width: 180rpx;
		flex-shrink: 0;
		background-color: #F2F4F7;
		.content-item {
			height: 40rpx;
			padding: 20rpx 0;
			padding-left: 20rpx;
			font-size: 26rpx;
		}
		.selected {
			padding-left: 14rpx;
			border-left: 6rpx solid #72CDD7;
			background-color: #FFFFFF;
		}
	}
	.content-right {
		height: 100%;
		flex: 1;
		width: 570rpx;
		background-color: #FFFFFF;
	}
}
</style>
