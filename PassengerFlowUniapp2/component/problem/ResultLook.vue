<template>
	<!-- 验收结果区域 -->
	<view class="problem-result">
		<view class="title">验收结果：{{ problemData.res || '通过' }}</view>
		<uni-forms label-width="80">
			<uni-forms-item label="验收说明:" required name="acceptDesc">				
				<uni-easyinput disabled type="textarea" autoHeight v-model="problemData.acceptDesc" placeholder="请输入内容"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
export default {
components:{  },
	props:{
		problemData:{
			type: Object,
			default () {
				return {
					acceptDesc:'',
					res:'通过'
				}
			}
		}
	},
	data() {
		return {
		}
	},
	onLoad() {
	},
	mounted() {
	},
	methods: {
	}
}
</script>

<style lang="scss" scoped>
@import "./problemDetail.scss";
</style>
