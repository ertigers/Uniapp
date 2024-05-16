<template>
	<view class="container">
		<Header title="添加问题"> </Header>
		<view class="task-add-box">
			<uni-forms ref="addProblemForm" :modelValue="addProblemForm" :rules="rules" label-width="80">
				<uni-forms-item class="task-input" label="任务:" required>
					<uni-easyinput disabled v-model="addProblemForm.task_name"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="区域门店:" required>
					<uni-easyinput disabled v-model="addProblemForm.districtStoreName"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item class="task-input" label="问题类型:" required>
					<picker :value="task_type_index" :range="taskTypeList" @change="taskTypeChange">
						<view class="uni-input">{{ taskTypeList[task_type_index] }}</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item label="问题详情:" required name="description">
					<uni-easyinput type="textarea" autoHeight v-model="addProblemForm.description" placeholder="请输入内容">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  label="抓拍图片:" required >
					<view class="img-wrapper">
						<image :src="item" mode="aspectFit" 
							v-for="(item,index) in addProblemForm.imgList"
							@click="previewImage(addProblemForm.imgList,index)">
						</image>
					</view>
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
			Header,
			vastwuSaveimg
		},
		data() {
			return {
				taskTypeList: [],
				task_type_index: 13,
				// 表单数据
				addProblemForm: {
					task_name: '智能巡检',
					task_index: 0,
					district_index: undefined,
					store_index: undefined,
					report_user_index: undefined,
					description: '',
					imgList: [],
				},
 
				// 校验规则
				rules: {
					description: {
						rules: [{
							required: true,
							errorMessage: "问题描述不能为空！",
						}],
						validateTrigger: 'change'
					},
				},
			}
		},
		mounted() {},
		onLoad(options) {
			let item = JSON.parse(options.query)
			console.log(item);
			
			this.taskTypeList = Object.values(item.EventMap)
			this.taskTypeList.push('其他')
			let index = this.taskTypeList.findIndex(subItem =>{
				return item.description1 === subItem
			})
			this.task_type_index = index
			
			this.addProblemForm.districtName = item.districtName,
			this.addProblemForm.storeName = item.storeName,
			this.addProblemForm.districtStoreName = item.districtName + '/' + item.storeName,
			this.addProblemForm.district_index = item.district_index,
			this.addProblemForm.store_index = item.store_index,
			this.addProblemForm.description = item.description1
			this.addProblemForm.imgList.push(item.snapurl) 
		},
		methods: {
			// 选中任务类型
			taskTypeChange(e) {
				this.task_type_index = e.target.value
			},
		 
			// 提交
			formSubmitHandler() {
				this.$refs.addProblemForm.validate().then(async (res) => {
					let loginData = this.getLocalStorage('loginData');
					let imgBase64 = await this.imageUrlToBase64(this.addProblemForm.imgList[0])
					let imglist = []
					imglist.push({
						"imgdata": imgBase64.replace("data:image/jpeg;base64,", "").replace(
							"data:image/png;base64,", ""),
						"extname": "jpg"
					})
					let query = {
						task_index: this.addProblemForm.task_index,
						district_index: this.addProblemForm.district_index,
						store_index: this.addProblemForm.store_index,
						description: this.addProblemForm.description,
						report_user_index: loginData.userData.index,
						type: this.taskTypeList[this.task_type_index],
						imglist
					}
					let data = await qxAPI.addProblem(query)
					if (data.code === 0) {
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
			
			imageUrlToBase64(url) {
				let toBase64Url = '';
				return new Promise((resolve, reject) => {
					uni.request({
						url: url,
						method: 'GET',
						responseType: 'arraybuffer',
						success: res => {
							let base64 = wx.arrayBufferToBase64(res.data); //把arraybuffer转成base64
							resolve(base64)
						}
					});					
				})
			},
			
			// 预览图片
			previewImage(urls,current) {
				uni.previewImage({
					urls,
					current,
				})
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
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);
		;
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

	.img-item {
		display: flex;
		margin: 20rpx auto;
	}
	.img-wrapper {
		margin-right: -36rpx;
		image{
			width: 200rpx;
			height: 200rpx;
			margin-right: 30rpx;
			border: 1rpx solid #F2F6FC;
			border-radius: 6rpx;
		}
	}
</style>
