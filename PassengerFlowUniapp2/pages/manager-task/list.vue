<template>
    <view>
		<Header title="巡店问题"></Header>
        <uni-segmented-control :current="current" :values="items" 
			@clickItem="changeTab" styleType="text" 
			activeColor="#0099ff">
		</uni-segmented-control>
        <view class="content">
            <ProblemList :problemList="problemList" :navigateString="navigateString"></ProblemList> 
        </view>
    </view>
</template>

<script>
import Header from "../../component/Header.vue"
import ProblemList from "../../component/ProblemList.vue"
import moment from "moment"
import qxAPI from "../../api/index.js"
export default {
components:{ Header,ProblemList },
	data() {
		return {
			current: 0,
			statusMap:{
				"0":'0',
				"1":'8',
				"2":'9',
			},
			navigateMap:{
				"0":'P-L-P',
				"1":'P-E-A',
				"2":'P-L-A',
			},
			items:['待整改', '待验收', '已验收'],
			navigateString:'', // "P-L-P","P-L-R","P-L-A","P-E-P","P-E-R","P-E-A",
			task_index: undefined,
			report_user_index: undefined,
			problemList:[],
		}
	},
	filters: {
	  timeFilter: function (value) {
	    if (!value) return ''
	    return moment(value*1000).format('YYYY-MM-DD HH:mm')
	  }
	},
	mounted() { 
	},
	onLoad(options) {
		let params = JSON.parse(options.query)
		this.task_index = params.task_index,
		this.report_user_index = params.manager_user_index
	},
	onShow() {
		this.fetchProblemList()
	},
	methods: {
		// tab栏变化,重新请求数据,重新详情跳转页面
		changeTab(e) {
			this.current = e.currentIndex
			this.fetchProblemList()
		},
		async fetchProblemList() {
			this.navigateString = this.navigateMap[this.current]
			let query = {
				task_index: this.task_index,
				report_user_index: this.report_user_index,
				status: this.statusMap[this.current],
				rows: 99999
			} 
			let data = await qxAPI.getProblemList(query)
			this.problemList = data.rows
		},
	}
}
</script>

<style lang="scss" scoped>
.segmented-control {
	height: 100rpx;
	font-size: 26rpx;
	background-color: #FFFFFF
	::v-deep .segmented-control__text {
		font-size: 26rpx;
	}
}
.content {
	margin-top: 20rpx;
	background-color: #FFFFFF;
}

</style>
