$(function(){
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data){
        const dt = new Date(data)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n){
        return n < 10 ? '0' + n : n
    }

    // 定义一个查询的参数对象，等到请求数据的时候，需要将请求参数对象提交到服务器
    var queryData = {
        pagenum: 1,  // 页码值，默认请求第一页
        pagesize: 2,  // 每页显示多少条数据，默认2条
        cate_id: '',  // 文章分类id，默认为空
        state: '',  // 文章状态，默认为空
    }

    var {cate_id, state, ...defaultData} = queryData
    var {cate_id, ...no_cate_id} = queryData
    var {state, ...no_state} = queryData

    initTable(defaultData)
    initCate()


    // 获取文章列表数据
    function initTable(qdata){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: qdata,
            success: function(res){
                if(res.status !== 0) return layer.msg('获取文章列表失败！');
                // 渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                console.log(res);
                // 渲染分页
                renderPage(res.total, qdata)
            }
        })
    }

    // 初始化文章分类
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0) return layer.msg('获取分类数据失败！')
                // 渲染数据
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                // 重新渲染表单区域
                form.render()
            }
        })
    }

    // 筛选功能
    $("#form-search").on("submit", function(e){
        e.preventDefault()
        // 获取表单中的值
        let cate_id = $("[name=cate_id]").val()
        let state = $("[name=state]").val()
        // 为查询字符串赋值
        var data = queryDt(cate_id, state)

        // 根据最新的筛选条件重新调用初始化表格的函数
        // console.log(data);
        initTable(data)
    })

    // 定义查询字符串的函数
    function queryDt(cate_id, state){
        var data = null
        if(cate_id !== '' && state !== ''){
            data = queryData
            data.cate_id = cate_id
            data.state = state
        }else if(cate_id !== ''){
            data = no_state
            data.cate_id = cate_id
        }else if(state !== ''){
            data = no_cate_id
            data.state = state
        }else{
            data = defaultData
        }
        return data
    }

    // 定义渲染分页的方法
    function renderPage(total, querydata){
        console.log(querydata);
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: querydata.pagesize,
            curr: querydata.pagenum,  // 默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first){
                // 将最新的页码值赋值给 querydata
                querydata.pagenum = obj.curr
                // 把最新的条目数赋值给 querydata
                querydata.pagesize = obj.limit
                // 重新获取数据列表
                // 通过 first 避免死循环
                if(!first) initTable(querydata)
            }
        })
    }

    // 删除按钮
    $("body").on("click", ".btn-delete", function(){
        // 获取删除按钮的个数
        var len = $(".btn-delete").length
        var id = $(this).attr("data-id")
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if(res.status !== 0) return console.log(res.message);
                    layer.msg('删除文章成功！')

                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据，则让页码值 -1 之后，再重新调用 initTable 方法
                    var q = defaultData
                    if(len === 1){
                        // 如果页面还剩一个删除按钮，则这次删除之后，本页面就没有删除按钮了，即没有数据了，就应该让页码值 -1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable(q)
                }
            })
            
            layer.close(index);
        })
    })
})