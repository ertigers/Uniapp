<template>
	<view class="tc-notice">
		<cmdNoticeBar :text="text" type="activity" icon="alert-circle"></cmdNoticeBar>
	</view>
</template>

<script>
	import cmdNoticeBar from "../components/cmd-notice-bar/cmd-notice-bar.vue"
	import io from "socket.io-client"
	export default {
	    components: { cmdNoticeBar },
		data() {
			return {
				text:'报警事件！',
				socketTask: null,
			}
		},
		mounted() {
			// this.connectSocketInit() // 连接ws，接收告警事件
		},
		methods: {
			connectSocketInit() {
				console.log(io);
				this.socketTask = io("ws://172.22.95.1:9591/website")
				console.log(this.socketTask);
				this.socketTask.on((result) => {
					console.log(result);
				});
				this.socketTask.on('alarm', (result) => {
					console.log(result.data);
				});
				this.socketTask.on('device_status_changed', (result) => {
					console.log(result.data);
				});
				
				// uni.connectSocket({
				//     url: 'ws://172.22.95.1:9591/website',
				// 	success(data) {
				// 		console.log("websocket连接成功",data);
				// 	},
				// 	complete(data) {
				// 		console.log("websocket连接complete",data);
				// 	}
				// });
				// uni.onSocketOpen(function (res) {
				//   console.log('WebSocket连接已打开！',res);
				// });
				// uni.onSocketError(function (res) {
				//   console.log('WebSocket连接打开失败，请检查！',res);
				// });
				// uni.onSocketMessage(function (res) {
				//   console.log('收到服务器内容：' + res);
				// });
				
				
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				// this.socketTask = uni.connectSocket({
				// 	// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
				// 	url: "ws://172.22.95.1:9591/website",
				// 	success(data) {
				// 		console.log("websocket连接成功");
				// 	},
				// });
				
				// // 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				// this.socketTask.onOpen((res) => {
				// 	console.log("WebSocket连接正常打开中...！");
				// 	this.is_open_socket = true;
				// 	// 注：只有连接正常打开中 ，才能正常成功发送消息
				// 	this.socketTask.send({
				// 		data: "uni-app发送一条消息",
				// 		async success() {
				// 			console.log("消息发送成功");
				// 		},
				// 	});
				// 	// 注：只有连接正常打开中 ，才能正常收到消息
				// 	this.socketTask.onMessage((res) => {
				// 		console.log("收到服务器内容：" + res.data);
				// 	});
				// })
				// // 这里仅是事件监听【如果socket关闭了会执行】
				// this.socketTask.onClose(() => {
				// 	console.log("已经被关闭了")
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
.tc-notice {
	width: 100vw;
	margin-left: -10px;
	margin-top: -10px;
}
</style>
