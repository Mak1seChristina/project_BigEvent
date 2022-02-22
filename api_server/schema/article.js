const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布','草稿').required()

// 定义 页码值、每页显示多少条数据、文章分类Id、文章状态 的验证规则
const pagenum = joi.number().integer().required()
const pagesize = joi.number().integer().required()
const cate_id2 = joi.string()
const state2 = joi.string().valid('已发布','草稿')

// 定义文章 Id 的验证规则
const id = joi.number().integer().min(1).required()

// 发布文章验证规则对象
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

// 获取文章列表的验证规则对象
exports.get_article_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: cate_id2,
        state: state2
    }
}

// 根据 Id 删除文章分类的验证对象
exports.del_article_id_schema = {
    params: {
        id
    }
}

// 根据 Id 获取文章的验证对象
exports.get_article_id_schema = {
    params: {
        id
    }
}

// 根据 Id 更新文章的验证对象
exports.update_article_id_schema = {
    body: {
        Id: id,
        title,
        cate_id,
        content,
        state
    }
}