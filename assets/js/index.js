$(function(){
    // 调用 获取用户基本信息
    getUserInfo()

    const layer = layui.layer

    // 退出按钮
    $("#btnLogout").on("click", function(){
        // 提示用户是否确认退出登录
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            // 1. 清空token
            localStorage.removeItem('token')
            // 2. 跳转到登录页面
            location.href = '/login.html'
            
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res){
            if(res.status !== 0) return layer.msg('获取用户信息失败！')
            // 调用函数来渲染用户的头像
            renderAvatar(res.data)
        },
    })
}

// 渲染用户的头像
function renderAvatar(data) {
    // 获取用户名称
    var name = data.nickname || data.username
    // 设置欢迎的文本
    $("#welcome").html(`欢迎&nbsp;&nbsp;${name}`)
    // 如果有头像则显示头像，如果没有显示文本头像
    // 渲染图片头像
    if(data.user_pic){
        $(".layui-nav-img").attr('src',data.user_pic).show()
        $(".text-avatar").hide()
    }
    // 渲染文本头像
    else{
        $(".layui-nav-img").attr('src',data.user_pic).hide()
        var first_letter = name[0].toUpperCase()
        $(".text-avatar").html(first_letter).show()
    }
}