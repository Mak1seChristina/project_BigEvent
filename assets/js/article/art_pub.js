$(function(){
    const layer = layui.layer
    const form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0) return layer.msg('初始化文章分类失败！')
                // 渲染分类
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
     
    // 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择文件
    $("#btnChooseImage").on("click", function(){
        $("#coverfile").click()
    })

    // 监听 coverfile 的 change 事件， 获取用户选择的封面
    $("#coverfile").on("change", function(e){
        // 获取文件列表
        var files = e.target.files
        // 判断是否选择了图片
        if(files.length === 0) return 

        // 创建图片 url 地址
        var file = files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 状态默认为 已发布，点击 草稿 按钮，将状态更改为 草稿
    $("#btnSave").on("click", function(){
        art_state = '草稿'
    })

    // 表单提交事件
    $("#form-pub").on("submit", function(e){
        e.preventDefault()
        // 创建一个 formData 对象
        var formData = new FormData($(this)[0])
        
        // 将文章状态存进 formData 中
        formData.append('state', art_state)

        // formData.forEach(function(v, k){
        //     console.log(k, v);
        // })

        // 将封面输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       
                // 将 Canvas 画布上的内容，转化为文件对象
                // blob 就是文件对象，将文件对象存储到 formData 中
                formData.append('cover_img', blob)

                // formData.forEach(function(v, k){
                //     console.log(k, v);
                // })

                publishArticle(formData)

            })
        
        // 定义一个发布文章的方法
        function publishArticle(formData){
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: formData,
                contentType: false,
                processData: false,
                success: function(res){
                    if(res.status !== 0) return console.log(res.message);
                    layer.msg('发布文章成功！', 0)
                    // 发布文章成功后跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        }
        
    })
})