// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类路由处理函数
exports.getArticleCates = (req, res) => {
	// 根据分类章台，获取所有未被删除的分类列表数据
	const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'

	db.query(sql, (err, results) => {
		// 执行SQL语句成功
		if (err) return res.cc(err)

		// 执行SQL语句成功
		res.send({
			status: 0,
			message: '获取文章分类列表成功！',
			data: results,
		})
	})
}

// 新增文章分类路由处理函数
exports.addArticleCates = (req, res) => {
	// 定义查询 分类名称 与 分类别名 是否被占用的SQL语句
	const sql = `select * from ev_article_cate where name=? or alias=?`
	db.query(sql, [req.body.name, req.body.alias], (err, results) => {
		// 执行失败
		if (err) return res.cc(err)
		// 执行成功，但查询结果不为0
		if (results.length === 2) return res.cc('分类名称与分类别名被占用')
		if (
			results.length === 1 &&
			results[0].name == req.body.name &&
			results[0].alias == req.body.alias
		)
			return res.cc('分类名称与分类别名被占用')
		if (results.length === 1 && results[0].name == req.body.name) return res.cc('分类名称被占用')
		if (results.length === 1 && results[0].alias == req.body.alias) return res.cc('分类名称被占用')

		const sql = `insert into ev_article_cate set ?`

		db.query(sql, req.body, (err, results) => {
			// 执行失败
			if (err) return res.cc(err)
			//执行成功但影响行数不为1
			if (results.affectedRows !== 1) return res.cc('新增文章分类失败')
			// 新增文章分类成功
			res.cc('新增文章分类成功', 0)
		})
	})
}

// 删除文章分类路由的处理函数
exports.deleteCatesById = (req, res) => {
	const sql = 'update ev_article_cate set is_delete=1 where id=?'
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err)
		if (results.affectedRows !== 1) return res.cc('删除失败')
		res.cc('删除文章分类成功', 0)
	})
}

// 根据id获取文章分类路由处理函数
exports.getCatesById = (req, res) => {
	const sql = 'select * from ev_article_cate where id=?'
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err)
		if (results.length !== 1) return res.cc('文章分类不存在')
		res.cc({
			status: 0,
			message: '获取文章分类成功',
			data: results[0],
		})
	})
}

// 根据id更新文章分类路由处理函数
exports.updateCatesById = (req, res) => {
	const sql = 'select * from ev_article_cate where id <>? and (name=? or alias=?)'
	db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
		if (err) return res.cc(err)
		if (results.length === 2) return res.cc('分类名称与分类别名被占用')
		if (
			results.length === 1 &&
			results[0].name === req.body.name &&
			results[0].alias === req.body.alias
		)
			return res.cc('分类名称与分类别名被占用')
		if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用')
		if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类名称被占用')
		const sql = 'update ev_article_cate set? where id=?'
		db.query(sql, [req.body, req.body.id], (err, results) => {
			if (err) return res.cc(err)
			if (results.affectedRows !== 1) return res.cc('更新文章分类失败')
			res.cc('更新文章分类成功', 0)
		})
	})
}
