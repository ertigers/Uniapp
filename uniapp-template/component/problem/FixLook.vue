<template>
	<!-- 整改区域 -->
	<view class="problem-fix">
		<view class="title">整改情况：</view>
		<uni-forms label-width="80">
			<uni-forms-item label="整改说明:" required >
				<uni-easyinput disabled type="textarea" autoHeight v-model="problemData.description"></uni-easyinput>
			</uni-forms-item> 
			<uni-forms-item  label="整改图片:" required>
			</uni-forms-item>
			<view class="img-wrapper">
				<image :src="item" mode="aspectFit" 
					v-for="(item,index) in problemData.problemImage"
					@click="previewImage(problemData.problemImage,index)">
				</image>
			</view>
		</uni-forms>
	</view>
</template>

<script>
import qxAPI from "../../api/index.js"
export default {
components:{  },
	props:{
		problemIndex:{
			type: Number,
		}
	},
	data() {
		return {
			problemData:{}
		}
	},
	watch:{
		problemIndex: {
		  handler (val) {
			this.fetchProblemFixData(val)
		  },
		  immediate: true,
		}
	},
	onLoad() {
	},
	mounted() {
	},
	methods: {
		// 获取巡检数据
		async fetchProblemFixData(index) {
			let baseUrl =  `http://${getApp().globalData.host}:${getApp().globalData.port}/`
			let data = await qxAPI.getProblemRectify({problem_index:index})
			let problemData = data.rows[0]
			this.problemData = {
				description: problemData.description,
				problemImage: problemData.imglist.map(item=>{return baseUrl + item.filepath}),
			}
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
@import "./problemDetail.scss";
</style>
