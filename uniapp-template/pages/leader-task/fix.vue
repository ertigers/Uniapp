<template>
	<view class="container">
		<Header title="修改任务"> </Header>
		<view class="task-add-box">
			<uni-forms ref="addTaskForm" :modelValue="addTaskForm" :rules="rules" label-width="80">
				<uni-forms-item label="专管员:" required >
					<uni-data-checkbox disabled multiple v-model="addTaskForm.manager_user_index" 
						:localdata="staffList" :map="mapType" />
				</uni-forms-item>
				<uni-forms-item label="任务名称:" required name="name">
					<uni-easyinput v-model="addTaskForm.name" placeholder="请输入任务名称" />
				</uni-forms-item>
				<uni-forms-item label="任务目标:" required name="goal">
					<uni-easyinput v-model="addTaskForm.goal" placeholder="请输入任务目标" />
				</uni-forms-item>
				<uni-forms-item label="任务描述:" required name="description">
					<uni-easyinput v-model="addTaskForm.description" placeholder="请输入任务描述" />
				</uni-forms-item>
				<uni-forms-item label="巡店方式:" required name="userIndex">
					<uni-data-checkbox  v-model="addTaskForm.type" :localdata="typeList" 
					:map="mapType" />
				</uni-forms-item>
				<uni-forms-item label="开始日期:" required name="begindate">
					<view class="example-body">
						<uni-datetime-picker
							type="date"
							v-model="addTaskForm.begindate"
						/>
					</view>				
				</uni-forms-item>
				<uni-forms-item label="结束日期:" required name="enddate">
					<view class="example-body">
						<uni-datetime-picker
							type="date"
							v-model="addTaskForm.enddate"
						/>
					</view>						
				</uni-forms-item>
				<button class="add-button" @click="formSubmitHandler">修改</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	import qxAPI from "../../api/index.js"
	export default {
		components: {
			Header
		},
		data() {
			return {
				rules: {
					 
					name: {
						rules: [{
							required: true,
							errorMessage: "任务名称不能为空！",
						}],
						validateTrigger: 'change'
					},
					goal: {
						rules: [{
							required: true,
							errorMessage: "任务目标不能为空！",
						}],
						validateTrigger: 'change'
					},
					description: {
						rules: [{
							required: true,
							errorMessage: "任务描述不能为空！",
						}],
						validateTrigger: 'change'
					},
					begindate: {
						rules: [{
							required: true,
							errorMessage: "任务开始时间不能为空！",
						}],
						validateTrigger: 'change'
					},
					enddate: {
						rules: [{
							required: true,
							errorMessage: "任务结束时间不能为空！",
						}],
						validateTrigger: 'change'
					},
				},
				addTaskForm: {
					leader_user_index:'',
					manager_user_index: [],
					name: '',
					description: '',
					begindate: '',
					enddate: '',
					goal:'',
					type:'1'
				},
				staffList:[],
				typeList:[{
					name:'现场巡检',
					value:'2'
				},
				{
					name:'视频巡检',
					value:'1'
				}],
				mapType:{text:'name',value:'value'}
			}
		},
		onLoad(options) {
			// 获取任务下专管员列表
			let taskItem = JSON.parse(options.taskItem)
			let manager_user_index =[]
			let indexs = []
			for(const item of taskItem.children) {
				manager_user_index.push(item.manager_user_index)
				indexs.push(item.index)
			}
			this.addTaskForm.indexs = indexs.toString()
			this.addTaskForm.manager_user_index = manager_user_index
			this.addTaskForm.name = taskItem.name
			this.addTaskForm.description = taskItem.description
			this.addTaskForm.type = taskItem.way
			let begindate = taskItem.begindate + ''
			this.addTaskForm.begindate = begindate.slice(0,4) + '-' + begindate.slice(4,6) + '-' + begindate.slice(6,8)
			let enddate = taskItem.enddate + ''
			this.addTaskForm.enddate = enddate.slice(0,4) + '-' + enddate.slice(4,6) + '-' + enddate.slice(6,8)
		},
		mounted() {
			this.fetchStaffList()
		},
		methods: {
			// 获取领导下属的专管员
			fetchStaffList() {
				let staffList = this.getLocalStorage("staffList")
				this.staffList = staffList
			},
			formSubmitHandler() {
				this.$refs.addTaskForm.validate().then(async (res) => { 
					let loginData = this.getLocalStorage('loginData');
					console.log(this.addTaskForm);
					
					let manager_user_indexs = this.addTaskForm.manager_user_index.toString() 
					let begindate = this.addTaskForm.begindate.split('-').join('')
					let enddate = this.addTaskForm.enddate.split('-').join('')
					
					let query = {
						indexs: this.addTaskForm.indexs,
						leader_user_index: loginData.userData.index,
						manager_user_indexs,
						name: this.addTaskForm.name,
						description: this.addTaskForm.description,
						way:this.addTaskForm.type,
						goal:this.addTaskForm.goal,
						begindate,
						enddate,
					}
					console.log(query);
					let data = await qxAPI.fixTask(query)
					console.log(data);
					if(data.code === 0) {
						uni.navigateBack({
							delta: 1,
							success(res) {
								uni.showToast({
									icon: 'success',
									title: "修改成功！",
									duration: 1000
								});
							}
						});
					}
				}).catch((err) => {
					console.log(err);
					uni.showToast({
						icon: 'error',
						title: "表单校验失败~",
						duration: 1000
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
/deep/ {
	.label-text {
		font-weight: 600;
		color: rgba(0, 0, 0, 0.7);
	}
	.uni-input-placeholder {
		color: rgba(0, 0, 0, 0.7);
		font-size: 24rpx;
	}
}
.container {
	height: 100vh;
	background-color: #FFFFFF;
}
.task-add-box {
	padding: 20rpx;
}
 

.add-button {
	width: 95%;
	height: 80rpx;
	font-size: 32rpx;
	color: #FFFFFF;
	background: #2A93FF;
	border: none;
	border-radius: 48rpx;
}
 

</style>
