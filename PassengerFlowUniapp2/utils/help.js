// base64转blob
const base64ToBlob = (base64Data)=> {
	let arr = base64Data.split(','),
		fileType = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		l = bstr.length,
		u8Arr = new Uint8Array(l);
		
	while (l--) {
		u8Arr[l] = bstr.charCodeAt(l);
	}
	return new Blob([u8Arr], {
		type: fileType
	});
};

// blob转file
const blobToFile = (newBlob, fileName)=> {
	newBlob.lastModifiedDate = new Date();
	newBlob.name = fileName;
	return newBlob;
};

// 存储本地信息
const setLocalStorage = (key, value)=> {
	if (typeof value == 'object') {
		value = JSON.stringify(value)
	  }
	uni.setStorageSync(key,  value)
}

// 查询本地信息
const getLocalStorage = (key)=> {
  let value = uni.getStorageSync(key)
  let value2 = value
  try {
    value2 = JSON.parse(value)
  } catch(err) {
    value2 = value
  }
  return value2
}

// 防抖
// const debounce = (fn,delay)=>{
//   let timerId = null
//   return function(){
//     const context = this
//     const args = arguments
//     if(timerId){window.clearTimeout(timerId)}  
//     timerId = setTimeout(()=>{
//       fn.apply(context,args)
//       timerId = null
//     },delay)
//   }
// }

// 防抖
const debounce = (func, wait, immediate = true) =>{
  let timeout
  return function () {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(this, arguments)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}
 
// 节流
const throttle = (fn,delay)=>{
  let canUse = true
  return function() {
    const _this = this
    const args = arguments
    if(canUse){
      fn.apply(_this,args)
      canUse = false
      setTimeout(()=>{
        canUse = true
      },delay)
    }
  }
}

export { setLocalStorage, getLocalStorage, debounce, throttle }