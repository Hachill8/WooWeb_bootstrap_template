$(document).ready(function () {

    //執行東華過去24小時的溫度折線圖
    Set_cwblast24hours_ndhu_temperature();

    //執行上方即時的溫度、相對溼度、天氣
    Set_FourTitleText();

    //執行手機開啟會直接跳到生產履歷頁面
    Mobile_device_go_record_page();
});

//左方導覽列按鈕切換-即時資料
$("#realtime_active").on("click", function () {
    $("#record_active").removeClass("active");
    $("#history").removeClass("active");
    $(this).addClass("active");
});

//左方導覽列按鈕切換-生產履歷
$("#record_active").on("click", function () {
    $("#realtime_active").removeClass("active");
    $("#history").removeClass("active");
    $(this).addClass("active");
});

//從手機開啟會直接跳到生產履歷頁面
function Mobile_device_go_record_page() {
    
    var useragent = navigator.userAgent;
    useragent = useragent.toLowerCase();

    if (useragent.indexOf('iphone') != -1 || useragent.indexOf('android') != -1) {
        //切換頁面
        getData('record.html');
        //切換按鈕
        record_active();
    }
}

//當用手機版開啟時會從即時資料頁跳到生產履歷頁，因此按鈕也要做切換
function record_active() {
    $("#realtime_active").removeClass("active");
    $("#history").removeClass("active");
    $("#record_active").addClass("active");
}

//以AJAX方式針對指定內容做更新，不用重整網頁
function getData(pagename) {
    $.ajax({
        url: "http://134.208.97.191:8080/html/WooWeb_bootstrap_template/" + pagename,	//上傳URL
        type: "GET", //請求方式
        success: function (data) {
            //替換html內容
            $("#switch_content").html(data);

            //加入此html會用到的js檔
            var element = document.createElement('script');
            var src = pagename.split('.', 1) + '.js';
            element.src = src;
            document.body.appendChild(element);

        }, //請求成功
        error: function () {
            alert("AJAX換頁初四了!");
        },//表示如果請求響應出現錯誤，會執行的回調函數
    });
}

