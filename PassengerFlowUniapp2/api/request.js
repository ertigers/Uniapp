import ErrorCode from "../utils/error.js"
const qxRequest = {
	request: function(method, url, data) {
		let baseUrl = `http://${getApp().globalData.host}:${getApp().globalData.port}/api/v1`;
		return new Promise((resolve, reject) => {
			uni.request({
				url: baseUrl + url, //接口地址
				header: {
					Accept: "application/json"
				},
				data: data, // 传入的参数
				method: method, // 请求方法
				success: function(res) {
					if (res.statusCode !== 200) { //请求失败显示报错信息
						uni.showToast({
							title: "网络请求失败!",
							duration: 1000,
							icon: "none"
						})
					}else {
						if(res.data.code === 0) {
							resolve(res.data) // 成功返回的结果
						}else if(res.data.code === 101) {
							if(url === '/auth/login') {
								resolve(res.data)
								return
							}
							uni.removeStorageSync('qx_tc_token');
							uni.reLaunch({
								url: '/pages/login/login',
								success(res) {
									uni.showToast({
										icon: 'success',
										title: "请重新登录！",
										duration: 1000
									});
								}
							});
						}else{
							uni.showToast({
								icon: 'error',
								title: ErrorCode[res.data.code] || "未知错误！",
								duration: 1000
							});
							reject(res.data)
						}
					}
				},
				fail: function(err) {
					reject(err) // 失败结果
				}
			})
		});
	},
	requestImg: function(url, files, data) {
		let baseUrl = `http://${getApp().globalData.host}:${getApp().globalData.port}/api/v1`;
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: baseUrl + url, //接口地址
				filePath: files,
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				formData: data, // 传入的参数 
				success: function(res) {
					if (res.statusCode !== 200) { //请求失败显示报错信息
						uni.showToast({
							title: res.statusCode.toString(),
							duration: 1000,
							icon: "none"
						})
						return;
					}
					resolve(res.data) // 成功返回的结果
				},
				fail: function(err) {
					reject(err) // 失败结果
				}
			})
		});
	},

	// 常用请求方法封装
	Get: function(url, data) {
		return this.request('GET', url, data);
	},
	Post: function(url, data) {
		return this.request('POST', url, data);
	},
	Put: function(url, data) {
		return this.request('PUT', url, data);
	},
	Patch: function(url, data) {
		return this.request('PATCH', url, data);
	},
	Delete: function(url, data) {
		return this.request('DELETE', url, data);
	},
	Upload: function(url, files, data) {
		return this.requestImg(url, files, data)
	},

};
// 导出方法
module.exports = qxRequest
