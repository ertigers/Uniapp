<template>
	<view class="container">
		<Header title="添加任务"> </Header>
		<view class="task-add-box">
			<uni-forms ref="addTaskForm" :modelValue="addTaskForm" :rules="rules" label-width="80">
				<uni-forms-item label="专管员:" required name="userIndex">
					<uni-data-checkbox multiple v-model="addTaskForm.manager_user_index" :localdata="staffList" 
					:map="mapType" />
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
				<button class="add-button" @click="formSubmitHandler">添加</button>
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
					userIndex: {
						rules: [{
							required: true,
							errorMessage: "专管员不能为空！",
						}],
						validateTrigger: 'change'
					},
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
					type:'2'
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
		mounted() {
			this.fetchStaffList()
		},
		methods: {
			// 获取领导下属的专管员
			fetchStaffList() {
				let staffList = uni.getStorageSync("staffList")
				this.staffList = JSON.parse(staffList)
			},
			formSubmitHandler() {
				this.$refs.addTaskForm.validate().then(async (res) => { 
					let loginData = this.getLocalStorage('loginData');
					console.log(this.addTaskForm);
					
					let manager_user_indexs = this.addTaskForm.manager_user_index.toString() 
					let begindate = this.addTaskForm.begindate.split('-').join('')
					let enddate = this.addTaskForm.enddate.split('-').join('')
					
					let query = {
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
					let data = await qxAPI.addTask(query)
					console.log(data);
					if(data.code === 0) {
						uni.navigateBack({
							delta: 1,
							success(res) {
								uni.showToast({
									icon: 'success',
									title: "添加成功！",
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
