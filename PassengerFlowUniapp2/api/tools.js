/*
 * 门店工具
 */
import qxRequest from "./request.js"

const qxAPI = {
	// 经营数据,年龄，性别
	getStatistics: (params)=>{
		return qxRequest.Get("/passengerflow/passenger/count", params)
	},
	// 查询门店新老顾客对比
	getComparison: (params)=>{
		return qxRequest.Get("/passengerflow/passenger/comparison", params)
	},
	
	// 获取门店语音详情
	getDeviceList: (params)=>{
		return qxRequest.Get("/device", params)
	},
	// 修改语音文本
	setVoiceText: (params)=>{
		return qxRequest.Post("/device/voicetext/set", params)
	},
	// 查询告警事件
	getEventList: (params)=>{
		return qxRequest.Get("/event", params)
	},
	// 打卡记录
	getRecognitionList: (params)=>{
		return qxRequest.Get("/person/recognition", params)
	},
	// 获取店铺详情
	getStoreDetail: (params)=>{
		return qxRequest.Get("/store", params)
	},
	// 设置门店时间信息
	setStoreTime: (params)=>{
		return qxRequest.Post("/store/extension/save", params)
	},
	// 透传命令
	// 获取声光报警
	getSoundLightAlarm: (params)=>{
		let puid = params.puid
		let xml = `<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Lang="zh_CN" Type="G" EPID="system"><Res Type="ST" Idx="0" OptID="F_ST_EnableSoundLightAlarm" /></C></M>`
		let params1 = { xml,puid }
		return qxRequest.Post("/q2http/send/xml", params1)
	},
	// 配置声光报警
	setSoundLightAlarm:  (params)=>{
		let value = params.value
		let puid = params.puid
		let xml = `<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Lang="en" Type="S"><Res Type="ST" Idx="0" OptID="F_ST_EnableSoundLightAlarm"><Param Value="${value}" /></Res></C></M>` 
		let params1 = { xml,puid }
		return qxRequest.Post("/q2http/send/xml", params1)
	},
	// 关闭一次报警
	closeSoundLightAlarm: (params)=>{
		let puid = params.puid
		let xml = `<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C"><Res Type="ST" Idx="0" OptID="C_ST_StopSoundLightAlarm"><Param/></Res></C></M>` 
		let params1 = { xml,puid }
		return qxRequest.Post("/q2http/send/xml", params1)
	},
	// 设置布防时间
	setAlarmTime: (params)=>{
		let puid = params.puid
		let beginTime = params.beginTime
		let endTime = params.endTime
		let xml = `<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="system"><Res Type="ST" Idx="0" OptID="C_ST_GuardSchedule"><Param Mode="Everyday"><Everyday><Time Begin="${beginTime}" End="${endTime}" /></Everyday></Param></Res></C></M>` 
		let params1 = { xml,puid }
		return qxRequest.Post("/q2http/send/xml", params1)
	},
	// 告警事件等级
	getEventLevel: (params)=>{
		return qxRequest.Get("/event/config", params)
	},
}

module.exports = qxAPI;