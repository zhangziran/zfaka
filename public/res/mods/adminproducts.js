layui.define(['layer', 'table', 'form','layedit'], function(exports){
	var $ = layui.jquery;
	var layer = layui.layer;
	var table = layui.table;
	var form = layui.form;
	var layedit = layui.layedit;
	
	var edit_description=layedit.build('description'); //建立编辑器
		
	table.render({
		elem: '#products',
		url: '/admin/products/ajax',
		page: true,
		cellMinWidth:60,
		cols: [[
			{field: 'id', title: 'ID', width:80},
			{field: 'typename', title: '商品类型'},
			{field: 'name', title: '商品名称'},
			{field: 'price', title: '单价'},
			{field: 'qty', title: '数量', width:80, templet: '#qty',align:'center'},
			{field: 'auto', title: '发货模式', width:100, templet: '#auto',align:'center'},
			{field: 'active', title: '是否销售', width:100, templet: '#active',align:'center'},
			{field: 'opt', title: '操作', width:100, templet: '#opt',align:'center'},
		]]
	});
  
  
  
	//更新库存
	$("#products_table").on("click","#updateQty",function(event){
		event.preventDefault();
		var pid = $("#pid").val();
		$(this).attr({"disabled":"disabled"});
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/admin/products/updateqtyajax",
            data: { "csrf_token": TOKEN,'pid':pid},
            success: function(res) {
                if (res.code == 1) {
					layer.open({
						title: '提示',
						content: '更新成功',
						btn: ['确定'],
						yes: function(index, layero){
							location.reload();
						},
						cancel: function(){ 
							location.reload();
						}
					});
                } else {
					layer.msg(res.msg,{icon:2,time:5000});
                }
                return;
            }
        });
	});
	
	//修改
	form.on('submit(edit)', function(data){
		layedit.sync(edit_description);
		data.field.csrf_token = TOKEN;
		data.field.description = layedit.getText(edit_description);
		var i = layer.load(2,{shade: [0.5,'#fff']});
		$.ajax({
			url: '/admin/products/editajax',
			type: 'POST',
			dataType: 'json',
			data: data.field,
		})
		.done(function(res) {
			if (res.code == '1') {
				layer.open({
					title: '提示',
					content: '修改成功',
					btn: ['确定'],
					yes: function(index, layero){
					    location.reload();
					},
					cancel: function(){ 
					    location.reload();
					}
				});
			} else {
				layer.msg(res.msg,{icon:2,time:5000});
			}
		})
		.fail(function() {
			layer.msg('服务器连接失败，请联系管理员',{icon:2,time:5000});
		})
		.always(function() {
			layer.close(i);
		});

		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	exports('adminproducts',null)
});