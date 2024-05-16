<template>
	<view>
		<Header title="任务管理">
			<template slot="right">
				<view class="right-image-wrapper" @click="gotoAddTask">
					<image src="../../static/icon/common/ico-tianjia@2x.png" mode=""></image>
				</view>
			</template>
		</Header>
		<view class="time-wrapper">
			<uni-datetime-picker v-model="range" type="daterange" rangeSeparator="至" />
		</view>
		<view class="task-box">
			<delSlideLeft v-for="(item,index) in taskList" :key="index" @delItem="delItem(item)" @fixItem="fixItem(item)">
				<view class="task-item"  @click="gotoStaff(item)">
					<view class="task-name">
						{{ item.name }}
					</view>
					<image src="../../static/icon/common/ico-details-nor@2x.png" mode=""></image>
				</view>
			</delSlideLeft>
		</view>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	import delSlideLeft from '@/components/ay-operate/del_slideLeft.vue'
	import moment from "moment"
	import qxAPI from "../../api/index.js"
	export default {
		components: {
			Header,delSlideLeft
		},
		data() {
			return {
				range: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
				taskList: [],
			}
		},
		watch: {
			range: {
				handler(newval) {
					console.log(1111);
					this.fetchTaskList()
				},
				immediate: false,
				deep: true
			}
		},
		mounted() {
		},
		onShow() {
			this.fetchTaskList()
			console.log('222222');
		},
		methods: {
		
			// 获取任务列表
			async fetchTaskList() {
				if (!this.range.length) {
					return uni.showToast({
						icon: 'none',
						title: "时间不能为空！",
						duration: 1000
					});
				}
				let loginData = this.getLocalStorage("loginData")
				let begindate = this.range[0].split('-').join('')
				let enddate = this.range[1].split('-').join('')
				let query = {
					rows: 99999,
					leader_user_index: loginData.userData.index,
					begindate,
					enddate
				}
				const data = await qxAPI.getTaskList(query)
				// 变成树形数组
				let taskList = []
				let newObj = {}
				data.rows.forEach( el => {
				  if (!newObj[el.name]) {
					taskList.push({
					  index: el.index,
					  leader_user_index: el.leader_user_index,
					  manager_user_index: el.manager_user_index,
					  description: el.description,
					  name: el.name,
					  begindate: el.begindate,
					  enddate: el.enddate,
					  children:[{ index: el.index,manager_user_index:el.manager_user_index }]
					});
					newObj[el.name] = true;
				  } else {
					taskList.forEach(item => {
					  if (item.name === el.name) {
						item.children.push({index:el.index,manager_user_index:el.manager_user_index})
					  }
					})
				  }
				})
		 
				// 智能巡检的children
				let children = [] 
				const manager_user_indexs = loginData.userData.manager_user_indexs.split(',')
				manager_user_indexs.forEach(item=>{
					children.push({index:0,manager_user_index:item})
				})
				// 合并
				this.taskList =  [...[{ name: '智能巡检', children }], ...taskList] 
			},
			// 跳转到任务下的专管员列表
			gotoStaff(currentItem) { 
				this.setLocalStorage("searchFormLeader",this.searchForm)
				uni.navigateTo({
					url: "./staff?taskItem=" + encodeURIComponent(JSON.stringify(currentItem))
				})
			},
			// 跳转去添加任务
			gotoAddTask(e) {
				uni.navigateTo({
					url: "./add"
				})
			},
			fixItem(e) {
				if(e.name === '智能巡检') {
					uni.showToast({
						icon: 'error',
						title: "无法修改！",
						duration: 1000
					});
					return
				}
				console.log(e);
				let taskItem = this.taskList.find(item => item.name === e.name)
				uni.navigateTo({
					url: "./fix?taskItem=" + encodeURIComponent(JSON.stringify(taskItem))
				})
			},
			delItem (e) {
				console.log(e);
				if(e.name === '智能巡检') {
					uni.showToast({
						icon: 'error',
						title: "无法删除！",
						duration: 1000
					});
					return
				}
				uni.showModal({
				    title: '警告',
				    content: '确定需要删除这个任务吗?',
				    success: ()=> {
				        if (res.confirm) {
				            console.log('用户点击确定');
							console.log(this.taskList);
							let taskItem = this.taskList.find(item => item.name === e.name)
							let taskindex = taskItem.children.map(subItem => subItem.index).join(',')
							console.log(taskindex);
							let query = {
								index: taskindex
							}
							qxAPI.delTask(query).then(res=>{
								console.log(res);
								if(res.code === 0) {
									uni.showToast({
										icon: 'success',
										title: "删除成功！",
										duration: 1000
									});
									this.fetchTaskList()
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
				
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
			height: 96rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

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
