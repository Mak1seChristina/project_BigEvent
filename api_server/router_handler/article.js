// 导入处理路径的模块
const res = require('express/lib/response')
const path = require('path')

// 导入处理数据库的模块
const db = require('../db/index')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传文章封面
    if(!req.file || req.file.fieldname !== 'cover_img')  return res.cc('请上传文章封面！')

    // 上传至数据库的文章信息
    const articleInfo = {
        // 文章标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放地址
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id
    }
    
    // 定义发布文章的 sql 语句
    const sql = 'insert into ev_articles set ?'

    // 调用 sql 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 影响行数不为1
        if(results.affectedRows !== 1) return res.cc('发布文章失败！')
        // 成功
        res.cc('发布文章成功', 0)
    })
}

// 获取文章列表的处理函数
exports.getArticle = (req, res) => {
    // 统计数据总数
    var total = null

    const sqlTotal = 'select count(*) as total from ev_articles where author_id = ? and is_delete = 0'
    db.query(sqlTotal, req.user.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('获取数据总数失败！')
        total = results[0].total

        // 页码值
        var pagenum = req.query.pagenum
        // 每页显示多少条数据
        var pagesize = req.query.pagesize
        // 每页数据的起始值
        var startNum = pagesize * (pagenum - 1)

        const sqlCommon = 'select a.Id, a.title, a.pub_date, a.state, b.name from my_db_01.ev_articles a left join my_db_01.ev_article_cate b on a.cate_id = b.Id where a.is_delete = 0 and a.author_id = ?'

        // 定义获取文章列表的 sql 语句
        if(req.query.cate_id && req.query.state){
            const sql = sqlCommon + ` and a.cate_id = ? and a.state = ? limit ?, ?`
            sqlQuery(sql, [req.user.id, req.query.cate_id, req.query.state, startNum, pagesize])
        }
        else if(req.query.cate_id){
            const sql = sqlCommon + ` and a.cate_id = ? limit ?, ?`
            sqlQuery(sql, [req.user.id, req.query.cate_id, startNum, pagesize])
        }
        else if(req.query.state){
            const sql = sqlCommon + ` and a.state = ? limit ?, ?`
            sqlQuery(sql, [req.user.id, req.query.state, startNum, pagesize])
        }
        else{
            const sql = sqlCommon + ` limit ?, ?`
            sqlQuery(sql, [req.user.id, startNum, pagesize])
        }
    })

    

    // 执行 sql 语句
    function sqlQuery(sql, data){
        db.query(sql, data, (err, results) => {
            // 执行 sql 语句失败
            if(err) return res.cc(err)
            // 成功
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: results,
                total: total
            })
        })
    }

}

// 根据 Id 删除文章的处理函数
exports.delArticleById = (req, res) => {
    // 定义删除文章的 sql 语句
    const sql = 'update ev_articles set is_delete = 1 where author_id = ? and Id = ?'
    // 执行 sql 语句
    db.query(sql, [req.user.id, req.params.id], (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 影响行数不为1
        if(results.affectedRows !== 1) return res.cc('删除文章失败！')
        // 成功
        res.cc('删除文章成功！', 0)
    })
}

// 根据 Id 获取文章的处理函数
exports.getArticleById = (req, res) => {
    // 定义获取文章的 sql 语句
    const sql = 'select * from ev_articles where author_id = ? and Id = ?'
    // 执行 sql 语句
    db.query(sql, [req.user.id, req.params.id], (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 查询失败
        if(results.length !== 1) return res.cc('获取文章失败！')
        // 成功
        res.send({
            status: 0,
            message: '获取文章成功！',
            data: results[0]
        })
    })
}

// 根据 Id 更新文章的处理函数
exports.updateArticleById = (req, res) => {
    // 手动判断是否上传封面
    if(!req.file || req.file.fieldname !== 'cover_img') return res.cc('请上传文章封面！')

    // 更新的文章信息
    var {Id, ...others} = req.body
    const articleInfo = {
        // 文章标题、所属分类Id、内容、状态
        ...others,
        // 文章封面在服务器端的存放地址
        cover_img: path.join('/uploads', req.file.filename),
    }

    // 定义更新文章信息的 sql 语句
    const sql = 'update ev_articles set ? where Id = ? and author_id = ? and is_delete <> 1'
    // 执行 sql 语句
    db.query(sql, [articleInfo, req.body.Id, req.user.id], (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 影响行数不为1
        if(results.affectedRows !== 1) return res.cc('更新文章失败！')
        // 成功
        res.cc('更新文章成功！', 0)
    })
}