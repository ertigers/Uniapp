<template>
	<view class="content">
		<view class="position-group">
			<view class="tree" v-if="treeData.length">
				<!-- 一级循环 -->
				<view class="tree-one" v-for="(item1,index1) in treeData" :key="index1">
					<view class="tree-one-label" @click="toggleTreeItem(item1)">
						<image src="../static/icon/eq-city.png" ></image>
						<view class="text">{{item1.name}}</view>
						<uni-icons :type="item1.showVisible ? 'arrowup' : 'arrowdown' " size="20"></uni-icons>
					</view>
					<!-- 二级循环 -->
					<view :class="item1.showVisible?'show':'hide'">
						<view v-if="item1.children && item1.children.length">
							<view class="tree-two" v-for="(item2,index2) in item1.children" :key="index2">
								<view class="tree-two-label" @click="toggleTreeItem(item2)">
									<image src="../static/icon/icon-store.png" ></image>
									<view class="text">{{item2.name}}</view>
									<uni-icons :type="item2.showVisible ? 'arrowup' : 'arrowdown' " size="20"></uni-icons>
								</view>
								<!-- 三级循环 -->
								<view :class="item2.showVisible?'show':'hide'"> 
									<view v-if="item2.children && item2.children.length">
										<view class="tree-three" v-for="(item3,index3) in item2.children" :key="index3">
											<view class="tree-three-label" @click="clickTreeThree(item3)">
												<image v-if="item3.onlineflag" src="../static/icon/icon-shebei.png" ></image>
												<image v-else src="../static/icon/shebei-outline.png" ></image>
												<view class="text">{{item3.name}}</view>
												<uni-icons :type="item3.showVisible ? 'arrowup' : 'arrowdown' " size="20"></uni-icons>
											</view>
											<!-- 四级循环 -->
											<view :class="item3.showVisible?'show':'hide'">
												<view class="tree-four" v-if="item3.children && item3.children.length">
													<view class="tree-four-label" v-for="(item4,index4) in item3.children" :key="index4"
														@click="clickTreeFour(item3,item4)">
														<image v-if="item4.Usable" src="../static/icon/icon-camera.png" ></image>
														<image v-else src="../static/icon/icon-camera-outline.png" ></image>
														<view class="text">{{item4.Name}}</view>
													</view>
												</view>
												<view class="tree-four-label" v-else>
													<view class="text">暂无数据~</view>
												</view>
											</view>
										</view>
									</view>
									<view class="tree-four-label" v-else>
										<view class="text">暂无数据~</view>
									</view>
								</view>
							</view>
						</view>
						<view class="tree-four-label" v-else>
							<view class="text">暂无数据~</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" v-else>
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	import qxAPI from "../api/index.js"
	export default {
		props: {
			treeData: {
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {
			}
		},
		mounted() {
		},
		methods: {
			// 折叠与展开
			toggleTreeItem(item) {
				let result = item['showVisible']
				if (result == false || result === undefined) {
					this.$set(item, 'showVisible', true)
				} else {
					this.$set(item, 'showVisible', false)
				}
			},
			// 懒加载获取第四级别
			async clickTreeThree(item) {
				if(!item.onlineflag) {
					uni.showToast({
						icon: 'warning',
						title: "设备已下线！",
						duration: 1000
					});
					return
				}
				let query = {
					puid:item.puid
				}
				const res = await qxAPI.getCameraList(query)
				console.log(res);
				this.$set(item, 'children', res.rows)
				this.toggleTreeItem(item)
			},
			// 播放视频
			clickTreeFour(item1,item2) {
				console.log(item1,item2);
				let item = {
					name: item2.Name,
					puid: item1.puid,
					idx: Number(item2.Idx)
				}
				if(!item2.Usable) {
					uni.showToast({
						icon: 'warning',
						title: "设备已下线！",
						duration: 1000
					});
					return
				}
				this.$emit('searchVideo',item)
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #fff;
	}

	.position-group {
		width: 100%;
		height: auto;
	}

	/* 一级 */
	.tree-one {
		width: 100%;
		height: auto;

	}

	.tree-one-label {
		width: 100%;
		height: 110rpx;
		line-height: 110rpx;
		background: #fff;
		box-sizing: border-box;
		padding: 0px 3%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px #eaeaea solid;
	}

	.tree-one-label image {
		width: 30rpx;
		height: 30rpx;
		padding-right: 30rpx;
	}

	.tree-one-label .text {
		font-size: 30rpx;
		font-weight: 600;
		margin-right: auto;
	}

	.tree-one-label .uni-icons {
		color: #aaa;
		font-size: 20px;
		transition: all 0.5s;
	}




	/* 二级 */
	.tree-two {
		width: 90%;
		height: auto;
		margin: 0 auto;
		transition: all 0.5s;
	}

	.tree-two-label {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0px 3%;
		border-bottom: 1px #eee solid;
		image {
			width: 30rpx;
			height: 30rpx;
			padding-right: 30rpx;
		}
		.text {
			color: #333;
			font-size: 28rpx;
			font-weight: 500;
			margin-right: auto;
		}
		.uni-icons {
			color: #aaa;
			font-size: 26rpx;
			transition: all 0.5s;
		}
	}


	/* 三级 */
	.tree-three {
		width: 90%;
		height: auto;
		margin: 0 auto;
	}

	.tree-three-label {
		width: 97%;
		margin-left: 3%;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px #f1f1f1 solid;
		align-items: center;
		image {
			width: 30rpx;
			height: 30rpx;
			padding-right: 30rpx;
		}
		.text {
			width: 90%;
			font-size: 26rpx;
			color: #868686;
		}
	}
	
	/* 四级 */
	.tree-four {
		width: 90%;
		height: auto;
		margin: 0 auto;
	}
	
	.tree-four-label {
		width: 97%;
		margin-left: 3%;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1px #f1f1f1 solid;
		align-items: center;
		image {
			width: 30rpx;
			height: 30rpx;
			padding-right: 30rpx;
		}
		.text {
			width: 90%;
			font-size: 26rpx;
			color: #868686;
		}
	}

	// 控制展开与折叠
	.show {
		display: block;
	}
	.hide {
		display: none;
	}
</style>
