<template>
	<!-- 展示问题区域 -->
	<view class="problem-show">
		<view class="title">问题详情：</view>
		<uni-forms label-width="80">
			<uni-forms-item label="专管员:" required >
				<view class="row-line">
					<uni-easyinput disabled type="text" v-model="problemData.manager_user_name"/>
					<image @click="handleIphone" src="../../static/icon/common/ico-phone@2x.png" mode=""></image>
				</view>
			</uni-forms-item>
			<uni-forms-item label="区域:" required >
				<uni-easyinput disabled type="text" v-model="problemData.districtName"/>
			</uni-forms-item>
			<uni-forms-item label="门店:" required>
				<uni-easyinput disabled type="text" v-model="problemData.storeName" />
			</uni-forms-item>
			<uni-forms-item label="提出时间:" required >				
				<uni-easyinput disabled v-model="problemData.problemDate"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item  label="抓拍图片:" required >
			</uni-forms-item>
			<view class="img-wrapper">
				<image :src="item" mode="aspectFit" 
					v-for="(item,index) in problemData.problemImage"
					@click="previewImage(problemData.problemImage,index)">
				</image>
			</view>
			<uni-forms-item label="问题描述:" required >				
				<uni-easyinput disabled type="textarea" autoHeight v-model="problemData.description"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
import moment from "moment"
export default {
components:{  },
	props:{
		problemShowData:{
			type: Object,
			default () {
				return {}
			}
		},
	},
	data() {
		return {
			problemData:{}
		}
	},
	watch:{
		problemShowData:{
			handler (val) {
				console.log('watch',val);
				this.fetchProblemData(val)
			},
			immediate: true,
			deep: true
		}	
	},
	onLoad() {
	},
	mounted() {
	},
	methods: {
		handleIphone() {
			console.log(this.problemData.manager_user_phone);
			uni.makePhoneCall({
				phoneNumber: this.problemData.manager_user_phone, 
				// 成功回调
				success: (res) => {
					console.log('调用成功!')	
				},
				// 失败回调
				fail: (res) => {
					console.log('调用失败!')
				}
		  });
		},
		async fetchProblemData(problemDetail) {
			console.log(problemDetail);
			let baseUrl =  `http://${getApp().globalData.host}:${getApp().globalData.port}/`
			let districtMap = this.getLocalStorage("districtMap")
			let storeMap = this.getLocalStorage("storeMap")
			let userList = this.getLocalStorage("staffAllList") 
			let user = userList.find(item=>item.index === problemDetail.report_user_index)
			this.problemData = {
				districtName: districtMap[problemDetail.district_index],
				storeName: storeMap[problemDetail.store_index],
				problemDate: moment(problemDetail.report_time*1000).format('YYYY-MM-DD HH:mm'),
				problemImage: problemDetail.imglist.map(item=>{return baseUrl + item.filepath}),
				description: problemDetail.description,
				manager_user_phone: user.phone,
				manager_user_name: user.name
			}
			console.log(this.problemData);
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
.row-line {
	display: flex;
	align-items: center;
	image {
		width: 52rpx;
		height: 52rpx;
		margin-left: 40rpx;
	}
}
</style>
