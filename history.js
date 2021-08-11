const primaryColor = '#4834d4'
const warningColor = '#f0932b'
const successColor = '#6ab04c'
const dangerColor = '#eb4d4b'
const soblueColor = '#007FFF'
const blueColor = '#00BFFF'
const yellowColor = '#f0932b'
const redColor = '#eb4d4b'

const themeCookieName = 'theme'
const themeDark = 'dark'
const themeLight = 'light'

const body = document.getElementsByTagName('body')[0]

function setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

function getCookie(cname) {
    var name = cname + "="
    var ca = document.cookie.split(';')
    for(var i = 0; i < ca.length; i++) {
      	var c = ca[i];
    	while (c.charAt(0) == ' ') {
        	c = c.substring(1)
      	}
      	if (c.indexOf(name) == 0) {
        	return c.substring(name.length, c.length)
      	}
    }
    return ""
}

loadTheme()

function loadTheme() {
	var theme = getCookie(themeCookieName)
	body.classList.add(theme === "" ? themeLight : theme)
}

function switchTheme() {
	if (body.classList.contains(themeLight)) {
		body.classList.remove(themeLight)
		body.classList.add(themeDark)
		setCookie(themeCookieName, themeDark)
	} else {
		body.classList.remove(themeDark)
		body.classList.add(themeLight)
		setCookie(themeCookieName, themeLight)
	}
}

function collapseSidebar() {
	body.classList.toggle('sidebar-expand')
}

function showContent(){
	
}
/*window.onclick = function(event) {
	openCloseDropdown(event)
}*/
var Slabels = [], STdata=[], SHdata=[], Wlabels = [], WTdata=[], WHdata=[], Olabels = [], OTdata=[], OHdata=[];/*棚內時間 棚內溫度 棚內濕度 氣象站時間 氣象站溫度 氣象站濕度 室外時間 室外溫度 室外濕度 */
var maxlimit, hidetout=true, hidetin=true, hidet=true;/*最長時間間距 室外是否先隱藏 棚內是否先隱藏 氣象站是否先隱藏 */
var arr1, arr2;/*arr1=url?前 arr2=url?後*/
var lineChart, lineChart4;/*溫度 濕度 */
var ctxT, ctxH;
var storyId = window.location.href;/*現在頁面的url */
var date = new Date(),date2 = new Date();/*date,date2 重新初始化 */
/*create chart*/
window.onload=function(){/*當此頁面載入時執行創建圖表 */
	setTimeout(function() {/*設定延遲兩秒再執行創建圖表，前面的兩秒先確保有從後端收到資料再來創圖表，不然還沒收到資料就先創圖表，圖表會是空的 */
		ctxT = document.getElementById('lineChart')
		ctxT.height = 300
		ctxT.width = 500
		var data = {
				//labels: ['2020/11/15 00:00', '2020/11/15 02:00', '2020/11/15 04:00', '2020/11/15 06:00', '2020/11/15 08:00', '2020/11/15 10:00', '2020/11/15 12:00', '2020/11/15 14:00', '2020/11/15 16:00', '2020/11/15 18:00', '2020/11/15 20:00', '2020/11/15 22:00'],
				labels: Wlabels,
				datasets: [{
					fill: false,
					label: '室外',
					borderColor: successColor,
					data: OTdata,
					borderWidth: 2,
					hidden: hidetout,
				}, {
					fill: false,
					label: '棚架內',
					borderColor: dangerColor,
					data: STdata,
					borderWidth: 2,
					hidden: hidetin,
				}, {
					fill: false,
					label: '氣象站',
					borderColor: warningColor,
					data: WTdata,
					borderWidth: 2,
					hidden: hidet,
			}]
		}	
		lineChart = new Chart(ctxT, {
			type: 'line',
			data: data,
			options: {
				maintainAspectRatio: false,
				bezierCurve: true,
				scales: {
					 xAxes: [{
						ticks: {
							autoSkip: true,
							maxTicksLimit: maxlimit,
						  },
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: '溫度(℃)',
						},
						ticks: {
							min: 0,  //最小值
							max: 50,  //最大值
						  },
					}]
				}
			}
		})
	}, 2000);
	setTimeout(function() {
		ctxH = document.getElementById('lineChart4')
		ctxH.height = 300
		ctxH.width = 500
		var dataH = {
			//labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
			labels: Wlabels,
			datasets: [{
				fill: false,
				label: '室外',
				borderColor: successColor,
				data: OHdata,
				//data: [25,null,20,28,33,30,null,22,33,37,21,26],
				borderWidth: 2,
				hidden: hidetout,
			}, {
				fill: false,
				label: '棚架內',
				borderColor: dangerColor,
				data: SHdata,
				//data: [25,null,27,28,42,30,31,32,21,34,30,36],
				borderWidth: 2,
				hidden: hidetin,
			}, {
				fill: false,
				label: '氣象站',
				borderColor: warningColor,
				data: WHdata,
				//data: [25,null,27,28,30,30,31,32,24,34,28,31],
				borderWidth: 2,
				hidden: hidet,
			}]
		}
		lineChart4 = new Chart(ctxH, {
			type: 'line',
			data: dataH,
			options: {
				maintainAspectRatio: false,
				bezierCurve: true,
				scales: {
					 xAxes: [{
						ticks: {
							autoSkip: true,
							maxTicksLimit: maxlimit,
						  },
					 }],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: '濕度(%)',
						},
						ticks: {
							min: 0,  //最小值
							max: 100,  //最大值
						},
					}]
				}
			}
		})
	}, 2000);
};
/*create chart end*/

