<template>
    <view class="container">
		<Header  title="问题详情"> </Header>
		<!-- 展示问题区域 -->
		<DescriptionLook :problemShowData='problemShowData'></DescriptionLook> 
		<!-- 整改情况 -->
		<FixLook :problemIndex='problemShowData.index'></FixLook>
		<!-- 验收结果区域 -->
		<view class="problem-result">
			<view class="title">验收结果：</view>
			<uni-forms ref="problemResultData" :modelValue="problemResultData" :rules="rules" label-width="80">
				<uni-forms-item label="验收说明:" required name="acceptDesc">				
					<uni-easyinput type="textarea" autoHeight v-model="problemResultData.acceptDesc" placeholder="请输入内容"></uni-easyinput>
				</uni-forms-item>
				<view class="btn-wrapper">
					<view class="nopass" @click="formSubmitHandler(false)">重新整改</view>
					<view class="pass" @click="formSubmitHandler(true)">整改通过</view>
				</view>
			</uni-forms>
		</view>
    </view>
</template>

<script>
import moment from "moment"
import Header from "../../component/Header.vue"
import DescriptionLook from "../../component/problem/DescriptionLook.vue"
import FixLook from "../../component/problem/FixLook.vue"
import qxAPI from "../../api/index.js"
export default {
components:{ Header,DescriptionLook,FixLook },
	data() {
		return {
			problemIndex: undefined,
			problemShowData: null,
	 
			problemResultData:{
				acceptDesc:''
			},
			// 校验规则
			rules: {
				acceptDesc: {
					rules: [{
						required: true,
						errorMessage: "验收说明不能为空！",
					}],
					validateTrigger: 'change'
				}
			},
		}
	},
	onLoad(options) {
		let problemDetail  = JSON.parse(options.problemDetail) 
		console.log(problemDetail);		
		this.problemIndex = problemDetail.index
		this.problemShowData = problemDetail
	},
	mounted() {
	},
	methods: {
		// 提交整改
		formSubmitHandler(result) {
			
			console.log(this.problemResultData);
			this.$refs.problemResultData.validate().then(async (res) => {
				let loginData = this.getLocalStorage('loginData');
				let query = {
					index: this.problemIndex,
					accept_user_index: loginData.userData.index,  
					accept_desc: this.problemResultData.acceptDesc
				}
				let data
				if(result) {
					// 通过
					data = await qxAPI.acceptProblemRectify(query)
				}else {
					data = await qxAPI.restartProblemRectify(query)
				}
				console.log(data);
				if(data.code === 0) {
					uni.navigateBack({
						delta: 1,
						success() {
							uni.showToast({
								icon: 'success',
								title: "验收完成！",
								duration: 1000
							});
						}
					});
				}else{
					uni.showToast({
						icon: 'error',
						title: "验收失败！",
						duration: 1000
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
.btn-wrapper {
	width: 95%;
	height: 80rpx;
	display: flex;
	align-items: center;
	border: 2rpx solid #2A93FF;
	border-radius: 48rpx;
	view {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		width: 50%;
		font-size: 28rpx;
	}
	.nopass{
		color: #2A93FF;
		background-color: #D4E9FF;
		border-radius: 48rpx 0 0 48rpx;
	}
	.pass {
		color: #FFFFFF;
		background-color: #2A93FF;
		border-radius:  0 48rpx 48rpx 0;
	}
}

</style>
