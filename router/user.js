const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入验证规则中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const { reg_login_schema } = require('../schema/user')

// 导入用户路由处理函数模块
const user_handler = require('../router_handler/user')

// 注册新对象
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

module.exports = router
