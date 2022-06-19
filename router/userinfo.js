const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入验证规则中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证规则对象
const { update_userinfo_schema, update_avatar_schema } = require('../schema/userinfo')
const { update_password_schema } = require('../schema/user')

// 挂载路由

// 导入路由处理模块
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置密码路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

// 更新头像路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
module.exports = router