/*判斷使用者選取的時間段，如果超過一天顯示就不會細分時間只會顯示到日期，如果只有一天就會切出一天內每個小時的時間顯示在底座標上 */
Chart.scaleService.updateScaleDefaults('category', {
	ticks: {
	  	callback: function(tick) {
			var characterLimit = 12;
			if ( Wlabels.length>24)
			{
				if ( tick.length >= characterLimit) {
					return tick.slice(0, tick.length).substring(0, characterLimit -1).trim();
				} 
			}
			return tick;
    	}
	}
});

$(document).ready(function() {
	$("#history").on("click", function(event) {
	  	var modal = bootbox.dialog({
		  	message: bootBoxContent(),
		  	title: "歷史紀錄搜尋",
		  	buttons: [
			{
			  	label: "取消",
			  	className: "btn btn-default pull-left",
			  	callback: function() {
					console.log("just do something on close");
			  	}
			},
			{
			  	label: "搜尋",
			  	className: "btn btn-primary pull-left",
			  	callback: function(result) { 
					console.log(storyId);
					if (result) {
						window.location.href = storyId;
				 	}
			  	}
			}
		  	],
		  	show: false,
		  	onEscape: function() 
		  	{ modal.modal("hide"); }
	  	});
	  	modal.modal("show");
	});
})

$(document).ready(function() {
	$(".datepicker1").datepicker({/*開始日期的一些客製化設定 */
		format: 'yyyy/mm/dd',
		clearBtn: true,
		todayBtn: true,
		disableTouchKeyboard: true,
		multidate: false,
		todayHighlight: true,
		weekStart: 1,
		keyboardNavigation: false,
		endDate: new Date(),
	}).on('changeDate', function (selected) {
		date = $(this).val();
	});
	$('.datepicker2').datepicker({/*結束日期的一些客製化設定 */
		format: 'yyyy/mm/dd',
	  	clearBtn: true,
	  	todayBtn: true,
	  	disableTouchKeyboard: true,
	  	multidate: false,
	  	todayHighlight: true,
	  	weekStart: 1,
	  	keyboardNavigation: false,
	  	endDate: new Date(),
  	}).on('changeDate', function (selected) {
		date2 = $(this).val();
	});
	var url = location.href;
	if(url.indexOf('?')!=-1)
	{
		arr1 = url.split('?');
		arr2 = arr1[1].split('&');/*arr2[1]=感測器選取 arr2[2]=開始日期 arr2[3]=結束日期 arr[4]=裝置比較 arr[5]=棚架 */
		var data = { 起始日期: arr2[2], 結束日期: arr2[3]};
		var sen = [];
		sen = arr2[1].split(',');
		//var data = { 起始日期: '20210110', 結束日期: '20210111'};
		$.ajax({/*用ajax連，指定type然後寫要連到的url，data放日期，回傳格式json，如果成功會到success，失敗會到error */
			type: 'post',
			url: "http://134.208.97.191:8080/sensor_WebService.asmx/Sensor1_WS_HourAverage",
			//contentType: "application/json;utf-8",
			data: data,
			dataType: "json",
			async: false,
			success: function (result) {
				//var labels = [], Tdata=[], Hdata=[];
			  	for(i=0;i<result.length;i++)
				{
					if(result[i].Type==='Sensor1   ')
					{
						if(result[i].Tempartature==-999)
						{/*如果有遇到-999的值代表是缺值，所以在放入array時改成放null，畫圖表的時後才會自動空出來 */
							Slabels.push(result[i].DataTime);
							STdata.push('null');
							SHdata.push('null');
							//console.log(STdata);
						}else{
							Slabels.push(result[i].DataTime);
							STdata.push(result[i].Tempartature);
							SHdata.push(result[i].Humidity);
						}
					}else if(result[i].Type==='Sensor3   ')
					{
						if(result[i].Tempartature==-999)
						{/*如果有遇到-999的值代表是缺值，所以在放入array時改成放null，畫圖表的時後才會自動空出來 */
							Olabels.push(result[i].DataTime);
							OTdata.push('null');
							OHdata.push('null');
							//console.log(OTdata);
						}else{
							Olabels.push(result[i].DataTime);
							OTdata.push(result[i].Tempartature);
							OHdata.push(result[i].Humidity);
						}
					}else{
						if(result[i].Tempartature==='-999')
						{
							Wlabels.push(result[i].DataTime);
							WTdata.push(null);
							WHdata.push(null);
						}else{
							Wlabels.push(result[i].DataTime);
							WTdata.push(result[i].Tempartature);
							WHdata.push(result[i].Humidity);
						}
					}
				}
				maxlimit=parseInt(Wlabels.length/24)+1;
				console.log(maxlimit);
				/*這邊之後要看問題1 是取11/1600:00還是11/1700:00，如果是前這就要加1*/
				console.log(Olabels);//得到鍵對應的值 
				console.log(OTdata);//得到鍵對應的值 
				console.log(OHdata);//得到鍵對應的值                                 
			},
			error: function (result) {
				alert(result.status + "///////" + result.statusText);
			}
		});
		
		/*把index打開history表單時選的紀錄傳到這一頁 */
		/*日期 */
		$("#Date2").datepicker({
			dateFormat: 'yy-mm-dd'
		}).datepicker('setDate',new Date(arr2[3]) );
		$("#Date1").datepicker({
			dateFormat: 'yy-mm-dd'
		}).datepicker('setDate',new Date(arr2[2]) );
		/*感測器sensorselect、裝置environmentselect、棚架scaffoldselect */
		$.each(arr2[1].split(","), function(i,e){
			$("#sensorselect option[value='" + e + "']").prop("selected", true);
		});
		$.each(arr2[4].split(","), function(i,e){
			$("#environmentselect option[value='" + e + "']").prop("selected", true);
		});
		$.each(arr2[5].split(","), function(i,e){
			$("#scaffoldselect option[value='" + e + "']").prop("selected", true);
		});
		/*把使用者一開始沒勾選要出現的圖表先設定隱藏起來 */
		if(arr2[4].indexOf('1')!=-1)
		{ hidet=false; }
		if(arr2[4].indexOf('2')!=-1)
		{ hidetin=false; }
		if(arr2[4].indexOf('3')!=-1)
		{ hidetout=false; }
	}
})

