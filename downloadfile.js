$('#datatable').DataTable({
    "language": {
        "emptyTable": "請選擇條件搜尋"
    },
    "ordering": false,               // Allows ordering
    "searching": false,              // Searchbox
    "paging": false,                 // Pagination
    "info": false
});

$(document).on('submit', '#searchpdf', function (event) { //送出資料搜尋

    var id = $('#id').val();;
    var start = $('#startdate').val();
    var end = $('#enddate').val();
    var area = $('#search_areanum').val();
    var table = $('#datatable').DataTable();


    if (start != "" && end != "" && area != "") {
        var is = [];
        if ($('#worksheet').is(":checked")) { is.push($('#worksheet').val()); } else { console.log('worksheet uncheck') }
        if ($('#shipmentsheet').is(":checked")) { is.push($('#shipmentsheet').val()); } else { console.log('shipmentsheet uncheck') }
        console.log(is);

        
        for (let i = 0; i < is.length; i++) {

            var tablerow = table.row;//get row
            var button = '<a href="javascript:void();" class="btn btn-sm btn-success pdfBtn" data-id="' + id + '" >PDF</a>';
            var rdata = [id = i + 1, start, end, area, is[i], button];
            //console.log('123');
            tablerow.add(rdata).draw();//指定row的資料內容

        }
        //$('#startdate').val('');
        //$('#enddate').val('');
        //$('#search_areanum').val('');
        $('#worksheet').prop('checked', false);
        $('#shipmentsheet').prop('checked', false);


    }
    else {
        alert("請重新輸入資料");
    }

});

$('#datatable tbody').on('click', '.pdfBtn', function () { //下載檔案
    var start = $('#startdate').val();
    var end = $('#enddate').val();
    var area = $('#search_areanum').val();
    var StartDate = 'StartDate=';
    var EndDate = '&EndDate=';
    var Area = '&Area=';
    var url = 'http://134.208.97.191:8080/sensor_Webservice.asmx/exportPDF6?';
    var downloadurl = url + StartDate + start + EndDate + end + Area + area;

    //console.log('789');
    var currentRow = $(this).closest("tr");
    var sheet = currentRow.find("td:eq(4)").text();//抓表單類型欄位內容
    //console.log(sheet);

    if (String(sheet) === String('工作紀錄表')) {
        //console.log('456');
        window.location.href = downloadurl;
        return;
    }
    if (String(sheet) === String('出貨紀錄表')) {
        //console.log('123');
        alert("無資料");
        return;
    }
});

