<template>
	<view class="webview-box">
		<web-view ref="webview" class="webview" :src="src" @message="handleMessage"></web-view>
	</view>
</template>
<script>
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
import { h } from "vue"

	var webView
	const listenList = {}
	export default {
		data() {
			return {
				src: '',
				disabledApi: ['setStorage', 'setStorageSync', 'removeStorage', 'removeStorageSync', 'clearStorageSync',
					'clearStorage'
				]
			}
		},
		onLoad(option) {
			console.log(option)
			this.src = option.url || 'http://172.22.93.1:8080/h5.html'
			
			// #ifdef APP-PLUS
			var current = this.$scope.$getAppWebview()
			setTimeout(() => {
				webView = current.children()[0]
			}, 1000)
			// #endif
			
			// 这里还是有bug,编译成H5后,webView的evalJS 无法使用
			// #ifdef H5
			window.addEventListener("message", this.handleMessage, false)
			setTimeout(() => {
				webView = this.$refs.webview
			}, 1000)
			// #endif
		},
		onHide() {
			// 页面即将退出时要清理监听的内容,防止内存泄露
			console.log('hide')
			for (var key in listenList) {
				uni[listenList[key].offName](listenList[key].callBack)
			}
		},
		onBackPress() {
			// 页面即将退出时要清理监听的内容,防止内存泄露
			console.log('onBackPress')
			for (var key in listenList) {
				uni[listenList[key].offName](listenList[key].callBack)
			}
		},
		methods: {
			// 接收h5页面发来的键值判断需要执行的操作
			handleMessage(evt) {
				
				let d = {}
				
				// #ifdef APP-PLUS
				d = evt.detail.data[0];
				// #endif
				
				// #ifdef H5
				console.log("postMessage: ", evt)
				if(evt.data.data) {
					d = evt.data.data.arg;
				}
				// #endif
				
				var _this = this;
				// H5 不能使用部分API
				for (const i in this.disabledApi) {
					if (i === d.apiName) {
						console.error('API CANNOT USE')
						return
					}
				}

				if (d.apiName) {
					// 特殊处理sendMessage这类, 必须有回调函数
					if(d.apiName === 'sendMessage' && d.callBackList && d.callBackList.length) {
						// 处理不同类型的数据交互
						switch (d.params.type) {
							case 'changeWebviewUrl':
								let res = {
									code: 0,
									message: 'url已修改!'
								}
								webView.evalJS(`UNI_CALLBACK("${d.callBackList[0]}", ${JSON.stringify(res)})`)
								break;
						}
					}else {
						switch (d.type) {
							case 1:
								const f = function(res) {
									webView.evalJS(`UNI_CALLBACK("${d.callBackList[0]}", ${JSON.stringify(res)})`)
								}

								// 此调用是监听调用
								if (d.offName) {
									listenList[d.apiName] = {
										offName: d.offName,
										callBack: f
									}
								}

								uni[d.apiName](f)
								break;
							case 2:
								if (d.onName) {
									// 需要取消的监听对象
									uni[d.apiName](listenList[d.onName].callBack)
								} else {
									uni[d.apiName]()
								}
								break;
							case 3:
								if (d.callBackList && d.callBackList.length) {
									d.callBackList.forEach((item) => {
										const n = item.split('_')
										// 若是选择图片需要转base64
										if (d.apiName === 'chooseImage' && n[1] === 'success') {
											d.params[n[1]] = function(data) {
												const a = JSON.stringify(data)
												const img = [];
												// 并行
												Promise.all(data.tempFilePaths.map(path => pathToBase64(path)))
													.then(res => {
														webView.evalJS(
															`UNI_CALLBACK("${item}", ${JSON.stringify(res)})`
															)
													})
													.catch(error => {
														console.error(error)
													})


											}
										} else {
											d.params[n[1]] = function(res) {
												const a = JSON.stringify(res)
												webView.evalJS(`UNI_CALLBACK("${item}", ${a})`)
											}
										}
									})
									delete d.callBackList
								}
								uni[d.apiName](d.params)
								break;
							case 4:
								const c = function(res) {
									webView.evalJS(`UNI_CALLBACK("${d.callBackList[0]}", ${JSON.stringify(res)})`)
								}
								c(uni[d.apiName](d.params))
								break;
						}						
					}
				}
			},
		}
	}
</script>

<style>
	.webview-box {
		position: absolute;
		left: 0px;
		right: 0px;
		top: 0px;
		bottom: 0px;
	}

	.webview {
		flex: 1;
	}
</style>