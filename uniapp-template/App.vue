<script>
import $conf from './config.js';

export default {
	globalData: {
		host: $conf.host,
		port: $conf.port,
	},
	onLaunch: function() {
		let data = uni.getStorageSync('serverData');
		if (data) {
			let serverData = JSON.parse(data);
			getApp().globalData.host = serverData.address;
			getApp().globalData.port = serverData.port;
		}
		
	},
	onShow: function() {
	},
	onHide: function() {
	}
}
</script>

<style>

page {
	/* margin-top: 100rpx; */
	background-color: #F6F6F6;
}
.container {
	
}
</style>
