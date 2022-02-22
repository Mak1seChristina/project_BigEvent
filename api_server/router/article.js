const express = require('express')

const router = express.Router()

// 导入解析 formdata 表单数据的包
const multer = require('multer')
// 导入处理路径的模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const {add_article_schema, get_article_schema, del_article_id_schema, get_article_id_schema, update_article_id_schema} = require('../schema/article')

// 导入文章管理的处理函数模块
const article_handler = require('../router_handler/article')

// 发布新文章的路由
router.post('/add' , upload.single('cover_img') , expressJoi(add_article_schema) , article_handler.addArticle)

// 获取文章列表的路由
router.get('/list', expressJoi(get_article_schema) , article_handler.getArticle)

// 根据 Id 删除文章的路由
router.get('/delete/:id', expressJoi(del_article_id_schema) , article_handler.delArticleById)

// 根据 Id 获取文章详情的路由
router.get('/:id', expressJoi(get_article_id_schema) , article_handler.getArticleById)

// 根据 Id 更新文章信息的路由
router.post('/edit' , upload.single('cover_img'), expressJoi(update_article_id_schema) , article_handler.updateArticleById)

module.exports = router