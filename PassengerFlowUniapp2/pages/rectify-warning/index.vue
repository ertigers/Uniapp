<template>
	<view class="container">
		<Header title="告警事件"></Header>
		<view class="time-wrapper">
			<uni-datetime-picker
				v-model="range"
				type="daterange"
				rangeSeparator="至" 
			/>
		</view>
		<view class="store-select">
			<picker :value="storeIndex" :range="storeNameList"  @change="taskChange">
				<view class="uni-input">{{storeNameList[storeIndex]}}</view>
			</picker>
			<image src="../../static/icon/common/icon-xiala.png" mode=""></image>
		</view>
		<view class="device-list-wrapper">
			<view class="device-list">
				<data-list class="data-list" ref="list" @load="handleLoad" @refresh="handleRefresh">
					<view class="item" v-for="(item,index) in eventList" :key="index" @click="gotoAddProblem(item)">
						<image class="item-icon" :src="item.snapurl" mode=""></image>
						<view class="item-content">
							<view class="title">
								{{ EventMap[item.eventid] }}
							</view>
							<view class="time">
								{{ item.time | snaptimeFilter }}  <text>|</text> {{ EventLevelMap[item.eventid] }}
							</view>
						</view>
						<view class="item-reason">
							{{ storeMap[item.store_index] }}
						</view>
					</view>
				</data-list>
			</view>
		</view>
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
				storeList:null,
				storeMap:null,
				districtMap: null,
				range:[moment().startOf('month').format('YYYY-MM-DD'),moment().endOf('month').format('YYYY-MM-DD')],
				eventList:[],
				EventMap:{ },  // 告警事件名称
				EventLevelMap: { },  // 告警事件等级
				LevelMap:{
					'0': '普通',
					'1': '重要',
					'2': '紧急',
				},
				storeNameList:[],
				storeIndex: 0,
			}
		},
		watch:{
			range: {
				handler(newval) {
					this.eventList = []
					this.handleLoad({page: 1, size: 30})
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
		mounted() {
			this.getEventLevelList()
			this.fetchStoreList()
		},
		methods: {
			async getEventLevelList() {
				let query = {
					page: 1,
					rows: 999
				}
				let data = await qxAPI.getEventLevel(query)
				let EventMap = {}
				let EventLevelMap = {}
				data.rows.forEach((item)=>{
					EventMap[item.eventid] = item.eventname
					EventLevelMap[item.eventid] = this.LevelMap[item.eventlevel]
				})
				this.EventMap = EventMap
				this.EventLevelMap = EventLevelMap
			},
			taskChange(e) {
				this.storeIndex = e.target.value
				this.handleLoad({page: 1, size: 30})
			},
			fetchStoreList() {
				this.districtMap = this.getLocalStorage("districtMap")
				this.storeList = this.getLocalStorage("storeList")
				this.storeMap = this.getLocalStorage("storeMap")
				this.storeNameList = this.storeList.map(item=>{
					return item.name
				})
			},
		 
			handleLoad(data,callback) {
				let store = this.storeList[this.storeIndex] || ''
				if(!store)  return
				setTimeout(async ()=>{
					let query = {
						page: data.page,
						rows: data.size,
						// order: 'desc',
						begintime: this.range[0] + " 00:00:00",
						endtime: this.range[1] + " 23:59:59",
						district_index: store.districtId,
						store_index: store.storeId,
					}
					const res = await qxAPI.getEventList(query)
					let list1 = res.rows.filter(item=>{
						  return item.eventid != 'E_IVS_LotterySupervisor'  // 去除专管员打卡
					})
					this.eventList = [...this.eventList, ...list1]
					callback && callback({ list: this.eventList, total: res.total});
				},500)
			},
			handleRefresh(data,callback) {
				let store = this.storeList[this.storeIndex] || ''
				if(!store)  return
				setTimeout(async ()=>{
					let query = {
						page: data.page,
						rows: data.size,
						begintime: this.range[0] + " 00:00:00",
						endtime: this.range[1]+ " 23:59:59",
						district_index: store.districtId,
						store_index: store.storeId,
					}
					const res = await qxAPI.getEventList(query)
					this.eventList = res.rows.filter(item=>{
						  return item.eventid != 'E_IVS_LotterySupervisor'
					})
					callback({ list: this.eventList, total: res.total});
				},500)
				
			},
			search(e) {
				console.log(e);
			},
			gotoAddProblem(item) {
				item.districtName = this.districtMap[item.district_index]
				item.storeName = this.storeMap[item.store_index]
				item.description1 = this.EventMap[item.eventid]
				item.EventMap = this.EventMap
				uni.navigateTo({
					url:"./problem?query=" + encodeURIComponent(JSON.stringify(item))
				})
			}
		
		}
	}
</script>

<style lang="scss" scoped>
/deep/ {
	.uni-searchbar__box {
		background-color: #F4F5FC !important;
		border: none;
		border-radius: 70rpx !important;
		height: 60rpx;
		.uni-icons {
			color: #2C83D6 !important;
		}
	}
}
uni-page-body {
	height: 100vh;
}
.container {
	height: 100%;
	background-color: #FFFFFF;
}
.my-search {
	padding: 10rpx;
}

.store-select {
	position: relative;
	padding: 20rpx;
	border-bottom: 1rpx solid #DCDFE6;
	image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 18rpx;
		right: 12rpx;
	}
	/deep/ .uni-input {
		font-size: 26rpx !important;
	}
}
	
.device-list-wrapper {
	.device-list {
		.item {
			display: flex;
			align-items: center;
			padding: 28rpx 40rpx;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		}
	}
}
.item {
	.item-icon {
		width: 88rpx;
		height: 88rpx;
	}
	.item-content {
		flex: 1;
		margin-left:40rpx;
		.title {
			font-size: 28rpx;
			font-weight: bold;
			color: rgb(0, 0, 0);
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		.time {
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.7);
			margin-top: 20rpx;
			text {
				margin: 0 16rpx;
				color: #2B8AEA;
			}
		}
	}
	.item-reason {
		width: 150rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #2A93FF;
	}
}
</style>
