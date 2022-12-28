let device_arr_list = [];

$(document).ready(function(){

    onInit();
});

function onInit(){
  getDeviceStatus();
}

function deviceFilter(){
  
}

function getDeviceStatus() {

    let slug = DOMAIN_KEY.toLowerCase();
    let api = "LHT65/list";
    let method = "post";
    let key = "";
    let token = USER_OBJ["token"];

    let obj = {
      authType: "TOKEN",
    };

    let data = {
      domain_key: DOMAIN_KEY,
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
          device_arr_list = result["values"];
          loadDeviceStatus();
        }else{
          $(".condition-dom").hide();
          $("#noDataAvailable").show();
        }
      }
    );
  }

function loadDeviceStatus(){

  if(device_arr_list.length > 0){

      let devHtml = ``;
      $("#loadDeviceList").html("");

      for(let i=0;i<device_arr_list.length;i++){

        let oneDev = device_arr_list[i];
        let devid = oneDev["devid"];

          devHtml += `<a href="javascript:void(0);" style="padding:0" onclick="loadSnapshotPage('`+devid+`')" id="devLi_`+devid+`" class="temp-dev-li list-group-item list-group-item-action" aria-current="true">
                        <div class="d-flex w-100 justify-content-between p-10">
                          <h5 class="mb-1"><i class="fa fa-hdd"></i> <span>`+devid+`</span> <i class="fa fa-files-o" title="Copy Raw Data"></i></h5>
                          <small><i class="fa fa-clock-o"></i> <span>`+moment(oneDev["updated_time"]).fromNow()+`</span></small>
                       </div>
                       <div style="padding: 10px; background: #fafafa; border-top: 1px solid #eeeeee;color:#363636 !important;">
                          <table style="width:100%;font-size:11px;text-align:center;">
                              <tr>
                                <th><i class="fa fa-thermometer-three-quarters"></i>  Temp</th>
                                <th><i class="fa fa-tint"></i>  Hum</th>
                                <th><i class="fa fa-bolt"></i>  Volt.</th>
                              </tr>
                              <tr>
                                <td>`+checkDecimal(oneDev["temperature"])+`<sup>&deg;</sup>C</td>
                                <td>`+checkDecimal(oneDev["humidity"])+`g/m3</td>
                                <td>`+checkDecimal(oneDev["voltage"])+`v</td>
                              </tr>
                          </table>
                       </div>
                    </a>`;
      }

      $("#loadDeviceList").html(devHtml);
      $("#devLi_"+device_arr_list[0]["devid"]).addClass("active");
      loadSnapshotPage(device_arr_list[0]["devid"]);

  }else{

    $("#loadDeviceList").html(`
        <br />
        <br />
        <br />
        <br />
        <h3 style="color: gray">Device not available</h3>
        <h5 style="color: gray">
            <i class="fa fa-info-circle"></i> Data not found
        </h5>
    `);

  }
};

function loadSnapshotPage(devId){

  $(".daterangepicker").remove();
  $(".temp-dev-li").removeClass("active");
  $("#devLi_"+devId).addClass("active");

  $('#deviceSnapshotLoader').html("");

  $.ajax({
    type: 'GET',
    url: "snapshot/"+devId,
    dataType: 'html',
    success: function (response){
       $('#deviceSnapshotLoader').html(response);
    },
    error: function (response){
      //  $('#deviceSnapshotLoader').html(response);
    }
  });
}