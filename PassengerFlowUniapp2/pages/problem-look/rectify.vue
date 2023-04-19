<template>
    <view class="container">
		<Header leftText="" title="验收详情"> </Header>
		<!-- 问题详情 -->
		<DescriptionLook :problemShowData='problemShowData'></DescriptionLook> 
		<!-- 整改情况 -->
		<FixLook :problemIndex='problemShowData.index'></FixLook>
    </view>
</template>

<script>
import Header from "../../component/Header.vue"
import DescriptionLook from "../../component/problem/DescriptionLook.vue"
import FixLook from "../../component/problem/FixLook.vue"
export default {
	components:{ Header,DescriptionLook,FixLook },
	data() {
		return {
			problemShowData:{},
		}
	},
	onLoad(options) {
		let problemDetail  = JSON.parse(options.problemDetail)
		console.log(problemDetail);
		this.problemShowData = problemDetail
	},
	mounted() {
	},
	methods: {
 
	}
}
</script>

<style lang="scss" scoped>
</style>
