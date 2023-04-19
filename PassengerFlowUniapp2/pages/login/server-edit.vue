<template>
	<view class="container">
		<Header title="登录设置" ></Header>
		<view class="form-wrapper">
			<uni-forms ref="formData" :modelValue="formData" :rules="rules" border>
				<uni-forms-item label="IP地址" name="address">
					<uni-easyinput :inputBorder="false" type="text" v-model="formData.address" placeholder="请输入IP地址" />
				</uni-forms-item>
				<uni-forms-item label="端口" name="port">
					<uni-easyinput :inputBorder="false" type="text" v-model="formData.port" placeholder="请输入端口"/>
				</uni-forms-item>
			</uni-forms>
			<button @click="submit">保存</button>			
		</view>
	</view>
</template>

<script>
import $conf from "../../config.js"
import Header from "../../component/Header.vue"
export default {
	components:{ Header },
		data() {
			return {
				formData:{
					address:'',
					port:''
				},
				rules: {
					address: {
						rules: [{
							required: true,
							errorMessage: "IP地址不能为空！",
						}],
						validateTrigger: 'change'
					},
					port: {
						rules: [{
							required: true,
							errorMessage: "端口不能为空！",
						}],
						validateTrigger: 'change'
					}
				},
			}
		},
		methods: {
			submit() {
				this.$refs.formData.validate().then(async (res) => {
					let serverData = {
						address: res.address,
						port: res.port
					};
					this.setLocalStorage("serverData",serverData)
					getApp().globalData.host = res.address
					getApp().globalData.port = res.port
					uni.navigateBack({
						delta: 1,
						success(res) {
							uni.showToast({
								icon: 'success',
								title: "保存成功！",
								duration: 1000
							});
						}
					});
				}).catch((err) => {
					console.log(err);
					uni.showToast({
						icon: 'error',
						title: "表单校验失败~",
						duration: 1000
					});
				});
			}
		},
		mounted() {
			let serverData = this.getLocalStorage('serverData');
			if(serverData) {
				this.$set(this.formData,'address',serverData.address)
				this.$set(this.formData,'port',serverData.port)
			}else {
				this.$set(this.formData,'address',$conf.host)
				this.$set(this.formData,'port',$conf.port)
			}
		}
	}
</script>

<style lang="scss" scoped>
/deep/ {
	.uni-easyinput__content-input {
		text-align: right;
		padding-right: 20rpx;
	}
	.uni-forms-item {
		text-align: right;
		padding-right: 40rpx;
	}
}
.container {
	.form-wrapper {
		padding: 20rpx;
		background-color: #FFFFFF;		
	}
}
</style>
