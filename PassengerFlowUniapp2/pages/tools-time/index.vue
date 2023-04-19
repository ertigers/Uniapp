<template>
	<view class="container">
		<Header title="时间设置"></Header>
		<view class="content-wrapper">
			<uni-forms-item class="task-input" label="门店:">
			    <picker :value="storeIndex" :range="storeNameList"  @change="taskChange">
			        <view class="uni-input">{{storeNameList[storeIndex]}}</view>
			    </picker>
				<image src="../../static/icon/common/icon-xiala.png" mode=""></image>
			</uni-forms-item>
			<view class="row-item">
				<view class="title">不经营时间：</view>
				<view class="date-wrapper">
					<view class="example-body">
						<uni-datetime-picker
							v-model="datetimerange"
							type="datetimerange"
							rangeSeparator="至"
						/>
					</view>
					<image class="date-img" src="../../static/icon/tools/ico-calendar@2x.png" mode=""></image>
				</view>
			</view>
			<view class="row-item">
				<view class="title">布防时间：</view>
				<view class="time-wrapper" @click="open">
					<image src="../../static/icon/tools/ico-time@2x.png" mode=""></image>
					<view class="start-time">{{ timeArray[0] }} : {{ timeArray[1] }}</view>
					<view class="text">至</view>
					<view class="end-time">{{ timeArray[3] }} : {{ timeArray[4] }}</view>
				</view>
			</view>
			<button class="btn-add" @click="formSubmitHandler">设置</button>
		</view>
		<uni-popup ref="popup">
			<smh-time-range :time="timeArray" @confrim="confrim" @cancel="cancel"></smh-time-range>
		</uni-popup>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	import moment from "moment"
	import qxAPI from "../../api/tools.js"
	
	export default {
		components: {
			Header,
		},
		data() {
			return {
				storeList:[],
				storeNameList:[],
				storeName:'',
				storeIndex:0,
				
				datetimerange: [],
				timeArray: ['01','01','0','01','02']
			}
		},
		mounted() {
			this.fetchStoreList()
			this.fetchStoreTime()
		},
		methods: {
			open(){
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open('bottom')
			},
			fetchStoreList() {
				let res = this.getLocalStorage("storeList")
				let loginData = this.getLocalStorage("loginData")
				let store_index_arr = loginData.userData.store_indexs.split(',')
				console.log(res); 
				this.storeList = res
				this.storeNameList = res.map(item=>{
					return item.name
				})
			},
			fetchStoreTime() {
				let storeId = this.storeList[this.storeIndex].storeId || null
				if(!storeId)  return
				let query = {
					index: storeId
				}
				qxAPI.getStoreDetail(query).then((res)=>{
					let detail = res.rows[0]
					console.log(detail);
					if(detail.rest_begintime && detail.rest_endtime) {
						this.$set(this.datetimerange,0,detail.rest_begintime)
						this.$set(this.datetimerange,1,detail.rest_endtime)
					}
					if(detail.defense_begintime && detail.defense_endtime) {
						this.$set(this.timeArray,0,detail.defense_begintime.slice(0,2))
						this.$set(this.timeArray,1,detail.defense_begintime.slice(3,5))
						this.$set(this.timeArray,3,detail.defense_endtime.slice(0,2))
						this.$set(this.timeArray,4,detail.defense_endtime.slice(3,5))
					}
				})
			},
			taskChange(e) {
				this.storeIndex = e.target.value
				this.fetchStoreTime()
			},
			confrim(e){		
				console.log(e);
				this.$set(this.timeArray,0,e.time.slice(0,2))
				this.$set(this.timeArray,1,e.time.slice(3,5))
				this.$set(this.timeArray,3,e.time.slice(6,8))
				this.$set(this.timeArray,4,e.time.slice(9,11))
				console.log(this.timeArray);
				this.$refs.popup.close()
			},
			cancel(e){
				this.$refs.popup.close()
			},
			async formSubmitHandler() {
				let store_index = this.storeList[this.storeIndex].storeId 
				let defense_begintime = `${this.timeArray[0]}:${this.timeArray[1]}:00`
				let defense_endtime = `${this.timeArray[3]}:${this.timeArray[4]}:59`
				let rest_begintime = this.datetimerange[0]
				let rest_endtime = this.datetimerange[1]
				
				if(moment(rest_begintime).valueOf() > moment(rest_endtime).valueOf()) {
					 uni.showToast({
						icon: 'error',
						title: "不经营时间错误！",
						duration: 1000
					});
					return
				}
				let query0 = {
					page: 1,
					rows: 100,
					store_index
				}
				const result = await qxAPI.getDeviceList(query0)  // 获取设备列表
				let alarmDevice = result.rows.filter(subItem => subItem.type == 2)  // 获取子资源
				let puid = alarmDevice[0].puid || '' 
				// let puid =  '201042593887140609'
				let query1 = {
					puid,
					beginTime: defense_begintime,
					endTime: defense_endtime
				}
				let query2 = {
					index: store_index,
					rest_begintime,
					rest_endtime,
					defense_begintime,
					defense_endtime
				}
				// 设置终端
				qxAPI.setAlarmTime(query1).then(res=>{
					if(res.code === 0) {
						qxAPI.setStoreTime(query2).then(res=>{
							uni.showToast({
								icon: 'success',
								title: "设置成功！",
								duration: 1000
							});
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
/deep/ {
	uni-picker {
		.uni-input {
			border-radius: 4px;
			padding-left: 20rpx;
			background-color: #F2F6FC;
			color: rgba(0, 0, 0, 0.7);
			font-size: 28rpx;
		}
	}
	.uni-forms-item__content {
		line-height: 72rpx;
	}
	.uni-forms-item__label {
		width: 90rpx;
		font-size: 28rpx;
		font-weight: bold;
		.label-text {
			color: #2A93FF;
		}
	}
	
	// 日期时间选择器
	.uni-date-x {
		color: rgba(0, 0, 0, 0.5);
		input {
			font-size: 22rpx;
		}
	}
	.uni-date-x--border {
		border: none;
		background-color: #F2F6FC;
	}
	.uni-date__icon-clear {
		display: none !important;
		// top: 6rpx !important;
		// right: -20rpx !important;
	}
	.uni-date__icon-logo {
		display: none;
	}
	.uni-date-x, .uni-date-range {
		background-color: #F2F6FC;
	}

	.top {
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
	}
} 
uni-page-body {
	height: 100vh;
}
.container {
	height: 100%;
	background-color: #FFFFFF;
}
.content-wrapper{
	padding: 40rpx;
	.task-input {
		position: relative;
		image {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			top: 14rpx;
			right: 12rpx;
		}
	}
	.btn-add {
		height: 80rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		background: #2A93FF;
		border: none;
		border-radius: 48rpx;
		margin-top: 250rpx;
	}
}
.row-item {
	margin-top: 30rpx;
	position: relative;
	.title {
		font-size: 24rpx;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.7);
		margin-bottom: 40rpx;
	}
	.date-img {
		position: absolute;
		top: 94rpx;
		left: 10rpx;
		width: 40rpx;
		height: 40rpx;
	}
}
.date-wrapper {
	background-color: #F2F6FC;
	border-radius: 8rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
.time-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #F2F6FC;
	padding: 12rpx;
	border-radius: 8rpx;
	padding-right: 24rpx;
	> image {
		width: 40rpx;
		height: 40rpx;
	}
	.start-time {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.5);
	}
	.text {
		font-size: 30rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.5);
	}
	.end-time {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.5);
		margin-right: 120rpx;
	}
}
</style>
