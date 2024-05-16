<template>
	<view>
		<view class="status_bar_1">
		  <!-- 这里是状态栏 -->
		</view>
		<web-view 
			:webview-styles="webviewStyles" 
			:src="webviewUrl"
			@message="onMessageFromWebview">
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
				// webviewUrl: 'https://cloud.tsinglink.com/h5.html#/home'
				webviewUrl: 'http://172.22.93.1:8080/h5.html#/home',
			}
		},
		mounted() {
			window.addEventListener("message", this.onMessageFromWebview, false)
			try{
				let url = uni.getStorageSync('webviewUrlHost');
				console.log(url);
				this.webviewUrl = (url ? url : 'http://172.22.93.1:8080') + '/h5.html#/home'
			}catch(e){
				this.webviewUrl = 'http://172.22.93.1:8080/h5.html#/home'
			}
		},
		methods:{
			onMessageFromWebview(e) {
				alert('收到消息了')
				console.log(e);
				let data = e.data.data
				if(data) {
					let arg = typeof data.arg === 'string' ? JSON.parse(data.arg) : data.arg
					console.log(arg);
					if(arg.url) {
						return console.log('通过url传输值');
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

</style>
