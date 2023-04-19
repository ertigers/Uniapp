<template>
	<view class="tc-header">
		<view class="left" @click="goBack">
			<slot name="left">
				<image src="../static/icon/common/ico-back@2x.png" mode=""></image>
				<text>{{ leftText }}</text>
			</slot>
		</view>
		<view class="center">
			<slot name="center">
				<text>{{ title }}</text>
			</slot>
		</view>
		<view class="right">
			<slot name="right">
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			leftText: {
				type: String,
				default () {
					return ""
				}
			},
			title: {
				type: String,
				default () {
					return ""
				}
			}
		},
		data() {
			return {

			}
		},
		mounted() {},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tc-header {
		height: 90rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		background-color: #2C81D3;
		color: #FFFFFF;
	}

	.left { 
		width: 50rpx;
		display: flex;
		align-items: center;
		font-size: 32rpx;
		image {
			width: 40rpx;
			height: 40rpx;
		} 
	}
	.center {
		font-size: 30rpx;
		font-weight: 600;
	}
	.right {
		width: 50rpx;
	}
</style>
