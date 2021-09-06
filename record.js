//console.log("bad1");
var lp = []
$('#dtable').DataTable({ //使用jQuery DataTables套件
    "autoWidth": false,
    "ordering": true, //排序功能, 預設是開啟
    "searching": true, //搜尋功能, 預設是開啟
    "paging": true, //分頁功能, 預設是開啟
    "pagingType": 'simple_numbers',
    //改變DOM
    "dom": "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    "lengthMenu": [30, 50],//改變筆數選單
    //改變語言
    "language": { 
        "processing": "處理中...",
        "loadingRecords": "載入中...",
        "lengthMenu": "顯示 _MENU_ 項結果",
        "zeroRecords": "沒有符合的結果",
        "info": "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
        "infoEmpty": "顯示第 0 至 0 項結果，共 0 項",
        "infoFiltered": "(從 _MAX_ 項結果中過濾)",
        "infoPostFix": "",
        "search": "搜尋:",
        "paginate": {
            "first": "第一頁",
            "previous": "上一頁",
            "next": "下一頁",
            "last": "最後一頁"
        },
        "aria": {
            "sortAscending": ": 升冪排列",
            "sortDescending": ": 降冪排列"
        }
    },
    data: lp,
    'ajax': { //取得數據內容
        'url': 'http://134.208.97.191:8080/sensor_WebService.asmx/Select_Record', //要抓哪個地方的資料
        'type': 'post', //使用什麼方式抓
    },
    columns: [
        { data: "No" }, //第一欄使用data中的No
        { data: "date" }, //第二欄使用data中的data
        { data: "area" }, //第三欄使用data中的area
        { 
            data: "item", render: function (data, row) {

                var p = [];

                if (data.land_pre == true) { p.push('整地'); } else { p.push(''); }
                if (data.weeding == true) { p.push('除草'); } else { p.push(''); }
                if (data.harvest == true) { p.push('採收'); } else { p.push(''); }
                if (data.planting == true) { p.push('定植'); } else { p.push(''); }
                if (data.fertilize == true) { p.push('施肥'); } else { p.push(''); }
                if (data.other == true) { p.push('其他'); } else { p.push(''); }
                if (data.sowing == true) { p.push('播種'); } else { p.push(''); }
                if (data.bug == true) { p.push('病蟲害防治'); } else { p.push(''); }

                return p.join(' ');
            }
        },//第四欄使用data中的item
        { data: "worker" }, //第五欄使用data中的worker
        {
            data: null,
            render: function (data, type, row) {
                //return '<button class="btn btn-sm btn-success editBtn" onclick="(' + row.No + ')">編輯</button> <button class="btn btn-sm btn-danger btnDelete" onclick="(' + row.No + ')">刪除</button>';
                return '<a href="javascript:void();" data-id="' + row.No + '" class="btn btn-sm btn-success editBtn">編輯</a> <a href="javascript:void();" data-id="' + row.No + '" class="btn btn-sm btn-danger btnDelete">刪除</a>';
            }

        }//第六欄顯示按鈕
    ]

});


refresh();

function refresh() { //刷新表格
    $.ajax({
        url: 'http://134.208.97.191:8080/sensor_WebService.asmx/Select_Record',//要抓哪個地方的資料
        type: 'POST', //使用什麼方式抓
        dataType: 'JSON', //回傳資料的類型
        success: function (data) {
            var table = $('#dtable').DataTable();
            lp = []
            lp = data
            table.clear()
            table.rows.add(lp)
            table.draw()
        } //成功取得回傳時的事件
    })
}
window.onload = function(){
    
    document.getElementById('exampleModalLabel').innerHTML = 'your tip has been submitted!';
}

