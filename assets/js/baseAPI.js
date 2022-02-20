// options 就是调用ajax时传递的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起ajax请求之前，统一拼接路径
    options.url = 'http://127.0.0.1:3007' + options.url
})