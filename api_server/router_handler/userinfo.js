// 导入数据库操作模块
const db = require('../db/index')

// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的 sql 语句
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id = ?'
    // 执行 sql 语句
    // req.user 是express-jwt帮我们挂载到req上面的
    db.query(sql, req.user.id, (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 执行语句成功，但是查询结果可能为空
        if(results.length !== 1) return res.cc('获取用户信息失败')
        // 获取用户信息成功
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 定义待执行的 sql 语句
    const sql = 'update ev_users set ? where id = ?'
    // 执行 sql 语句
    db.query(sql, [req.body, req.user.id], (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 执行 sql 语句成功，但是影响行数不等于1
        if(results.affectedRows !== 1) return res.cc('更新用户基本信息失败！')
        res.cc('更新用户信息成功！', 0)
    })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 根据 id 查询用户的信息
    const sql = 'select * from ev_users where id = ?'
    // 执行 sql 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 执行成功，但是可能数据不存在
        if(results.length !== 1) return res.cc('用户不存在！')

        // 判断用户输入的旧密码是否正确
        const compareresult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if(!compareresult) return res.cc('旧密码错误！')

        // 更新数据库中的密码
        const sqlStr = 'update ev_users set password = ? where id = ?'
        // 对新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行 sql 语句
        db.query(sqlStr, [newPwd, results[0].id], (err, results) => {
            // 执行sql语句失败
            if(err) return res.cc(err)
            // 判断影响行数
            if(results.affectedRows !== 1) return res.cc('重置密码失败！')
            // 成功
            res.cc('重置密码成功', 0)
        })
        
    })
}

// 更换用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义更新头像的 sql 语句
    const sql = 'update ev_users set user_pic = ? where id = ?'
    // 执行 sql 语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行失败
        if(err) return res.cc(err)
        // 影响行数
        if(results.affectedRows !== 1) return res.cc('更换头像失败！')
        // 成功
        res.cc('更换头像成功！', 0)
    })
}