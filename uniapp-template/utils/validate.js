import validator from 'validator';
let fullWidthAlphabetNumber_ = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
let fullWidthAlphabet = /^[\u4e00-\u9fa5a-zA-Z]+$/;
let chinese = /^[\u4e00-\u9fa5]+$/;
let name = /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z\.\s]{4,20})$/; // 暂不使用
let special = /[#']/;
let alphabetNumber_ = /^[_0-9a-zA-Z]+$/;
let alphabet = /^[a-zA-Z]+$/;
let number = /^[_0-9]+$/;
let floatNumber_2 = /^(0|([1-9]\d*))(\.[0-9]{1,2})?$/; // 保留小数点后两位
let idcardReg =
	/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
var qx_validator = {
	loginid: (rule, value, data, callback) => {
		// console.log('validate...');
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			// isFullWidth 全角字符 isAlpha only letters (a-zA-Z) isAlphanumeric only letters and numbers (a-zA-Z0-9).
			// console.debug(rule.errorMessage,rule.required);
			if (!validator.isEmail(value) && !validator.isMobilePhone(value) && !validator.isFullWidth(value) &&
				!validator.isAlphanumeric(value)) {
				callback(rule.errorMessage);
			} else {
				callback();
			}
		}
	},
	name: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}

		if (!validator.isFullWidth(value) && !validator.isAlpha(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	common_name: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (!fullWidthAlphabetNumber_.test(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	alphabetNumber_: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (!alphabetNumber_.test(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	name_: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (!fullWidthAlphabet.test(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	epid: (rule, value, data, callback) => {

		if (!validator.isAlpha(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}

	},
	captcha: (rule, value, data, callback) => {
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			if (!validator.isAlphanumeric(value)) {
				callback(rule.errorMessage);
			} else {
				callback();
			}
		}
	},
	isemail: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}

		if (!validator.isEmail(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}

		// if(value==''||value==undefined||value==null){
		//     callback();
		// }else{
		//     if (!validator.isEmail(value)){
		//         callback(rule.errorMessage);
		//     } else {
		//         callback();
		//     }
		// }
	},
	byteLength: (rule, value, data, callback) => {
		// console.log(value)
		// callback();
		value = value || "";
		if (validator.isByteLength(value, rule.min, rule.max)) {
			callback();
		} else {
			callback(rule.errorMessage);
		}
	},
	uint: (rule, value, data, callback) => {
		if (validator.isInt(value.toString()) && value >= 0) {
			callback();
		} else {
			callback(new Error());
		}
	},
	isIpv4Reg(rule, value, data, callback) {
		if (!value && !rule.required) {
			callback();
			return;
		}
		let regexp =
			/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;

		if (!validator.matches(value, regexp)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}

		return regexp.test(value);
	},
	isIpv6(rule, value, data, callback) {
		if (!value && !rule.required) {
			callback();
			return;
		}
		let regexp = /^[0-9a-fA-F]{0,}$/g;

		if (!validator.matches(value, regexp)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	isDomain(rule, value, data, callback) {
		if (!value && !rule.required) {
			callback();
			return;
		}
		let regexp = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/g;

		if (value != "localhost" && !validator.matches(value, regexp)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	isPort(rule, value, data, callback) {
		if (!value && !rule.required) {
			callback();
			return;
		}
		let regexp = /^[0-9]*$/;

		if (!validator.matches(value.toString(), regexp) || !(value > 0 && value < 65535)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	isMobile: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (validator.isMobilePhone(value.toString())) {
			callback();
		} else {
			callback(rule.errorMessage);
		}
		return;
	},
	isEmpty: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (validator.isEmpty(value.toString())) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
		return;
	},
	// 是否是中国大陆手机号
	isCNMobile: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (validator.isMobilePhone(value.toString(), 'zh-CN')) {
			callback();
		} else {
			callback(rule.errorMessage);
		}
		return;
	},
	remoteCheck(rule, value, data, callback) {
		if (typeof rule.options.remoteCheckFun == "function") {
			// console.log(153,rule.options.params, value);
			let params = Object.assign(rule.options.params || {}, {
				value: value
			});
			// console.log(153,params);      
			rule.options.remoteCheckFun(params, function(rv) {
				if (rv) {
					callback();
				} else {
					callback(rule.errorMessage);
				}
			});
		} else {
			callback();
		}
	},
	// 是否包含特殊字符
	hasSpecial: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (special.test(value)) {
			callback(rule.errorMessage);
		}
		callback();
	},
	// 是否是空数据
	isEmptyArray: (rule, value, data, callback) => {
		if (value.length == 0 && JSON.stringify(value) == '[]') {
			callback(rule.errorMessage);
		} else if (value.length > 0) {
			callback();
		}
		callback();
	},
	// 是否是身份证卡号
	isIdCard: (rule, value, data, callback) => {
		if (!value && !rule.required) {
			callback();
			return;
		}
		if (!idcardReg.test(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	// 远程校验改字段是否存在
	exists: (rule, value, data, callback) => {
		// console.debug('exists validate',rule.options);
		if (rule.options && rule.options.remoteCheckFun && rule.options.name && typeof rule.options
			.remoteCheckFun == "function") {
			let params = {
				name: rule.options.name,
				value: value,
				index: (rule.options.index || 0)
			};
			return new Promise((resolve, reject) => {
				rule.options.remoteCheckFun(params, function(rv) {
					// console.debug(286,rv)
					if (rv) {
						// 通过返回 resolve
						resolve();
					} else {
						// 不通过返回 reject(new Error('错误信息'))
						reject(rule.errorMessage);
					}
				});
			});

		} else {
			callback();
		}
	},
	chinese: (rule, value, data, callback) => {
		if (!chinese.test(value)) {
			callback(rule.errorMessage);
		} else {
			callback();
		}
	},
	employee: {
		name: {
			unit: (rule, value, data, callback) => {
				if (!fullWidthAlphabet.test(value)) {
					callback(rule.errorMessage);
				} else {
					callback();
				}
			},
			chinese: (rule, value, data, callback) => {
				if (!chinese.test(value)) {
					callback(rule.errorMessage);
				} else {
					callback();
				}
			},
			exists: (rule, value, data, callback) => {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: 'name',
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							//    console.log(rule.errorMessage)
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			}
		},
		jobnumber: (rule, value, data, callback) => {
			if (!value && !rule.required) {
				callback();
				return;
			}
			if (validator.isAlphanumeric(value.toString())) {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: 'jobnumber',
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			} else {
				callback(rule.errorMessage);
				return;
			}


			//    if(typeof rule.options.remoteCheckFun == "function"){
			//        let params = {
			//            name:'jobnumber',
			//            value:value,
			//            index:(rule.options.index || 0)
			//        }
			//        rule.options.remoteCheckFun(params,function(rv){
			//            if(rv){
			//                callback();
			//            }else{
			//                callback(rule.errorMessage);
			//            }
			//        });
			//    } else {
			//        callback();
			//    }
		},
		mobile: (rule, value, data, callback) => {
			if (!value && !rule.required) {
				callback();
				return;
			}
			if (validator.isMobilePhone(value.toString())) {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: 'mobile',
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			} else {
				callback(rule.errorMessage);
				return;
			}
		},
		email: (rule, value, data, callback) => {
			//    console.log(rule,value);
			if (!value && !rule.required) {
				callback();
				return;
			}
			if (validator.isEmail(value.toString())) {
				// console.log('value is valid');
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: 'email',
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			} else {
				// console.error('value is invalid');
				// return callback(new Error(qx_validator.notes.employee.email.failed)); //无效
				// return;
			}
		}
	},
	department: {
		name: (rule, value, data, callback) => {
			console.log(rule, value);
			// console.log(arguments);
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		}
	},
	departmentTitle: {
		name: (rule, value, data, callback) => {
			// console.log(rule, value);
			// console.log(arguments);
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = Object.assign({
					name: value
				}, rule.options.params);
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		}
	},
	workshift: {
		name: (rule, value, data, callback) => {
			console.log(rule, value);
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: "name",
					value: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		}
	},
	device: {
		deviceid: (rule, value, data, callback) => {
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: "deviceid",
					value: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		},
		wx_ip: {
			exists: (rule, value, data, callback) => {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: "ip",
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			},
			unit: (rule, value, data, callback) => {
				if (!rule.required && !value) {
					callback();
				}
				if (!alphabetNumber_.test(value)) {
					callback(rule.errorMessage);
				} else {
					callback();
				}
			}
		},
	},
	// 考勤规则
	workshiftRule: {
		sycle_schedule: {
			shifts: {
				isEmpty: (rule, value, data, callback) => {
					if (value.shifts.length == 0 && JSON.stringify(value.shifts) == '[]') {
						callback(rule.errorMessage);
					} else if (value.shifts.length > 0) {
						callback();
					}
					callback();
				}
			},
			workdays: {
				isEmpty: (rule, value, data, callback) => {
					if (value.workdays.length == 0 && JSON.stringify(value.workdays) == '[]') {
						callback(rule.errorMessage);
					} else if (value.workdays.length > 0) {
						callback();
					}
					callback();
				}
			}
		}
	},
	// 假期类型
	vacationType: {
		type: {
			exists: (rule, value, data, callback) => {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: "type",
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			},
			unit: (rule, value, data, callback) => {
				if (!rule.required && !value) {
					callback();
				}
				if (!alphabet.test(value)) {
					callback(rule.errorMessage);
				} else {
					callback();
				}
			}
		},
		name: {
			exists: (rule, value, data, callback) => {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: "name",
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			},
		},
		issuerule: {
			timespanHours: {
				empty: (rule, value, data, callback) => {
					// console.log('empty',value.timespanHours,rule);
					if (validator.isEmpty(value.timespanHours.toString())) {
						callback(rule.errorMessage);
					} else {
						callback();
					}
					return;
				},
				unit: (rule, value, data, callback) => {
					// console.log('unit',value.timespanHours);
					if (!floatNumber_2.test(value.timespanHours)) {
						callback(rule.errorMessage);
					} else {
						callback();
					}
				},
				// 大于0 小于等于120
				range: (rule, value, data, callback) => {
					// console.log('range',value.timespanHours);
					if (value.timespanHours <= 0 || value.timespanHours > 120) {
						callback(rule.errorMessage);
					} else {
						callback();
					}
				},
			}
		},
		expirerule: {
			months: {
				empty: (rule, value, data, callback) => {
					// console.log('empty',value.months,rule);
					if (validator.isEmpty(value.months.toString())) {
						callback(rule.errorMessage);
					} else {
						callback();
					}
					return;
				},
				range: (rule, value, data, callback) => {
					console.log('range', value.months);
					if (value.months <= 0 || value.months > 12) {
						callback(rule.errorMessage);
					} else {
						callback();
					}
				},
			},
			delay: {
				empty: (rule, value, data, callback) => {
					// console.log('empty',value.months,rule);
					if (validator.isEmpty(value.delay.toString())) {
						callback(rule.errorMessage);
					} else {
						callback();
					}
					return;
				},
				range_days: (rule, value, data, callback) => {
					// console.log('range',value.months);
					if (value.delayUnit == 'days') {
						if (value.delay <= 0 || value.delay > 800) {
							callback(rule.errorMessage);
						}
					} else {
						callback();
					}
				},
				range_months: (rule, value, data, callback) => {
					// console.log('range',value.months);
					if (value.delayUnit == 'months') {
						if (value.delay <= 0 || value.delay > 24) {
							callback(rule.errorMessage);
						}
					} else {
						callback();
					}
				},
			}
		}
	},
	visitor: {
		mobile: (rule, value, data, callback) => {
			// console.log('remoteCheckFun');
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: 'mobile',
					value: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		},
		id_card: (rule, value, data, callback) => {
			if (!value && !rule.required) {
				callback();
				return;
			}
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: 'id_card',
					value: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		},
	},
	meeting: {
		meeting_name: (rule, value, data, callback) => {
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: 'name',
					value: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		},
		capacity_amount: (rule, value, data, callback) => {
			if (value < 1) {
				callback(rule.errorMessage);
			} else {
				callback();
			}
		},
	},
	socUser: {
		name: (rule, value, data, callback) => {
			if (typeof rule.options.remoteCheckFun == "function") {
				let params = {
					name: 'name',
					value: value,
					index: (rule.options.index || 0)
				}
				rule.options.remoteCheckFun(params, function(rv) {
					if (rv) {
						callback();
					} else {
						callback(rule.errorMessage);
					}
				});
			} else {
				callback();
			}
		},
		mobile: (rule, value, data, callback) => {
			// console.log('socUser mobile rule',rule);
			if (!value && !rule.required) {
				callback();
				return;
			}
			if (validator.isMobilePhone(value.toString())) {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: 'mobile',
						value: value,
						index: (rule.options.index || 0)
					}
					// 发请求 user/check接口 params.index 编辑时,对已有数据编辑
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			} else {
				callback(rule.errorMessage);
				return;
			}
		},
		email: (rule, value, data, callback) => {
			//    console.log(rule,value);
			if (!value && !rule.required) {
				callback();
				return;
			}
			if (validator.isEmail(value.toString())) {
				if (typeof rule.options.remoteCheckFun == "function") {
					let params = {
						name: 'email',
						value: value,
						index: (rule.options.index || 0)
					}
					rule.options.remoteCheckFun(params, function(rv) {
						if (rv) {
							callback();
						} else {
							callback(rule.errorMessage);
						}
					});
				} else {
					callback();
				}
			} else {
				callback(rule.errorMessage);
				return;
			}
		}
	},
};

export default qx_validator
