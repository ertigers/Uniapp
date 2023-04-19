# zdx-noMore
# 方法1 插件使用方法
1.插件直接引入
2.再父组件中写 name如下图解释可以替换，txt是显示得提示语言
<zdx-noMore name='no-counpon' txt='没有更多优惠券啦~' />
	/**
     * name 携带过来的图片名称 （与本地问图片文件相对应）    
     *   
     * no-addr（没有地址）
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
# 方法2 插件使用方法(不想用本地图片显示)
找文件uni-modules  -> zdx-noMore  -> components ->  lib  -> images  文件给后端传到服务器上，名字不要改
访问路径需要保持为：https1://www.aimie.com/images/no-address.png 这种的。

然后找到
uni-modules  -> zdx-noMore  -> components ->  zdx-moMore.vue 文件 把方法一隐藏，把方法二打开
，切记webUrl得记着打开，最好要写死，声明一个全局变量这样就可以使用了；