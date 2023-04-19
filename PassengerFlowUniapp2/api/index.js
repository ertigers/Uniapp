import qxRequest from "./request.js"

const qxAPI = {
	/*
	 * 登录页面相关
	 */
	login: (params)=>{
		return qxRequest.Post("/auth/login", params)
	},
	logout: (params)=>{
		return qxRequest.Post("/auth/logout", params)
	},
	setPassword: (params)=>{
		return qxRequest.Post("/user/password/set", params)
	},
	
	
	/*
	 * 通用接口
	 */
	getUserList: (params)=>{
		return qxRequest.Get("/user", params)
	},
	// 告警事件等级
	getEventLevel: (params)=>{
		return qxRequest.Get("/event/config", params)
	},
	/*
	 * 视频监控
	 */
	// 获取区域门店设备
	getDeviceTree: (params)=>{
		return qxRequest.Get("/district/store/tree", params)
	},
	getDistrictList: (params)=>{
		return qxRequest.Get("/district", params)
	},
	getStoreList: (params)=>{
		return qxRequest.Get("/store", params)
	},
	getDeviceList: (params)=>{
		return qxRequest.Get("/device", params)
	},
	// 获取设备下子资源（摄像头）
	getCameraList: (params)=>{
		return qxRequest.Post("/q2http/get/pu/resource", params)
	},
	

	
	/*
	 * 巡店管理
	 */
	
	// 任务管理
	getTaskList: (params)=>{
		return qxRequest.Get("/patrol/task", params)
	},
	addTask: (params)=>{
		return qxRequest.Post("/patrol/task/add/batch", params)
	},
	fixTask: (params)=>{
		return qxRequest.Post("/patrol/task/set/batch", params)
	},
	delTask: (params)=>{
		return qxRequest.Post("/patrol/task/del", params)
	},
	
	
	// 获取巡检问题 
	getProblemList: (params)=>{
		return qxRequest.Get("/patrol/problem", params)
	},
	// 添加巡检问题
	addProblem: (params)=>{
		return qxRequest.Post("/patrol/problem/add", params)
	},
	// 删除巡检问题
	delProblem: (params)=>{
		return qxRequest.Post("/patrol/problem/del", params)
	},
	// 查询整改信息
	getProblemRectify: (params)=>{
		return qxRequest.Get("/patrol/rectify", params)
	},
	// 店主整改问题
	addProblemRectify: (params)=>{
		return qxRequest.Post("/patrol/rectify/add", params)
	},
	// 验收通过
	acceptProblemRectify: (params)=>{
		return qxRequest.Post("/patrol/problem/accept", params)
	},
	// 验收不通过
	restartProblemRectify: (params)=>{
		return qxRequest.Post("/patrol/problem/restart", params)
	},
	// 查询巡检问题统计
	getProblemStatistics: (params)=>{
		return qxRequest.Get("/patrol/problem/statistics", params)
	},

}

module.exports = qxAPI;