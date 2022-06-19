const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入验证规则中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const {
	add_cate_schema,
	delete_cate_schema,
	get_cate_schema,
	update_cate_schema,
} = require('../schema/artcate')

// 导入文章分类路由处理函数模块
const artcate_handler = require('../router_handler/artcate')

// 获取文章分类
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)

// 删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCatesById)

// 根据id获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getCatesById)

// 根据id更新文章分类数据的路由
router.get('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCatesById)

module.exports = router
