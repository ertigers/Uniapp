<template>
	<view class="">
		<view class="status_bar_1">
		  <!-- 这里是状态栏 -->
		</view>
		<view class="block" @click="handleClickFive">
		</view>
		<web-view 
			:webview-styles="webviewStyles" 
			:src="webviewUrl"
			@message="onMessageFromWebview" 
			@onPostMessage="onMessageFromWebview">
		</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				webviewUrl: 'http://172.22.93.1:8080/h5.html#/home',
			}
		},
		onLoad(onLoad) {
			console.log(onLoad);				
			// alert('onLoad,重新加载了')
			if(onLoad.newHost) {
				let newHost = onLoad.newHost + '/h5.html#/home'
				uni.setStorageSync('webviewUrlHost', onLoad.newHost);
				this.webviewUrl = newHost
			}else {
				try{
					let url = uni.getStorageSync('webviewUrlHost');
					console.log(url);
					this.webviewUrl = (url ? url : 'http://172.22.93.1:8080') + '/h5.html#/home'
				}catch(e){
					this.webviewUrl = 'http://172.22.93.1:8080/h5.html#/home'
				}
			}
		},
		mounted() {
			
			handleClickFive() {
			  this.clickTime += 1
			  console.log(this.clickTime);
			  if(this.clickTime === 5) {
				this.clickTime = 0
				this.show = true
			  }
			},
			
			window.addEventListener("message", this.onMessageFromWebview, false)
			// try{
			// 	let url = uni.getStorageSync('webviewUrlHost');
			// 	console.log(url);
			// 	this.webviewUrl = (url ? url : 'http://172.22.93.1:8080') + '/h5.html#/home'
			// }catch(e){
			// 	this.webviewUrl = 'http://172.22.93.1:8080/h5.html#/home'
			// }
		},
		methods:{
			handleClick() {
				alert('收到消息了,onMessageFromWebview')
			},
			onMessageFromWebview(e) {
				// alert('收到消息了,onMessageFromWebview')
				console.log(e);
				let data = e.data.data
				if(data) {
					let arg = typeof data.arg === 'string' ? JSON.parse(data.arg) : data.arg
					console.log(arg);
					if(arg.url) {
						console.log('通过url传输值');
						return
					}
					if(arg.oldHost ===  this.webviewUrl.split('/h5.html#/home')[0] && arg.newHost) {
						let newHost = arg.newHost + '/h5.html#/home'
						console.log(newHost);
						uni.setStorageSync('webviewUrlHost', arg.newHost);
						this.webviewUrl = newHost
						console.log(this.webviewUrl);
					}else {
						console.log(111111111);
					}					
				} 
			}
		}
	}
</script>

<style>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color:#007AFF ;
}
.container {
	position: relative;
}

.block {
	position: absolute;
	right: 10px;
	top: 20px;
	width: 100px;
	height: 100px;
	background-color: red;
	z-index: 10000;
}
</style>
