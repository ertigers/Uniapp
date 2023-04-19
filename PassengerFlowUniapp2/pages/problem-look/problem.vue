
<template>
    <view class="container">
		<Header leftText="" title="问题详情"> </Header>
		<!-- 展示问题区域 -->
		<DescriptionLook :problemShowData='problemShowData'></DescriptionLook> 
		<view class="btn-wrapper">
			<button type="warn" @click="delProblem" v-if="showAuth('patrol_problem_del')">删除</button>
		</view>
    </view>
</template>

<script>
import moment from "moment"
import Header from "../../component/Header.vue"
import DescriptionLook from "../../component/problem/DescriptionLook.vue"
import qxAPI from "../../api/index.js"
import { Auth } from "../../utils/auth.js"
export default {
components:{ Header,DescriptionLook },
	data() {
		return {
			problemShowData: {}
		}
	},
	onLoad(options) {
		let problemDetail  = JSON.parse(options.problemDetail)
		this.problemShowData = problemDetail
	},
	mounted() {

	},
	methods: {
		showAuth(value) {
			return Auth(value)
		},
		async delProblem() { 
			let query = {
				index: this.problemShowData.index
			}
			let data = await qxAPI.delProblem(query)
			if(data.code === 0) {
				uni.navigateBack({
				    delta: 2,
				    animationType: 'pop-out',
				    animationDuration: 200
				});
				uni.showToast({
					icon: 'success',
					title: "删除成功！",
					duration: 1000
				});
			}else{
				uni.showToast({
					icon: 'error',
					title: "删除失败！",
					duration: 1000
				});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #FFFFFF;
	.btn-wrapper {
		padding: 30rpx;
		uni-button {
			margin-bottom: 70rpx;
		}
	}
}

</style>