function submithistory(){/*重新查詢button按下後用新的href先重新載入頁面，然後用新的href後面接的條件重新呼叫ajax */
	var data2 = { 起始日期: date, 結束日期: date2};
	var environmentselectsubmit=$("#environmentselect").val();/*獲取重新選取要查詢的裝置 */
	var sensorselectsubmit=$("#sensorselect").val();/*獲取重新選取要查詢的感測器 */
	var scaffoldselectsubmit=$("#scaffoldselect").val();/*獲取重新選取要查詢的感測器 */
	//window.location.href = window.location.host+"?sensor="+"&temperature&"+date+"&"+date2+"&1";
	window.location.href = "history.html"+"?sensor=&"+sensorselectsubmit+"&"+date+"&"+date2+"&"+environmentselectsubmit+"&"+scaffoldselectsubmit;
	$.ajax({
		type: 'post',
		url: "http://134.208.97.191:8080/sensor_WebService.asmx/Sensor1_WS_HourAverage",
		//contentType: "application/json;utf-8",
		data: data2,
		dataType: "json",
		async: false,
		success: function (result) {
			for(i=0;i<result.length;i++)
			{
				if(result[i].Type==='Sensor1   ')
				{
					if(result[i].Tempartature==='-999')
					{
						Slabels.push(result[i].DataTime);
						STdata.push(null);
						SHdata.push(null);
					}else{
						Slabels.push(result[i].DataTime);
						STdata.push(result[i].Tempartature);
						SHdata.push(result[i].Humidity);
					}
					
				}else if(result[i].Type==='Sensor3   ')
				{
					if(result[i].Tempartature==-999)
					{/*如果有遇到-999的值代表是缺值，所以在放入array時改成放null，畫圖表的時後才會自動空出來 */
						Olabels.push(result[i].DataTime);
						OTdata.push('null');
						OHdata.push('null');
						//console.log(OTdata);
					}else{
						Olabels.push(result[i].DataTime);
						OTdata.push(result[i].Tempartature);
						OHdata.push(result[i].Humidity);
					}
				}else{
					if(result[i].Tempartature==='-999')
					{
						Wlabels.push(result[i].DataTime);
						WTdata.push(null);
						WHdata.push(null);
					}else{
						Wlabels.push(result[i].DataTime);
						WTdata.push(result[i].Tempartature);
						WHdata.push(result[i].Humidity);
					}
				}
			}
			maxlimit=parseInt(Wlabels.length/24)+1;
			console.log(maxlimit);
			/*這邊之後要看問題1 是取11/1600:00還是11/1700:00，如果是前這就要加1*/
			console.log(Slabels);//得到鍵對應的值 
			console.log(STdata);//得到鍵對應的值 
			console.log(SHdata);//得到鍵對應的值                                
		},
		error: function (result) {
			alert(result.status + "///////" + result.statusText);
		}
	});
}

function getData(pagename){
    var req = new XMLHttpRequest();
    req.open("get","http://127.0.0.1:5500/"+pagename);
    req.onload=function(){
        var content=document.getElementById("switch_content");
        content.innerHTML=this.responseText;
    };
    req.send();
}

$(".nav-item").on("click", function() {
    $(".nav-item").removeClass("active");
    $(this).addClass("active");
  });