// 导入验证规则的包
const joi = require('joi')

const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
const avatar = joi.string().dataUri().required()

exports.update_userinfo_schema = {
	body: {
		id,
		nickname,
		email,
	},
}

exports.update_avatar_schema = {
	body: {
		avatar,
	},
}
