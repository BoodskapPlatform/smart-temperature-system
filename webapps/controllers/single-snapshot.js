var single_device_id = null;
var single_device_obj = null;
var stat_data = null;
// var startDate = moment().startOf('day');
// var endDate = moment().endOf('day');
var selectedType = 1;
var startDate = moment().subtract(6, "days").startOf("day");
// var endDate = moment().endOf("day");
var endDate = moment().add(1,'days').endOf("day");

$(document).ready(function () {
  singleSnapshotInit();
});

function singleSnapshotInit() {
  single_device_id = $("#singleDevId").val();

  getSingleDeviceStatus();
  setTimeout(()=>{
    loadDateRanges("deviceHistory");
    loadDateRanges("voltageHistory");
  
    var copyRawData = new ClipboardJS('.copyRawData');
    copyRawData.on('success', function (e) {
        successMsg('Raw data Copied Successfully');
    });
  },100);

}

function getSingleDeviceStatus() {
  let slug = DOMAIN_KEY.toLowerCase();
  let api = "LHT65/status";
  let method = "post";
  let key = "";
  let token = USER_OBJ["token"];

  let obj = {
    authType: "TOKEN",
  };

  let data = { devid: single_device_id, tz: MY_BROWSER_GMT };

  loading();

  executeMicroAPI(
    slug,
    api,
    method,
    data,
    key,
    token,
    obj,
    async (status, result) => {
      closeLoading();

      $(".condition-dom").hide();
      $("#deviceSnapshotLoader").show();

      if (status) {
        single_device_obj = result["value"];
        stat_data = result;
        setSnapshotPage();
      } else {
        $(".condition-dom").hide();
        $("#noDataAvailable").show();
      }
    }
  );
}

function triggerCheckbox(id){

  let data = $("#"+id+"Stats").data("status");
  if(data === "today"){ //Show week data
    $("#"+id+"Stats").data("status","week");
  }else{ //Show today data
    $("#"+id+"Stats").data("status","today");
  }

  if(id === "temperature"){
    setTemperatureData(stat_data[data]);
  }else{
    setHumidityData(stat_data[data]);
  }
}

function setSnapshotPage() {
  $(".dev-id").html(single_device_obj["devid"]);
  $(".dev-temp-value").html(single_device_obj["temperature"]);
  $(".dev-hum-value").html(single_device_obj["humidity"]);
  $(".dev-reported-time").html(
    moment(single_device_obj["updated_time"]).format(DATE_TIME_FORMAT)
  );
  $(".dev-voltage").html(single_device_obj["voltage"]);
  $(".dev-raw-data").html(single_device_obj["rawdata"]);

  let battery_status = {
    0: "Critical",
    1: "Low",
    2: "Normal",
    3: "Good",
  };

  $(".dev-battery-status").html(
    battery_status[single_device_obj["battery_status"]]
  );
  $(".dev-battery-img").attr(
    "src",
    `images/battery/battery-` + single_device_obj["battery_status"] + `.png`
  );

  setTemperatureData(stat_data["today"]);
  setHumidityData(stat_data["today"]);

  $("#thermometer").dualTemperatureMeter({
    target: "thermometer", // Your Dom ID
    degree: "c", // Input Temperature Unit f or c
    height: 260, // Meter Height
    temperature: single_device_obj["temperature"], // Input Temperature
    color: "#f41e33", // Custom Level Indication Color
    t_high_bg: "#f41e33", // High Level Temperature Indication Color
    t_good_bg: "#2ecc71", // Correct Level Temperature Indication Color
    t_low_bg: "#19b5fe", // Low Level Temperature Indication Color
    temp_max: 20, // Maximum Threshold
    temp_min: -20, // Minimum Threshold
    actions: function (value) {
      //Temperature conversion values in (°F, °C) both units
    },
  });
  $(".copyRawData").attr('data-clipboard-text',single_device_obj["rawdata"]);
}

function setTemperatureData(obj) {
  $(".dev-avgtemp-value").html(checkDecimal(obj["avgt"]["value"]));
  $(".dev-mintemp-value").html(checkDecimal(obj["mint"]["value"]));
  $(".dev-maxtemp-value").html(checkDecimal(obj["maxh"]["value"]));
}

function setHumidityData(obj) {
  $(".dev-avghum-value").html(checkDecimal(obj["avgh"]["value"]));
  $(".dev-minhum-value").html(checkDecimal(obj["minh"]["value"]));
  $(".dev-maxhum-value").html(checkDecimal(obj["maxh"]["value"]));
}

