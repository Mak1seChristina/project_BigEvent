// options 就是调用ajax时传递的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起ajax请求之前，统一拼接路径
    options.url = 'http://127.0.0.1:3007' + options.url

    // 统一为有权限的接口设置 header
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 在complete回调函数中判断是否有token
    options.complete = function(res){
        // res.responseJSON
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败'){
            // 1. 强制清空 token
            localStorage.removeItem('token')
            // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})