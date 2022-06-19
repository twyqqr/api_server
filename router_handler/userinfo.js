// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs模块
const bcrypt = require('bcryptjs')

// 获取用户信息的处理函数
exports.getUserInfo = (req, res) => {
	// 根据用户id，查询用户基本信息
	// 为了防止密码泄露，需要排除password
	const sql = 'select id, username, email, user_pic from ev_user where id =?'
	// 调用db.query()执行SQL语句
	db.query(sql, req.user.id, (err, results) => {
		// 执行失败
		if (err) return res.cc(err)
		// 执行成功，但查询结果可能为空
		if (results.length !== 1) return res.cc('获取用户信息失败')

		// 用户信息获取成功
		res.send({
			status: 0,
			message: '获取用户成功',
			data: results[0],
		})
	})
}

// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
	// 定义更新数据库的SQL语句
	const sql = 'update ev_user set ? where id=?'

	db.query(sql, [req.body, req.body.id], (err, results) => {
		// 执行失败
		if (err) return res.cc(err)
		// 执行成功，但影响行数不为1
		if (results.affectedRows !== 1) return res.cc('更新用户信息失败')
		// 成功
		res.cc('更新用户信息成功', 0)
	})
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
	const sql = `select * from ev_user where id=?`
	db.query(sql, req.user.id, (err, results) => {
		// 执行失败
		if (err) return res.cc(err)
		// 执行成功，但查询结果可能为空
		if (results.length !== 1) return res.cc('用户不存在')

		const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
		if (!compareResult) return res.cc('原密码错误')

		const sql = `update ev_user set password=? where id=?`
		// 对新密码加密
		const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

		db.query(sql, [newPwd, req.user.id], (err, results) => {
			// 执行失败
			if (err) return res.cc(err)
			// 执行成功，但影响行数不为1
			if (results.affectedRows !== 1) return res.cc('更新密码失败')

			// 更新密码成功
			res.cc('更新密码成功', 0)
		})
	})
}

// 更新用户头像的路由处理函数
exports.updateAvatar = (req, res) => {
	const sql = `select * from ev_user where id=?`

	db.query(sql, req.user.id, (err, results) => {
		// 执行失败
		if (err) return res.cc(err)
		// 执行成功，但查询结果可能为空
		if (results.length !== 1) return res.cc('用户不存在')

		const sql = 'update ev_user set user_pic=? where id=?'

		db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
			// 执行失败
			if (err) return res.cc(err)
			// 执行成功，但影响行数不为1
			if (results.affectedRows !== 1) return res.cc('更新用户头像失败')
			// 执行成功
			res.cc('更新用户头像成功', 0)
		})
	})
}
