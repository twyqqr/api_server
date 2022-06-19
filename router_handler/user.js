// 导入bcryptjs模块
const bcrypt = require('bcryptjs')

// 导入数据库操作模块
const db = require('../db/index')

// 导入生产的Token包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
	// 接受表单数据
	const userinfo = req.body
	// 判断数据是否合法
	// if (!userinfo.username || !userinfo.password) {
	// 	// return res.send({ status: 1, message: '用户名或密码不能为空' })
	// 	return res.cc('用户名或密码不能为空')
	// }

	const sqlStr = 'select * from ev_user where username=?'
	// 判断用户名是否被占用
	db.query(sqlStr, userinfo.username, (err, results) => {
		// 执行sql语句失败
		if (err) {
			// return res.send({ status: 1, message: err.message })
			return res.cc(err)
		}
		// 用户名被占用
		if (results.length > 0) {
			// return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' })
			return res.cc('用户名被占用，请更换其他用户名')
		}
		// 调用bcrypt.hashSync对密码进行加密
		userinfo.password = bcrypt.hashSync(userinfo.password, 10)
		// 定义插入新用户的sql语句
		const sql = 'insert into ev_user set ?'
		// 执行
		db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
			// 判断是否成功
			if (err)
				// return res.send({ status: 1, message: err.message })
				return res.cc(err)
			// 判断影响行数是否为1
			if (results.affectedRows !== 1)
				// return res.send({ status: 1, message: '用户注册失败，请稍后再试' })
				return res.cc('用户注册失败，请稍后再试')
			// 注册成功
			// res.send({ status: 0, message: '注册成功' })
			res.cc('注册成功', 0)
		})
	})
}

// 登录的处理函数
exports.login = (req, res) => {
	// 接受表单数据
	const userinfo = req.body
	// 定义查询语句
	const sql = 'select * from ev_user where username=?'
	// 执行sql语句
	db.query(sql, userinfo.username, (err, results) => {
		// 执行sql语句失败
		if (err) return res.cc(err)
		// 执行sql语句成功，但是获取到的数据条数不等于1
		if (results.length !== 1) return res.cc('登录失败')

		// 判断密码是否正确
		const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
		// 如果比对结果为FALSE，则密码错误
		if (!compareResult) return res.cc('密码错误')

		// 登陆成功，生成Token字符串
		const user = { ...results[0], password: '', user_pic: '' }
		// 对用户信息进行加密，生成Token字符串
		const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
		// 调用res，send() 将Token响应給客户端
		res.send({
			status: 0,
			message: '登陆成功',
			token: 'Bearer ' + tokenStr,
		})
	})
}
