<template>
	<view class="container">
		<Header :title="'修改密码'"></Header>
		<view class="content">
			<view class="title">
				<view class="row1">请设置新密码</view>
				<!-- <view class="row2">登录密码长度为6-16位，不能是纯数字，字母或字符</view> -->
				<view class="row2">登录密码长度为6-16位</view>
			</view>
			<view class="password-form">
				<uni-forms ref="form" :rules="rules" :modelValue="formData">
				<!-- <uni-forms ref="form"  :modelValue="formData"> -->
					<uni-forms-item required name="password1">
						<uni-easyinput type="password" v-model="formData.password1" placeholder="请输入旧密码">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item required name="password2">
						<uni-easyinput type="password" v-model="formData.password2" placeholder="请输入新密码">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item required name="password3">
						<uni-easyinput type="password" v-model="formData.password3" placeholder="请确认新密码">
						</uni-easyinput>
					</uni-forms-item>
					<button @click="formSubmit">确定修改</button>
				</uni-forms>
			</view>
		</view>
	</view>
</template>

<script>
	import qxAPI from '@/api/index.js';
	import Header from "../../component/Header.vue"
	import md5 from 'md5';
	export default {
		components: {
			Header
		},
		data() {
			return {
				formData: {
					password1: '',
					password2: '',
					password3: '',
				},
				rules: {
					password1:{
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 6,
								maxLength: 16,
								errorMessage: '密码长度在6至16个字符',
							}, 
							// {
							// 	pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/,
							// 	errorMessage: '不能纯数字或字母'
							// },
							{
								pattern: /^[^\s]*$/,
								errorMessage: '不能有空格',
							},
							]	
					},
					password2:{
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 6,
								maxLength: 16,
								errorMessage: '密码长度在6至16个字符',
							}, 
							// {
							// 	pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/,
							// 	errorMessage: '不能纯数字或字母'
							// },
							{
								pattern: /^[^\s]*$/,
								errorMessage: '不能有空格'
							},
							]	
					},
					password3:{
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 6,
								maxLength: 16,
								errorMessage: '密码长度在6至16个字符',
							}, 
							// {
							// 	pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/,
							// 	errorMessage: '不能纯数字或字母'
							// },
							{
								pattern: /^[^\s]*$/,
								errorMessage: '不能有空格'
							},
							]	
					},
				}
			}
		},
		methods: {
			formSubmit() {
				uni.showLoading()
				this.$refs.form.validate().then( async (res) => {
					uni.hideLoading()
					console.log('表单数据信息：', res);
					if(res.password2 != res.password3) {
						uni.showToast({
							icon: 'error',
							title: "新密码不一致！",
							duration: 1000
						});
						return
					}
					let loginData = this.getLocalStorage('loginData')
					let query = {
						index: loginData.userData.index,
						password: md5(res.password1),
						npassword: md5(res.password3)
					}
					const data = await qxAPI.setPassword(query)
					if(data.code === 0) {
						uni.removeStorageSync('qx_tc_token');
						uni.removeStorageSync('loginData')
						uni.redirectTo({
							url: '../login/login',
							success(res) {
								uni.showToast({
									icon: 'success',
									title: "修改成功!",
									duration: 1000
								});
							}
						});
					}
				}).catch(err => {
					uni.hideLoading()
					console.log('表单错误信息：', err);
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body {
		height: 100%;
	}

	.container {
		height: 100%;
		background-color: #FFFFFF;

		.content {
			padding: 40rpx;

			.title {
				.row1 {
					font-size: 32rpx;
					font-weight: bold;
					color: rgba(0, 0, 0, 0.7);
				}

				.row2 {
					font-size: 24rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.5);
					margin-top: 24rpx;
				}
			}

			.password-form {
				margin-top: 80rpx;

				.uni-easyinput {
					margin-top: 20rpx;
					border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);

					/deep/ {
						.is-input-border {
							border: none;
						}
					}
				}

				button {
					height: 80rpx;
					font-size: 32rpx;
					color: #FFFFFF;
					background: #2A93FF;
					border: none;
					border-radius: 48rpx;
					margin-top: 100rpx;
				}
			}
		}
	}
</style>
