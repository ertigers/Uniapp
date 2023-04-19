<template>
  <view class="NOList">
    <view class="no-addr">
	  <!-- 方法1，本地缓存图片 -->
      <image :src="require('../../lib/images/'+name+'.png')" mode="widthFix" />
	  
	  <!-- 方法2，存到服务器上图片处理 -->
	  <!-- <image :src="`${webUrl}/no-list/${name}.png`" mode="widthFix" /> -->
	  
      {{txt || '没有更多数据~'}}
    </view>
  </view>
</template>

<script>
  // import { config } from '@/apis/index.js'
  export default {
    name: "NOList",
    /**
     * name 携带过来的图片名称 （与本地问图片文件相对应）    
     *   
     * no-address（没有地址）
     * no-counpon（没有优惠券）
     * no-goods（没有商品）
     * no-list（没有订单列表）
     * no-news（没有任何消息）
	 * no-chain （没有区块链信息）
	 * no-collection（没有任何收藏信息）
	 * no-foot （没有足迹信息）
	 * no-in（没有收入信息）
	 * no-out （没有任何支出信息）
	 * no-order （没有任何订单信息）
	 * no-order-list （没有任何订单信息）
	 * no-record （没有任何收益信息）
	 * no-records （没有任何收益信息2）
	 * no-search （没有任何搜索信息）
	 * no-shop （没有任何店铺信息）
	 * 
     * 
     * txt 携带过来的提示语
     */
    props: {
      name: String,
      txt: String
    },
    data() {
      return {
		// webUrl:'https://storage.linsangxingqiu.vip/', //方法2 这个位置最好不好写死，要写一个全局变量，跟后端要一个地址专门存放这些图片
      };
    }
  }
</script>

<style lang="scss" scoped>
  // 无地址
  .no-addr {
    padding-top: 20rpx*6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    color: #999;
    font-size: 28rpx;

    image {
      margin-bottom: 30rpx*4;
      margin-top: 30rpx*2;
      width: 400rpx;
      opacity: .4;
    }
  }
</style>
