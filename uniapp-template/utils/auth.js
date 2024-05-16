// uniapp暂不支持自定义指令做权限管理
// 只能用v-if判断是否展示

const Auth = (value)=>{
	// 处理权限
	const data = JSON.parse(uni.getStorageSync("loginData")).userData.permissions
	const permissions = Object.keys(data) 
	let bool = permissions.includes(value)
	return bool
}
const Modules = (value)=>{
	// 处理布局
	const modules = JSON.parse(uni.getStorageSync("loginData")).userData.app_modules
	let bool = modules.includes(value)
	return bool
}

export { Auth, Modules }