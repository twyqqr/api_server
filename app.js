// 导入express模块
const express = require('express')
// 创建express的服务器实例
const app = express()

const joi = require('joi')

// 导入cors模块
const cors = require('cors')
// 见cors注册为全局中间件
app.use(cors())
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 在路由之前封装res.cc函数
app.use((req, res, next) => {
	// status默认值为1，表示失败的情况
	// err的值，可能是一个错误对象，也可能是一个错误的描述字符
	res.cc = function (err, status = 1) {
		res.send({
			status,
			message: err instanceof Error ? err.message : err,
		})
	}
	next()
})

// 在路由之前配置解析Token中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// const e = require('express')
// const { jwtSecretKey } = require('./config')

// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入并使用文章分类的路由模块
const artcateRouter = require('./router/artcate')
app.use('/my/artcate', artcateRouter)

// 导入并使用管理文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 定义错误级别的中间件
app.use((err, req, res, next) => {
	// 验证失败的错误
	if (err instanceof joi.ValidationError) return res.cc(err)
	// 身份证失败后的错误
	if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
	// 未知的错误
	res.cc(err)
})

// 调用app.listen方法，制定端口号并启动web服务器
app.listen(3007, () => {
	console.log('api sever running at http://127.0.0.1:3007')
})
