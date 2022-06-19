const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入解析 formdata
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建multer的实例对象，通过dest属性指定文件存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证规则中间件
const expressJoi = require('@escook/express-joi')
// 导入发布文章的验证规则
const add_article_schema = require('../schema/article')

const article_handler = require('../router_handler/article')

router.post(
	'/add',
	upload.single('cover_img'),
	expressJoi(add_article_schema),
	article_handler.addArticle
)

module.exports = router