//執行東華過去24小時的溫度折線圖
function Set_cwblast24hours_ndhu_temperature() {

    $.ajax({
        type: "GET",
        // contentType: "application/json; charset=utf-8",
        url: 'http://134.208.97.191:8080/JSON_WebService.asmx/NDHU_24hr',
        dataType: 'json'

    })
        .fail(function (jqXHR, textStatus, errorThrown) { alert("圖表初四了!"); })
        .done(function (results) {
            // console.log(results);

            var last24hours = [], Temperature_data = [];
            // var Relative_humidity_data = [];

            //---將"時間"儲存為一個陣列---
            for (let i = results.length - 1; i >= 0; i--) {

                //---X軸時間簡化，如果每個都顯示日期太冗長---因為找到更好的寫法，以下這幾行就不用了，留著是為了可以比較前後寫法差異
                //X軸的第一個時間和00:00的時間前面要顯示日期，23 - (24 - parseInt(results[23].DataTime.substring(6, 8) =>找出今日00:00的位置)
                // if (i == 23 || i == parseInt(results[23].DataTime.substring(6, 8) - 1)) {
                // last24hours.push(results[i].DataTime);
                // }
                // else {
                //     last24hours.push(results[i].DataTime.substring(6, 11));
                // }

                last24hours.push(results[i].DataTime);
            }

            //---將"溫度"儲存為一個陣列---
            for (let i = results.length - 1; i >= 0; i--) {

                Temperature_data.push(results[i].Temperature);

            }
            // console.log(last24hours);
            // console.log(Temperature_data);


            //根據滑鼠停留圖表的位置，會顯示Y軸的線，線會對應X軸上的值
            Chart.defaults.LineWithLine = Chart.defaults.line;
            Chart.controllers.LineWithLine = Chart.controllers.line.extend({
                draw: function (ease) {
                    Chart.controllers.line.prototype.draw.call(this, ease);
                    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                        var activePoint = this.chart.tooltip._active[0],
                            ctx = this.chart.ctx,
                            x = activePoint.tooltipPosition().x,
                            // topY = this.chart.legend.bottom,
                            topY = this.chart.chartArea.top;
                        bottomY = this.chart.chartArea.bottom;
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, topY);
                        ctx.lineTo(x, bottomY);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "rgba(78, 115, 223, 0.2)";
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            });

            //丟掉原本的舊圖表，如果不destroy當刷新圖表時，原本的舊資料會閃爍地出現
            if (window.ndhu_cwb_linechart != undefined) {
                window.ndhu_cwb_linechart.destroy();
            }

            // 获取所选canvas元素的内容
            var ctx = document.getElementById('ndhu_cwb_temperature_linechart');

            //设置图表高度
            // ctx.width = 800;
            // ctx.height = 300;


            //---初始化一个新的图---
            window.ndhu_cwb_linechart = new Chart(ctx, {
                type: 'LineWithLine',
                //---设置图表的数据---
                data: {
                    //★★★--labels放入"時間"陣列
                    labels: last24hours,
                    datasets: [{

                        label: "東華溫度",
                        yAxisID: "y-Temp",
                        //是否填充
                        fill: false,
                        //★★★--data放入"溫度"陣列
                        data: Temperature_data,
                        // borderColor: 'rgb(78, 114, 223)',
                        //线条宽度
                        borderWidth: 2,
                        //贝塞尔曲线 值为0时为折线图
                        lineTension: 0.3,
                        //线下填充色
                        //backgroundColor: "rgba(78, 115, 223, 0.05)",
                        //线条颜色
                        borderColor: "rgba(78, 115, 223, 1)",

                        //鼠标悬浮时点半径
                        pointHoverRadius: 4,
                        //鼠标悬浮时点的颜色
                        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                        //鼠标悬浮时点边框颜色
                        pointHoverBorderColor: "rgba(78, 115, 223, 1)",




                    }]
                },

                options: {

                    //---標題設定---
                    title: {
                        display: true,
                        text: "累積日照 : " + results[0].Light + " 小時",
                    },

                    //---標籤設定---
                    legend: {
                        //隱藏標籤
                        display: false,
                    },

                    //隱藏線的點
                    elements: {
                        point: {
                            radius: 0
                        }
                    },

                    //---提示框設定---
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        titleMarginBottom: 10,
                        titleFontColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 2,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function (tooltipItem, chart) {
                                return '溫度：' + tooltipItem.yLabel + ' ℃';
                            }
                        }

                    },

                    //---滑鼠懸停---
                    hover: {
                        //點不要有動畫，解決閃爍問題
                        //▲預設的點會有動畫，但只要在圖表上移動快一點，點就會閃爍
                        animationDuration: 0,

                        //懸停在圖表上就會出現點
                        //▲預設是碰到線上的值才會出現點
                        intersect: false
                    },

                    //缩放时是否保持长宽比
                    maintainAspectRatio: false,
                    //線條弧度
                    bezierCurve: true,

                    //---X、Y軸相關設定---
                    scales: {
                        //設定X軸
                        xAxes: [
                            //以下設定了兩條X軸，一條顯示時間，一條顯示日期
                            {
                                //---顯示時間---
                                id: 'xAxis1',
                                type: "category",
                                offset: true,
                                gridLines: {
                                    //顯示X軸刻度
                                    display: true,
                                    //圖表中不顯示X軸
                                    drawOnChartArea: false,

                                },
                                ticks: {
                                    autoSkip: true,

                                    callback: function (label) {
                                        //顯示時間，原本label的值為xx/xx xx:xx
                                        //label.substring(6, 12)只取後面的時間

                                        return label.substring(6, 12);

                                    }
                                }
                            },
                            {
                                //---顯示日期---
                                id: 'xAxis2',
                                type: "category",
                                offset: true,
                                gridLines: {
                                    //不顯示X軸刻度
                                    display: false,
                                    //圖表中不顯示X軸
                                    drawOnChartArea: false,

                                },
                                ticks: {
                                    autoSkip: false,

                                    fontColor: "rgba(78, 115, 223, 1)",
                                    callback: function (label, index, labels) {
                                        //顯示日期，原本label的值為xx/xx xx:xx
                                        //第一個時間和00:00此兩個時間才顯示日期，其他則不顯示
                                        if (label.length > 5 && index == 0 || label.substring(6, 12) == "00:00") {
                                            return label.substring(0, 6);
                                        }
                                        else {
                                            return "";
                                        }

                                    }
                                }


                            }],
                        yAxes: [{
                            id: "y-Temp",
                            position: 'left',

                            scaleLabel: {
                                display: true,
                                labelString: '溫度(℃)'
                            },
                            gridLines: {
                                color: "rgb(234, 236, 244)",
                                zeroLineColor: "rgb(234, 236, 244)",
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            },
                            ticks: {

                                min: Math.floor(Math.min.apply(this, Temperature_data)) - 1, //最小值
                                max: Math.ceil(Math.max.apply(this, Temperature_data)) + 1, //最大值
                                stepSize: 1 //值與值的間隔
                            },
                        }]
                    }
                }
            });
            //每隔10分鐘重新執行一次(1秒=1000)
            setTimeout(Set_cwblast24hours_ndhu_temperature, 600000);

        });
}

