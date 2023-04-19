// 登录后的获取的基本数据处理
// 1.领导账号下属的专管员
// 2.领导，专管员，店主下属的区域店铺
// 3.
import qxAPI from "../api/index.js"
import { setLocalStorage, getLocalStorage } from "./help.js"

// 区域树，门店树，门店数组,领导下属专管员列表，所有专管员列表
const setBaseData = async()=> {
	let query = {
		treetype: 1
	}
	const data = await qxAPI.getDeviceTree(query)
	const districtMap = {}
	const storeMap = {}
	const storeList = []
	data.rows.forEach(item=>{
		districtMap[item.index] = item.name
		item.children.forEach(store=>{
			storeMap[store.index] = store.name
			storeList.push({
				name: store.name,
				storeId: store.index,
				districtId: item.index
			})
		})
	})
	setLocalStorage("districtMap",districtMap)
	setLocalStorage("storeMap",storeMap)
	setLocalStorage("storeList",storeList)
	
	let query2 = {
		page: 1,
		rows: 999999
	}
	const userList = await qxAPI.getUserList(query2)
	let staffList = []
	let staffAllList = userList.rows
	setLocalStorage("staffAllList",staffAllList)
	let managerIndexStr = getLocalStorage('loginData').userData.manager_user_indexs;
	if(managerIndexStr) {
		const managerIndexArr = managerIndexStr.split(',')
		managerIndexArr.forEach((item) => {
			userList.rows.forEach(subItem => {
				if (subItem.index == item) {
					staffList.push({
						"value": subItem.index,
						"name": subItem.name
					})
				}
			})
		})
		console.log(staffList);
		setLocalStorage("staffList",staffList)
	}	
}
		
// 员工列表
const getStaffList = async()=> {
	let staffList = []
	let loginData = getLocalStorage('loginData');
	const manager_user_indexs = loginData.userData.manager_user_indexs.split(',')
	let query = {
		page: 1,
		rows: 999999
	}
	const data = await qxAPI.getUserList(query)
	manager_user_indexs.forEach((item) => {
		data.rows.forEach(subItem => {
			if (subItem.index == item) {
				staffList.push({
					"value": subItem.index,
					"name": subItem.name
				})
			}
		})
	})
	setLocalStorage("staffList", staffList)
	return staffList
}
// 员工树
const getStaffListMap = ()=>{
	const staffList = getLocalStorage("staffList")
	let staffListMap = {}
	if(staffList) {
		for(const item of staffList) {
			staffListMap[item.value] = item.name	
		}
	}
	setLocalStorage("staffListMap", staffListMap)
	return staffListMap
}

export { setBaseData, getStaffList, getStaffListMap }