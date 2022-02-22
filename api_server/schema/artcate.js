const joi = require('joi')

// 定义 分类名称 和 分类别名 的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// 定义 分类Id 的验证规则
const id = joi.number().integer().min(1).required()

exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

exports.delete_cate_schema = {
    params: {
        id
    }
}

// 根据 Id 获取文章分类
exports.get_cate_schema = {
    params: {
        id
    }
}

// 根据 Id 更新文章分类
exports.update_cate_schema = {
    body: {
        Id: id,
        name,
        alias
    }
}