var temp_text = document.getElementById('tempid');
var hum_text = document.getElementById('humid');
var weather_text = document.getElementById('weatherid');
var updatetime1 = document.getElementById('time1');
var updatetime2 = document.getElementById('time2');
var updatetime3 = document.getElementById('time3');
var weather_img = document.getElementById('img');

//執行上方即時的溫度、相對溼度、天氣
function Set_FourTitleText() {
    $.ajax({
        type: 'GET',
        // contentType: "application/json; charset=utf-8",
        url: 'http://134.208.97.191:8080/JSON_WebService.asmx/Hualien_24hr',
        dataType: 'json'

    })
        .fail(function (jqXHR, textStatus, errorThrown) { alert("四個格子初四了!"); })
        .done(function (results) {
            console.log(results);

            var Timedata = [], Tdata = [], Hdata = [], Wdata = [], Wimgdata = [];

            Timedata.push(results[0].DataTime);
            Tdata.push(results[0].Temperature);
            Hdata.push(results[0].Humidity);
            Wdata.push(results[0].Weather);
            Wimgdata.push(results[0].Weather_img);

            temp_text.textContent = Tdata[0] + "℃";
            hum_text.textContent = Hdata[0] + "%";
            weather_text.textContent = Wdata[0];
            if (Wimgdata[0] == "day/01.svg") {
                weather_img.src = 'img/day01.svg';
            }
            else if (Wimgdata[0] == "day/04.svg") {
                weather_img.src = 'img/day04.svg';
            }
            else if (Wimgdata[0] == "night/01.svg") {
                weather_img.src = 'img/night01.svg';
            }
            else if (Wimgdata[0] == "night/04.svg") {
                weather_img.src = 'img/night04.svg';
            }
            else if (Wimgdata[0] == "night/08.svg") {
                weather_img.src = 'img/night08.svg';
            }
            else if (Wimgdata[0] == "night/28.svg") {
                weather_img.src = 'img/night28.svg';
            }
            else if (Wimgdata[0] == "day/14.svg") {
                weather_img.src = 'img/day14.svg';
            }
            else {
                weather_img.src = 'img/dayandnight07.svg';
            }
            updatetime1.textContent = "更新時間 : " + Timedata[0];
            updatetime2.textContent = "更新時間 : " + Timedata[0];
            updatetime3.textContent = "更新時間 : " + Timedata[0];

            //每隔10分鐘重新執行一次(1秒=1000)
            setTimeout(Set_FourTitleText, 600000);
        });
}


