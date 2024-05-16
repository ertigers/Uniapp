<template>
	<!-- 登录页 -->
	<view>	
		<view class="login-container">
			<navigator class="img-wrapper" url="./server-edit">
				<image src="../../static/icon/login/setting.png" mode="widthFix"></image>
			</navigator>
			<view class="login-form-wrap">
				<uni-forms ref="loginForm" :modelValue="loginForm" :rules="rules">
					<uni-forms-item label="用户名 :" name="loginid">
						<uni-easyinput type="text" v-model="loginForm.loginid" placeholder="请输入用户名" />
					</uni-forms-item>
					<uni-forms-item label="密 码 :" name="password">
						<uni-easyinput type="password" v-model="loginForm.password" placeholder="请输入密码" />
					</uni-forms-item>
					<!-- <uni-forms-item label="验证码:" name="verifyCode">
						<uni-easyinput class="input" type="text" v-model="loginForm.verifyCode" placeholder="请输入验证码" />
					</uni-forms-item> -->
				</uni-forms>
				<view class="auto-login">
					<view class="login-text">
						自动登录
					</view>
					<checkbox-group @change="toggleAutoLogin">
						<checkbox value="autoLogin" :checked="autoLogin" />
					</checkbox-group>
				</view>
				<button @click="formSubmitHandler" :loading="loading">登录</button>
			</view>
		</view>
		<e-modal :visible.sync="visible">
			<view class="update-tip">
				<view>
					更新提示
				</view>
				<view>
					发现新版本，请更新至最新版本使用！
				</view>
				<view @click="update()">
					确定
				</view>
			</view>
		</e-modal>
<!-- 		<wyb-loading ref="loading" 
			title='正在登录...' 
			loading-type='flower' 
			animation='zoom-lessen' 
			bg-color='#7e7e7e' 
			:mask-alpha='0.2'
		/> -->
	</view>
</template>

<script>
	// import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	import $conf from '../../config.js'
	import { setLocalStorage,getLocalStorage } from"../../utils/help.js"
	import qxAPI from '@/api/index.js';
	import md5 from 'md5';
	export default {
		// components: {
		// 	wybLoading
		// },
		data() {
			return {
				autoLogin: false,
				loginForm: {
					loginid: '',
					password: '',
					verifyCode: ''
				},
				rules: {
					loginid: {
						rules: [{
							required: true,
							errorMessage: "用户名不能为空！",
						}],
						validateTrigger: 'change'
					},
					password: {
						rules: [{
							required: true,
							errorMessage: "密码不能为空！",
						}, {
							maxLength: 16,
							errorMessage: "密码不能超过16个字符！",
						}],
						validateTrigger: 'change'
					},
				},
				visible: false,
				intranetUrl:'',
				loading: false,  // 登录
			}
		},
		async created() {
			// 检测软件版本更新，非最新的就去提示更新
			let version = await this.checkVersion()
			if(version.statusCode === 200) {
				if(version.data.leastVerCode > $conf.versionValue) {  // 必须更新的版本
					this.intranetUrl = version.data.intranetUrl
					this.visible = true
					return
				}else if(version.data.versionCode > $conf.versionValue) {  // 选择性更新的版本
					uni.showModal({
						title: '提示',
						content: '有新的版本，需要立即更新吗？',
						success: (res) => {
							if (res.confirm) {
								this.update(version.data.intranetUrl)
							} else if (res.cancel) {
								console.log('取消了哦');
							}
						}
					});
					return
				}
			}
			// 进行登录判断
			let loginData = getLocalStorage('loginData');
			if (loginData) {
				this.loginForm.loginid = loginData.loginid;
				this.loginForm.password = loginData.password;
				this.autoLogin = loginData.autoLogin
			}
			let qx_tc_token = getLocalStorage('qx_tc_token');
			if(qx_tc_token && this.autoLogin) {
				uni.redirectTo({
					url: '../index/index', 
				});
			}
		},
		methods: {
			update(intranetUrl) {
				var dtask = plus.downloader.createDownload( intranetUrl || this.intranetUrl, {}, function ( d, status ) {  
					// 下载完成  
					if ( status == 200 ) {   
						plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename),{},{},function(error){  
							uni.showToast({  
								title: '安装失败',  
								mask: false,  
								duration: 1500  
							});  
						})  
					} else {  
						 uni.showToast({  
							title: '更新失败',  
							mask: false,  
							duration: 1500  
						 });  
					}    
				});  
				dtask.start();   
			},
			checkVersion() {
				let data = {
					appid: $conf.appId,
					deviceid:'',
				}
				return new Promise((resolve) => {
					uni.request({
						url: $conf.versionUrl, //接口地址
						header: {
							Accept: "application/json"
						},
						data: data, // 传入的参数
						method: 'POST', // 请求方法
						success: function(res) {
							resolve(res)
						}
					})					
				})					
			},
 
			toggleAutoLogin(e) {
				let values = e.detail.value;
				this.autoLogin = values.includes('autoLogin') ? true : false 
			},

			formSubmitHandler() {
				this.$refs.loginForm.validate().then(async (res) => {
					this.loading = true
					let query = {
						user: res.loginid,
						password: md5(res.password),
					}
					let result
					try{
						result = await qxAPI.login(query);
					}finally {
						this.loading = false
					}
					if (result.code === 0) {
						let loginData = {
							loginid: res.loginid,
							password: res.password,
							autoLogin: this.autoLogin,
							userData: result.user   // 用户的基本信息，包括权限，角色，模块。
						};
						setLocalStorage("qx_tc_token",result.token)
						setLocalStorage("loginData",loginData)
						uni.redirectTo({
							url: '../index/index',
							success(res) {
								uni.showToast({
									icon: 'success',
									title: "登录成功！",
									duration: 1000
								});
							}
						});
					} else {
						console.debug('login failed', res);
						uni.showToast({
							icon: 'error',
							title: "账号密码错误！",
							duration: 1000
						});
					}
				})
				.catch((err) => {
					this.loading = false
					console.log(err);
					uni.showToast({
						icon: 'error',
						title: "登录失败！",
						duration: 1000
					});
				});
			}
		},
	}
