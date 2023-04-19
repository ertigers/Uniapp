<template>
	<view class="container">
		<Header title="添加问题"> </Header>
		<view class="task-add-box">
			<uni-forms ref="addProblemForm" :modelValue="addProblemForm" :rules="rules" label-width="80">
				<uni-forms-item class="task-input" label="任务:" required name="task">
                    <picker :value="task_index" :range="taskList" range-key="name" selector-type="select" @change="taskChange">
                        <view class="uni-input">{{ taskList[task_index].name }}</view>
                    </picker>
					<image src="../../static/icon/common/icon-xiala.png" mode=""></image>
				</uni-forms-item>
				<uni-forms-item label="区域门店:" required name="store_index">
					<uni-data-picker 
						v-model='store_index' 
						:localdata="storeTreeData" 
						popup-title="请选择区域门店" 
						@change="storeChooses">
					</uni-data-picker>
				</uni-forms-item>
				<uni-forms-item class="task-input"  label="问题类型:" required >
				    <picker :value="task_type_index" :range="taskTypeList"  @change="taskTypeChange">
				        <view class="uni-input">{{ taskTypeList[task_type_index] }}</view>
				    </picker>
					<image src="../../static/icon/common/icon-xiala.png" ></image>
				</uni-forms-item>
				<uni-forms-item label="问题详情:" required name="description">				
					<uni-easyinput type="textarea" autoHeight v-model="addProblemForm.description" placeholder="请输入内容"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="抓拍图片:" required name="imglist">
					<vastwu-saveimg 
						:imgListprop="addProblemForm.imglist"
						:num='3' 
						:isBase64='true' 
						:isSave='true' 
						:size='180' 
						@chooseImage='updateImglist'  
						@delImg='updateImglist'>
					</vastwu-saveimg>
				</uni-forms-item>
				<button class="btn-add" @click="formSubmitHandler">添加</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	import vastwuSaveimg from '../../components/vastwu-saveimg/vastwu-saveimg.vue'
	import qxAPI from "../../api/index.js"
	import moment from "moment"
	export default {
		components: {
			Header,vastwuSaveimg
		},
		data() {
			return {
				taskTypeList: [],
				task_type_index: 13,
				// 任务
				taskList: [{index:0,name:'智能巡检'}],
				task_index: 0,
				// 区域门店
				store_index: null,  // 展示用的
				storeTreeData: [],	// 数据源
				// 表单数据
				addProblemForm: {
					task_index: 0,
					district_index: undefined,
					store_index: undefined,
					report_user_index: undefined,
					description: '',
					imglist:[],
				},
				// 校验规则
				rules: {
					store_index: {
						rules: [{
							required: true,
							errorMessage: "区域门店不能为空！",
						}],
						validateTrigger: 'change'
					},
					description: {
						rules: [{
							required: true,
							errorMessage: "问题描述不能为空！",
						}],
						validateTrigger: 'change'
					},
					imglist: {
						rules: [{
							required: true,
							errorMessage: "图片不能为空！",
						}]
					},
				},
				
			}
		},
		mounted() {
			this.dataInit()
			this.fetchTaskList()
			this.fetchStoreTree()
		},
		methods: {
			async dataInit() {
				let query = {
					page: 1,
					rows: 999
				}
				let data = await qxAPI.getEventLevel(query)
				let EventMap = {}
				data.rows.forEach((item)=>{
					EventMap[item.eventid] = item.eventname
				})
				this.taskTypeList = [...Object.values(EventMap),'其他']
			},
			// 获取任务列表
			async fetchTaskList() {
				let loginData = this.getLocalStorage('loginData');
				const query = {
					rows: 9999,
					manager_user_index:  loginData.userData.index, 
					begindate: moment().startOf('month').format('YYYY-MM-DD').split('-').join(''),
					enddate: moment().endOf('month').format('YYYY-MM-DD').split('-').join('')
				}
				const data = await qxAPI.getTaskList(query)
				this.taskList = [...this.taskList,...data.rows]
			},
			// 获取区域门店树
			async fetchStoreTree() {
				let query = {
					treetype: 1
				}
				const data = await qxAPI.getDeviceTree(query)
				const currentArr = []
				
				data.rows.map((item,index)=>{
					currentArr[index] = {"text":item.name,"value":item.index + '',"children":[]}
					if(item.children && item.children.length) {
						item.children.forEach((subItem,subIndex)=>{
							currentArr[index].children[subIndex] = {"text":subItem.name,"value":item.index + '-' + subItem.index}
						})
					}
				})
				this.storeTreeData = currentArr
			},
			// 选中任务
			taskChange(e) {
				this.task_index = e.target.value
				this.addProblemForm.task_index = this.taskList[this.task_index].index
			},
			// 选中区域门店
			storeChooses(e) {
				let indexStr = e.detail.value[e.detail.value.length - 1].value
				let indexArr = indexStr.split('-')
				this.addProblemForm.district_index = Number(indexArr[0])
				this.addProblemForm.store_index = Number(indexArr[1])
			},
			// 选中任务类型
			taskTypeChange(e) {
				this.task_type_index = e.target.value
			},
			updateImglist(imglist) {
				this.addProblemForm.imglist = imglist
			},
			// 提交
			formSubmitHandler() {
				this.$refs.addProblemForm.validate().then(async (res) => {
					let loginData = this.getLocalStorage('loginData');
					let imgBase64 = this.addProblemForm.imglist
					let imglist = []
					for(const item of imgBase64) {
						imglist.push({"imgdata":item.replace("data:image/jpeg;base64,","").replace("data:image/png;base64,",""),"extname": "jpg"})
					}
					let query = {
						task_index:this.addProblemForm.task_index,
						district_index: this.addProblemForm.district_index,
						store_index: this.addProblemForm.store_index,
						description: this.addProblemForm.description,
						report_user_index: loginData.userData.index,
						type: this.taskTypeList[this.task_type_index],
						imglist
					}
					console.log(query);
					let data = await qxAPI.addProblem(query)
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
			},
		}
	}
</script>

<style lang="scss" scoped>
/deep/ {
	uni-picker {
		.uni-input {
			border: 1px solid #e1e1e1;
			border-radius: 4px;
			padding-left: 20rpx;
		}
	}
	.uni-forms-item__content {
		line-height: 36px;
	}
	.is-direction-left {
		flex-direction: column;
	}
	uni-picker[disabled] {
		background-color: #F1F1F1;
	}
 
} 
.container {
	height: 100vh;
	background-color: #FFFFFF;
}
.title {
	font-size: 28rpx;
	color: #2A93FF;
	font-weight: 600;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);;
}

.task-add-box {
	padding: 20rpx;
}
 
.task-input {
	position: relative;
	image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 90rpx;
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
}
</style>
