<template>
    <view class="container">
		<Header title="问题整改"> </Header>
		<!-- 展示问题区域 -->
		<DescriptionLook :problemShowData='problemShowData'></DescriptionLook> 
		<!-- 驳回-整改情况 -->
		<FixLook v-if="problemResultData1.acceptDesc" :problemIndex='problemShowData.index'></FixLook>
		<!-- 驳回-验收结果区域 -->
		<ResultLook  v-if="problemResultData1.acceptDesc" :problemData='problemResultData1'></ResultLook>
		<!-- 整改区域 -->
		<view class="problem-fix">
			<view class="title">整改情况：</view>
			<uni-forms ref="problemFixData" :modelValue="problemFixData" :rules="rules" label-width="80">
				<uni-forms-item label="整改说明:" required name="description">				
					<uni-easyinput type="textarea" autoHeight v-model="problemFixData.description" placeholder="请输入内容"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="整改图片:" required name="imglist">	
					<vastwu-saveimg 
						:imgListprop="problemFixData.imglist"
						:num='3' 
						:isBase64='true' 
						:isSave='true' 
						:size='180' 
						@chooseImage='updateImglist'  
						@delImg='updateImglist'>
					</vastwu-saveimg>
				</uni-forms-item>
				<button class="btn-rect" @click="formSubmitHandler">整改</button>
			</uni-forms>
		</view>
    </view>
</template>

<script>
import moment from "moment"
import Header from "../../component/Header.vue"
import vastwuSaveimg from '../../components/vastwu-saveimg/vastwu-saveimg.vue'
import DescriptionLook from "../../component/problem/DescriptionLook.vue"
import FixLook from "../../component/problem/FixLook.vue"
import ResultLook from "../../component/problem/ResultLook.vue"
import qxAPI from "../../api/index.js"
export default {
components:{ Header,vastwuSaveimg,DescriptionLook,FixLook,ResultLook },
	data() {
		return {
			problemIndex: undefined,
			problemShowData: {},
			problemFixData:null,
			// 校验规则
			rules: {
				description: {
					rules: [{
						required: true,
						errorMessage: "整改说明不能为空！",
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
			
			problemResultData1:{
				acceptDesc:''
			},
		}
	},
	onLoad(options) {
		let problemDetail  = JSON.parse(options.problemDetail) 
		console.log(problemDetail);		
		this.problemShowData = problemDetail
	 
		this.problemIndex = problemDetail.index
		
		this.problemFixData = {
			description:'',
			imglist:[]
		}
		this.problemResultData1 = {
			acceptDesc: problemDetail.accept_desc,
			res: '拒收'
		}
	},
	mounted() {
	},
	methods: {
		// 更新base64图片数组数据
		updateImglist(imglist) {
			this.problemFixData.imglist = imglist
		},
		// 提交整改
		formSubmitHandler() {
			console.log(this.problemFixData);
			this.$refs.problemFixData.validate().then(async (res) => {
				console.log(res);
				let loginData = JSON.parse(uni.getStorageSync('loginData'));
				let imgBase64 = this.problemFixData.imglist
				let imglist = []
				for(const item of imgBase64) {
					imglist.push({"imgdata":item.replace("data:image/jpeg;base64,","").replace("data:image/png;base64,",""),"extname": "jpg"})
				}
				let query = {
					user_index: loginData.userData.index,  
					user_name: loginData.userData.name,  
					problem_index:this.problemIndex,
					description: this.problemFixData.description, 
					imglist
				}
				console.log(query);
				let data = await qxAPI.addProblemRectify(query)
				console.log(data);
				if(data.code === 0) {
					uni.navigateBack({
						delta: 1,
						success(res) {
							uni.showToast({
								icon: 'success',
								title: "提交成功！",
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
@import "../../component/problem/problemDetail.scss";
/deep/ {
	uni-picker {
		.uni-input {
			border: 1px solid #e1e1e1;
			border-radius: 4px;
			padding-left: 20rpx;
		}
	}
	.is-direction-left {
		flex-direction: column;
	}
	.uni-forms-item__content {
		min-height: 0;
	} 
	.label-text {
		font-weight: 600;
	}
 
	.uni-easyinput__content, .is-input-border, .is-disabled {
		background-color: #F2F6FC !important;
		border-color: #F2F6FC !important;
	}
}

uni-page-body {
	height: 100vh;
}
.container { 
	background-color: #F2F2F2; 
}
.title {
	font-size: 28rpx;
	color: #2A93FF;
	font-weight: 600;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);;
}
.problem-show, .problem-fix, .problem-result{
	background-color: #FFFFFF;
	padding: 30rpx;
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
} 
.problem-fix {
	margin-top: 48rpx;
}
.problem-result {
	margin-top: 48rpx;
}
.btn-rect {
	height: 80rpx;
	font-size: 32rpx;
	color: #FFFFFF;
	background: #2A93FF;
	border: none;
	border-radius: 48rpx;
}
</style>
