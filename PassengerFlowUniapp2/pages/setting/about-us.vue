<template>
	<view class="container">
		<Header :title="'关于我们'"></Header>
		<view class="">
			关于我们
		</view>
	</view>
</template>

<script>
import qxAPI from '@/api/index.js';
import Header from "../../component/Header.vue"
export default {
components:{ Header },
	data() {
		return {
		}
	},
	methods: {
	
	}
}
</script>

<style lang="scss" scoped>
.container {

}
</style>
