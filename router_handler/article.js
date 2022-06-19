// 导入数据库操作模块
const db = require('../db/index')

// 导入处理路径的 path 核心模块
const path = require('path')

exports.addArticle = (req, res) => {
	if (!req.file || req.file.filename !== 'cover_img') return res.cc('文章封面是必选参数')

	const articleInfo = {
		...body,
		cover_img: path('/path', req.file.filename),
		pub_date: new Date(),
		author_id: req.user.author_id,
	}

	const sql = 'insert into ev_articles set ?'
	db.query(sql, req.body, (err, results) => {
		if (err) return res.cc(err)
		if (results.affectRows !== 1) return res.cc('发布文章失败')
		res.cc('发布文章成功', 0)
	})
}
