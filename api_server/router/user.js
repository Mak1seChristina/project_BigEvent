const express = require('express')

const router = express.Router()

// 导入用户处理函数对应的模块
const user_handler = require('../router_handler/user')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
// 解构赋值，我们只需要得到模块对象的 reg_login_schema 这个属性
const {reg_login_schema} = require('../schema/user')

// 1. 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

// 2. 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)


module.exports = router