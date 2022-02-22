// 导入数据库操作模块
const db = require('../db/index')


// 获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
    // 定义获取文章分类列表的 sql 语句
    const sql = 'select * from ev_article_cate where is_delete = 0'
    // 执行 sql 语句
    db.query(sql, (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)

        // 执行 sql 语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义 分类名称 和 分类别名 是否被占用的 sql 语句
    const sql = 'select * from ev_article_cate where name = ? or alias = ?'
    // 执行 sql 语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)

        // 分类名称 和 分类别名都被占用
        if(results.length === 2) return res.cc('分类名称和分类别名都被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称和分类别名都被占用，请更换后重试！')
        // 分类名称被占用
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        // 分类别名被占用
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 分类名称 和 分类别名 均未被占用，可以执行新增操作
        // 定义新增文章分类的 sql 语句
        const sql = 'insert into ev_article_cate set ?'
        // 执行 sql 语句
        db.query(sql, req.body, (err, results) => {
            // 执行 sql 语句失败
            if(err) return res.cc(err)
            // 影响行数不等于1
            if(results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            // 成功
            res.cc('新增文章分类成功！', 0)
        })
    })
}

// 根据 Id 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 定义删除文章分类的 sql 语句
    const sql = 'update ev_article_cate set is_delete = 1 where Id = ?'
    // 执行 sql 语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 影响行数不为1
        if(results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        // 成功
        res.cc('删除文章分类成功！', 0)
    })
}

// 根据 Id 获取文章分类数据
exports.getArtCateById = (req, res) => {
    // 定义获取文章分类的 sql 语句
    const sql = 'select * from ev_article_cate where Id = ?'
    // 执行 sql 语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 未查询到数据
        if(results.length !== 1) return res.cc('获取文章分类数据失败！')
        // 成功
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        })
    })
}

// 根据 Id 更新文章分类数据的处理函数
exports.updateCateById = (req, res) => {
    // 定义 分类名称 和 分类别名 是否被占用的 sql 语句
    const sql = 'select * from ev_article_cate where Id <> ? and ( name = ? or alias = ? )'
    // 执行 sql 语句
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)

        // 分类名称 和 分类别名都被占用
        if(results.length === 2) return res.cc('分类名称和分类别名均被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称和分类别名均被占用，请更换后重试！')
        // 分类名称被占用
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        // 分类别名被占用
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 分类名称 和 分类别名 均未被占用，可执行更新操作
        // 定义更新文章分类的 sql 语句
        const sql = 'update ev_article_cate set ? where Id = ?' 
        // 执行 sql 语句
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行 sql 语句失败
            if(err) return res.cc(err)
            // 影响行数不为1
            if(results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            // 成功
            res.cc('更新文章分类成功！', 0)
        })
    })
}