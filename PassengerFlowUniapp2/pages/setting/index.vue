<template>
	<view class="container">
		<Header :title="'设置'">
		</Header>
		<view class="navigator-wrapper">
			<navigator class="navigator-item" url="./change-password" hover-class="other-navigator-hover">
				<image src="../../static/icon/my-changepw.png" mode=""></image>
				<view class="">
					修改密码
				</view>
			</navigator>
<!-- 			<navigator class="navigator-item" url="./about-us" hover-class="other-navigator-hover">
				<image src="../../static/icon/my-aboutus.png" mode=""></image>
				<view class="">
					关于我们
				</view>
			</navigator> -->
			<view class="navigator-item" @click="loginOut" hover-class="other-navigator-hover">
				<image src="../../static/icon/my-loginout.png" mode=""></image>
				<view class="">
					注销
				</view>
			</view>		
		</view>
	</view>
</template>

<script>
import qxAPI from '@/api/index.js';
import Header from "../../component/Header.vue"
export default {
	components:{ Header },
		data() {
			return {
			}
		},
		methods: {
			async loginOut() {
				// await qxAPI.logout()
				uni.removeStorageSync('qx_tc_token');
				uni.removeStorageSync('loginData');
				uni.reLaunch({
					url: '../login/login',
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.container {

}
.navigator-wrapper {
	padding: 20px;
	font-size: 16px;
	line-height: 24px;
	.navigator-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		image {
			width: 30rpx;
			height: 30rpx;
			padding-right: 30rpx;
		}
	}
}
</style>