$('#addrecordeModal').on('submit', '#saveRecordForm', function (event) { //新增資料
    
    var date = $('#workdate').val();
    var area = $('#areanum').val();
    //var item = $("input[type='checkbox']").val();
    var content = $('#workcontent').val();
    var staff = $('#staff').val();
    //$(this).find('.modal-title').text("You new title");
    
    if (date != '' && area != '') //&& !$("#checkboxID").is(":checked")==false  
    {
        var i = [];
        if ($('#land_pre').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#weeding').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#harvest').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#planting').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#fertilize').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#other').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#sowing').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#bug').is(":checked")) { i.push(1); } else { i.push(0); }

        console.log("bad2");
        $.ajax({
            url: 'http://134.208.97.191:8080/sensor_WebService.asmx/Insert_Record',
            data: { date: date, Area: area, 整地: i[0], 除草: i[1], 採收: i[2], 定植: i[3], 施肥: i[4], 其他: i[5], 播種: i[6], 病蟲害防治: i[7], text: content, Worker: staff },//function 變數:var
            type: 'post',
            success: function (data) {
                console.log(data);
                alert('新增成功!');
                $('#workdate').val('');
                $('#areanum').val('');
                $("input[type='checkbox']").val('');
                $('#workcontent').val('');
                $('#staff').val('');
                $('#addrecordeModal').modal('hide');
                refresh();
                // $('.modal-backdrop').remove();//去掉遮罩層
                // location.reload();//重載網頁可以scroll
            }
        });
    }
    else {
        alert("請重新輸入資料");
    }

});

$(document).on('click', '.editBtn', function (event) { //編輯資料
    event.preventDefault();
    var id = $(this).data('id');
    var trid = $(this).closest('tr').attr('id');
    $.ajax({
        url: "http://134.208.97.191:8080/sensor_WebService.asmx/Get_Single_Data",
        data: { No: id },
        type: "post",
        success: function (data) {
            //console.log(data);
            $.each(JSON.parse(data), function (key, edit) {
                $('#id').val(edit['No']);
                $('#_workdate').val(edit['date']);
                $('#_areanum').find(edit['area']).text();
                $('#_land_pre').prop('checked', edit['item'].land_pre);
                $('#_weeding').prop('checked', edit['item'].weeding);
                $('#_harvest').prop('checked', edit['item'].harvest);
                $('#_planting').prop('checked', edit['item'].planting);
                $('#_fertilize').prop('checked', edit['item'].fertilize);
                $('#_other').prop('checked', edit['item'].other);
                $('#_sowing').prop('checked', edit['item'].sowing);
                $('#_bug').prop('checked', edit['item'].bug);
                $('#_workcontent').val(edit['text']);
                $('#_staff').val(edit['worker']);
            });
            $('#editrecordeModal').modal('show');
        }
    });
});

$(document).on('submit', '#updateRecordForm', function () { //更新編輯後資料
    var id = $('#id').val();
    var trid = $('#trid').val();
    var date = $('#_workdate').val();
    var area = $('#_areanum').val();
    //var item = $('#_workitem').val();
    var content = $('#_workcontent').val();
    var staff = $('#_staff').val();

    if (date != '' && area != '') //&& !$("#checkboxID").is(":checked")==false  
    {
        var i = [];
        if ($('#_land_pre').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_weeding').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_harvest').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_planting').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_fertilize').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_other').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_sowing').is(":checked")) { i.push(1); } else { i.push(0); }
        if ($('#_bug').is(":checked")) { i.push(1); } else { i.push(0); }

        $.ajax({
            url: "http://134.208.97.191:8080/sensor_WebService.asmx/Update_Record",
            data: { No: id, date: date, 田區: area, 整地: i[0], 除草: i[1], 採收: i[2], 定植: i[3], 施肥: i[4], 其他: i[5], 播種: i[6], 病蟲害防治: i[7], 內容: content, Worker: staff },
            type: 'post',
            success: function (data) {
                //console.log(data);

                var table = $('#dtable').DataTable();
                var button = '<a href="javascript:void();" class="btn btn-sm btn-info editBtn" data-id="' + id + '" >編輯</a> <a href="javascript:void();" class="btn btn-sm btn-danger btnDelete" data-id="' + id + '" >刪除</a>';
                var tablerow = table.row($(this).parents('tr'));//get row
                var rdata = [
                    id, date, area, i.join(' '), staff,
                    button
                ];
                rdata = tablerow.data();//指定row的資料內容
                //console.log("bad4");
                $('#editrecordeModal').modal('hide');
                refresh();

            }
        });
    }
    else {
        alert("請重新輸入資料");
    }
});

$('#dtable').on('click', '.btnDelete', function (event) { //刪除資料
    event.preventDefault();
    var id = $(this).data('id');
    if (confirm('是否確定刪除')) {
        $.ajax({
            url: "http://134.208.97.191:8080/sensor_WebService.asmx/Delete_Record",
            data: { No: id },
            type: "post",
            success: function (data) {
                if (data == '"success"') {
                    $('#' + id).closest('tr').remove();
                    refresh();
                }
                else {
                    alert('failed');
                }
            }
        });
    }
});

var table = $('#dtable').DataTable();
$('#dtable').on('keyup', function () { //搜尋datatable內資料
    table.search(this.value).draw();
});

