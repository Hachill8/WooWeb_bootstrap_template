//console.log("bad1");
var lp = []

$('#dtable').DataTable({
    "autoWidth": false,
    "ordering": true,               // Allows ordering
    "searching": true,              // Searchbox
    "paging": true,                 // Pagination
    //"info": false,                  // Shows 'Showing X of X' information
    "pagingType": 'simple_numbers',
    "dom": "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
 
    "lengthMenu": [30, 50],//改變筆數選單
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
    },//改變語言  
 
    data: lp,
    'ajax': {
        'url': 'http://134.208.97.191:8080/sensor_WebService.asmx/Select_Record',
        'type': 'post',
    },
    columns: [
        { data: "No" },
        { data: "date" },
        { data: "area" },
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
        },
        { data: "worker" },
        {
            data: null,
            render: function (data, type, row) {
                //return '<button class="btn btn-sm btn-success editBtn" onclick="(' + row.No + ')">編輯</button> <button class="btn btn-sm btn-danger btnDelete" onclick="(' + row.No + ')">刪除</button>';
                return '<a href="javascript:void();" data-id="' + row.No + '" class="btn btn-sm btn-success editBtn">編輯</a> <a href="javascript:void();" data-id="' + row.No + '" class="btn btn-sm btn-danger btnDelete">刪除</a>';
            }
 
        }
    ]
 
});


refresh();

function refresh() {
    $.ajax({
        url: 'http://134.208.97.191:8080/sensor_WebService.asmx/Select_Record',
        type: 'POST',
        dataType: 'JSON',
        success: function (data) {
            var table = $('#dtable').DataTable();
            lp = []
            lp = data
            table.clear()
            table.rows.add(lp)
            table.draw()
        }
    })
}
 
$('#addrecordeModal').on('submit', '#saveRecordForm', function (event) {
    
    var date = $('#workdate').val();
    var area = $('#areanum').val();
    //var item = $("input[type='checkbox']").val();
    var content = $('#workcontent').val();
    var staff = $('#staff').val();
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
            data: { date: date, Area: area, 整地: i[0], 除草: i[1], 採收: i[2], 定植: i[3], 施肥: i[4], 其他: i[5], 播種: i[6], 病蟲害防治: i[7], text: content, Worker: staff },
            type: 'post',
            success: function (data) {
                //var json =  JSON.parse(data);
                //status = json.status;
                console.log(data);
                // if(data=='"success"')
                // {
                //table = $('#dtable').DataTable();
                //table.draw();
                // console.log('test1');
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

               
                
                // }
            }
        });
    }
    else {
        alert("請重新輸入資料");
    }
 
});
 
$(document).on('click', '.editBtn', function (event) {
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
 
$(document).on('submit', '#updateRecordForm', function () {
   
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
 
$('#dtable').on('click', '.btnDelete', function (event) {
    event.preventDefault();
    var id = $(this).data('id');
    if (confirm('是否確定刪除')) {
        $.ajax({
            url: "http://134.208.97.191:8080/sensor_WebService.asmx/Delete_Record",
            data: { No: id },
            type: "post",
            success: function (data) {
                //var json = JSON.parse(data);
                //var status = json.status;
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
$('#dtable').on('keyup', function () {
    table.search(this.value).draw();
});