function getDeviceMsgHistory() {
  let slug = DOMAIN_KEY.toLowerCase();
  let api = "LHT65/between";
  let method = "post";
  let key = "";
  let token = USER_OBJ["token"];

  let obj = {
    authType: "TOKEN",
  };

  let fromTs = new Date(startDate).getTime();
  let toTs = new Date(endDate).getTime();

  let data = {
    devid: single_device_id,
    size: 100,
    sort: "desc",
    tz: MY_BROWSER_GMT,
    fdate: moment(fromTs).format("YYYY-MM-DD"),
    tdate: moment(toTs).format("YYYY-MM-DD"),
  };

  loading();

  executeMicroAPI(
    slug,
    api,
    method,
    data,
    key,
    token,
    obj,
    async (status, result) => {
      closeLoading();

      if (status) {
        renderTempHumChart(result["values"]);
        renderVoltageChart(result["values"]);
      }
    }
  );
}

function renderTempHumChart(list) {
  let xAxisArr1 = _.pluck(list, "temperature");
  let xAxisArr2 = _.pluck(list, "humidity");
  let updated_ts_arr = _.pluck(list, "updated_time");
  let yAxisArr = [];

  for (let i = 0; i < updated_ts_arr.length; i++) {
    yAxisArr.push(moment(updated_ts_arr[i]).format(DATE_TIME_FORMAT));
  }

  var dom = document.getElementById("tempHumChart");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  var app = {};

  var option;

  option = {
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        dataView: { readOnly: false },
        magicType: { type: ["line", "bar"] },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      data: yAxisArr,
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      axisLabel: {
        formatter: "{value} °C",
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 90,
      },
      {
        start: 0,
        end: 90,
      },
    ],
    series: [
      {
        name: "Temperature",
        type: "line",
        data: xAxisArr1,
      },
      {
        name: "Humidity",
        type: "line",
        data: xAxisArr2,
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
}

function renderVoltageChart(list) {
  let xAxisArr1 = _.pluck(list, "voltage");
  let updated_ts_arr = _.pluck(list, "updated_time");

  let yAxisArr = [];

  for (let i = 0; i < updated_ts_arr.length; i++) {
    yAxisArr.push(moment(updated_ts_arr[i]).format(DATE_TIME_FORMAT));
  }

  var dom = document.getElementById("voltageChart");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  var app = {};

  var option;

  option = {
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        dataView: { readOnly: false },
        magicType: { type: ["line", "bar"] },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      data: yAxisArr,
    },
    yAxis: {
      axisLabel: {
        formatter: "{value} V",
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 90,
      },
      {
        start: 0,
        end: 90,
      },
    ],
    series: [
      {
        name: "Voltage",
        type: "line",
        data: xAxisArr1,
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
}

function loadDateRanges(filterId) {
  var picker = $("#" + filterId);

  function cb(start, end, label) {
    var title = "";
    var range = "";

    startDate = start;
    endDate = end;

    if (new Date(start).getTime() === new Date(moment().startOf("day")).getTime()) {
      title = "Today:";
      range = start.format("MMM D, YYYY");
    } else if (
      new Date(start).getTime() ===
        new Date(moment().subtract(1, "day").startOf("day")).getTime() &&
      new Date(end).getTime() ===
        new Date(moment().subtract(1, "day").endOf("day")).getTime()
    ) {
      title = "Yesterday:";
      range = start.format("MMM D, YYYY");
    } else {
      range = start.format("MMM D, YYYY") + " - " + end.format("MMM D, YYYY");
    }

    $('#'+filterId+'Parent .range-text-span').html(title + ' ' + range).css('font-size', '10px');
    if (filterId === "deviceHistory" || filterId === "voltageHistory") {
      $('#deviceHistoryParent .range-text-span').html(title + ' ' + range).css('font-size', '10px');
      $('#voltageHistoryParent .range-text-span').html(title + ' ' + range).css('font-size', '10px');
      getDeviceMsgHistory();
    }
  }

  picker.daterangepicker(
    {
      opens: "left",
      drops: "auto",
      startDate: startDate,
      endDate: endDate,
      parentEl: "#" + filterId + "Parent",
      ranges: {
        Today: [moment().startOf("day"), moment().add(1,'days').endOf("day")],
        Yesterday: [
          moment().subtract(1, "days").startOf("day"),
          moment().endOf("day"),
        ],
        "Last 7 Days": [
          moment().subtract(6, "days").startOf("day"),
          moment().endOf("day"),
        ],
        "Last 30 Days": [
          moment().subtract(29, "days").startOf("day"),
          moment().endOf("day"),
        ],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );

  cb(startDate, endDate, "");
}
