<template>
    <view>
		<Header title="巡店问题"></Header>
		<uni-datetime-picker
			v-model="range"
			type="daterange"
			:end="endTime"
			rangeSeparator="至" 
		/>
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
			range:[moment().subtract(1,'months').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
			endTime: moment().format('YYYY-MM-DD'),
			current: 0,
			statusMap:{
				"0":'0',
				"1":'8',
				"2":'9',
			},
			navigateMap:{
				"0":'P-E-R',
				"1":'P-L-R',
				"2":'P-L-A',
			},
			items:['待整改', '待验收', '已验收'],
			navigateString:'', // "P-L-P","P-L-R","P-L-A","P-E-P","P-E-R","P-E-A",
			problemList:[]
		}
	},
	watch:{
		range: {
			handler(newval) {
				this.fetchProblemList()
			},
			immediate: false,
			deep: true
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
	onLoad() {

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
			if(!this.range.length) {
				return uni.showToast({
					icon: 'none',
					title: "时间不能为空！",
					duration: 1000
				});
			}
			let loginData = this.getLocalStorage('loginData');
			let store_indexs = loginData.userData.store_indexs
			this.navigateString = this.navigateMap[this.current]
			let query = {
				begindate: this.range[0].split('-').join(''),
				enddate: this.range[1].split('-').join(''),
				status: this.statusMap[this.current],
				store_index: store_indexs, 
				rows: 9999,
			} 
			console.log(query);
			let data = await qxAPI.getProblemList(query)
			console.log(data);
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
