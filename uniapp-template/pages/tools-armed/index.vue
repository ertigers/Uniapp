<template>
	<view class="container">
		<Header title="布防时间"></Header>
		<!-- <view class="my-search">
			<uni-search-bar @confirm="search" placeholder="搜索门店" clearButton="none" cancelButton="none"></uni-search-bar>
		</view> -->
		<view class="device-list-wrapper">
			<view class="device-list">
				<view class="item" v-for="(item,index) in storeList" :key="index">
					<image class="item-icon" src="../../static/icon/tools/ico-store@2x.png" mode=""></image>
					<view class="item-title">
						{{ item.name }}
					</view>
					<view class="time-wrapper">
						<view class="text">
							<view class="">
								不经营时间:
							</view>
							<view class="">
								布防时间:
							</view>
						</view>
						<view class="value">
							<view class="">
								2021-11.01-2021-11.01  08：00-20：00
							</view>
							<view class="">
								08：00-20：00
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Header from "../../component/Header.vue"
	export default {
		components: {
			Header,
		},
		data() {
			return {
				storeList:[],
			}
		},
		mounted() {
			this.fetchStoreList()
		},
		methods: {
			fetchStoreList() {
				let res = this.getLocalStorage("storeList")
				console.log(res);
				this.storeList = res
			},
			search(e) {
				console.log(e);
			},

		}
	}
</script>

<style lang="scss" scoped>
/deep/ {
	.uni-searchbar__box {
		background-color: #F4F5FC !important;
		border: none;
		border-radius: 70rpx !important;
		height: 60rpx;
		.uni-icons {
			color: #2C83D6 !important;
		}
	}
}
uni-page-body {
	height: 100vh;
}
.container {
	height: 100%;
	background-color: #FFFFFF;
}
.device-list-wrapper {
	.device-list {
		.item {
			display: flex;
			align-items: center;
			padding: 40rpx;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		}
	}
}
.item {
	.item-icon {
		width: 44rpx;
		height: 44rpx;
	}
	.item-title {
		flex: 1;
		margin-left:20rpx;
		
		font-size: 28rpx;
		font-weight: bold;
		color: rgb(0, 0, 0);
		
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.time-wrapper {
		width: 400rpx;
		display: flex;
		.text {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			text-align: right;
			width: 144rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.7);
			margin-right: 10rpx;
		}
		.value {
			text-align: left;
			flex: 1;
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.7);
		}
	}
}
</style>
