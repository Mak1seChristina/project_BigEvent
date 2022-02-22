$(function() {
    const layer = layui.layer
    const form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0) return layer.msg('加载数据失败！');
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
            }
        })
    }

    var index;
    // 添加类别按钮
    $("#btnAddCate").on("click", function(){
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })

    // 添加文章分类请求
    $('body').on("submit", "#form-add", function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) return layer.msg('添加文章分类失败！');
                layer.msg('添加文章分类成功！')
                initArtCateList()
                // 根据index关闭弹出层
                layer.close(index)
            }
        })
    })

    var indexEdit;
    // 编辑按钮
    $("body").on("click", ".btn-edit", function(){
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        })

        var id = $(this).attr("data-Id");
        // 发请求获取对应数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res){
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改文章分类
    $("body").on("submit", "#form-edit", function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0) return layer.msg('更新文章分类失败！')
                layer.msg('更新文章分类成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 删除按钮
    $("body").on("click", ".btn-delete", function(){
        var id = $(this).attr("data-id")

        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0) return layer.msg('删除分类失败！')
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})