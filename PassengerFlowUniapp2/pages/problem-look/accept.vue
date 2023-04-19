<template>
    <view class="container">
		<Header leftText="" title="验收详情"> </Header>
		<!-- 问题详情 -->
		<DescriptionLook :problemShowData='problemShowData'></DescriptionLook> 
		<!-- 整改情况 -->
		<FixLook :problemIndex='problemShowData.index'></FixLook>
		<!--  验收结果 -->
		<ResultLook :problemData='problemResultData'></ResultLook>
    </view>
</template>

<script>
import Header from "../../component/Header.vue"
import DescriptionLook from "../../component/problem/DescriptionLook.vue"
import FixLook from "../../component/problem/FixLook.vue"
import ResultLook from "../../component/problem/ResultLook.vue"
export default {
	components:{ Header,DescriptionLook,FixLook,ResultLook },
	data() {
		return {
			problemShowData:{},

			problemResultData:{  // 整改结果
				acceptDesc:''
			},
		}
	},
	onLoad(options) {
		let problemDetail  = JSON.parse(options.problemDetail)
		console.log(problemDetail);
		
		this.problemShowData = problemDetail
		this.problemResultData = {
			acceptDesc: problemDetail.accept_desc
		}
	},
	mounted() {
	},
	methods: {
 
	}
}
</script>

<style lang="scss" scoped>
</style>