</script>
 
<style lang="scss" scoped>
/deep/ {
	uni-checkbox {
		.uni-checkbox-wrapper {
			.uni-checkbox-input {
				margin-right: 0;
			}
		}
	}
	.is-input-border {
		border: none;
	}
	.uni-forms-item {
		height: 80rpx;
		color: #FFFFFF;
		border: 2rpx solid rgba(255, 255, 255, 0.6); 
		border-radius: 40rpx;
		padding: 0 30rpx;
		margin-bottom: 42rpx;
	}
	.uni-input-wrapper {
		color: #FFFFFF;
	}
	.uni-forms-item__label { 
		.label-text {
			font-size: 28rpx;
			color: #FFFFFF;
			opacity: 0.8;
		}
	}
	uni-checkbox .uni-checkbox-input {
		border: none;
		width: 36rpx;
		height: 36rpx;
	}
	.uni-input-placeholder {
		color: #FFFFFF;
		opacity: 0.6;
		font-size: 28rpx;
	}

}
// uni-page-body {
// 	height: 100vh;
// }
.login-container {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: no-repeat center/100% url(../../static/image/login/bg.png);
	position: relative;
	color: #FFFFFF;
}

.img-wrapper {
	position: absolute;
	right: 20rpx;
	top: 20rpx;

	image {
		width: 48rpx;
		height: 48rpx;
	}
}


.login-form-wrap {
	width: 90%;

	button {
		height: 80rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		background: #2A93FF;
		border: none;
		border-radius: 48rpx;
	}
}

.auto-login {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-right: 40rpx;
	margin-top: 40rpx;
	margin-bottom: 40rpx;
	font-size: 24rpx;
	.login-text {
		opacity: 0.8;
		margin-right: 20rpx;
	}
}
.update-tip {
	text-align: center;
	padding: 20rpx 0;
	:nth-child(1) {
		font-weight: 600;
	}
	:nth-child(2) {
		margin: 60rpx 0;
		font-size: 24rpx;
	}
	:nth-child(3) {
		border-top: 1rpx solid grey;
		padding: 20rpx 0 10rpx;
	}
}
</style>
