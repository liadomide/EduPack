function fwdSpeedToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("conduction_speed").value = param.toString();
  }else{
    document.getElementById("conduction_speed").value = param.value;
  }
}

function fwdCouplingToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("coupling_parameters_option_Linear_a").value = param.toString();
  }else {
    document.getElementById("coupling_parameters_option_Linear_a").value = param.value;
  }
}

function fwdNoiseToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_nsig").value = param.toString();
  }else {
    document.getElementById("integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_nsig").value = param.value;
  }
}

function fwdK11ToSimulator(param){
  if(typeof(param) == "number"){
      document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K11").value = param.toString();
  }else {
    document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K11").value = param.value;
  }
}

function fwdK12ToSimulator(param){
  if(typeof(param) == "number"){
      document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K12").value = param.toString();
  }else {
    document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K12").value = param.value;
  }
}

function fwdModelToSimulator(){
  document.getElementById("model").value = "ReducedSetHindmarshRose";
  updateDivContent('data_model', document.getElementById("model"), '');
}

function fwdIntegratorToSimulator(){
  document.getElementById("integrator_HeunStochastic").value = "HeunStochastic";
  document.getElementById("integrator_HeunStochastic").checked = "checked";
  updateDivContent('data_integrator', null, '', document.getElementById("integrator_HeunStochastic"));
}

function fwdSimLengthToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("simulation_length").value = param.toString();
  }else {
    document.getElementById("simulation_length").value = param.value;
  }
}

function fwdMonitorsToSimulator(){
  document.getElementById("monitors").value = "SubSample";
  multipleSelect(document.getElementById("monitors"), 'data_monitors');
}

function fwdSubSampleTimeToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("monitors_parameters_option_SubSample_period").value = param.toString();
  }else {
    document.getElementById("monitors_parameters_option_SubSample_period").value = param.value;
  }
}



function generateStylesForOverlay(){
  var sheet = document.styleSheets[0];
  
  var tileWidth = 39,
    tileHeight = 147,
    numHorizontal = 21,
    numVertical = 5,
    posTop = 68,
    posLeft = 157,
    tilePosTop,
    tilePosLeft,
    link,
    hover_image_url;

  var gcf = ["0.05", "0.06", "0.07", "0.08", "0.09", "0.1", "0.11", "0.12", "0.13", "0.14", "0.15", "0.16", "0.17", "0.18", "0.19", "0.2", "0.21", "0.22", "0.23", "0.24", "0.25"];
  var cs = ["20", "40", "60", "80", "100"];
  
  for (var h = 0; h < numHorizontal; h++) {
    for (var v = 0; v < numVertical; v++) {  
  
      tilePosTop = posTop + v * tileHeight;
      tilePosLeft = posLeft + h * tileWidth;
      var strLinkID = "map_link_" + h + "_" + v;
      hover_image_url = "url('/static/js/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + cs[v] + "_CSF_" + gcf[h] + ".jpeg')";
      
      // sheet.addRule(".map_image #map_link_0_0", "width: 39px; height: 147px; top: 68px; left: 157px;", 1);
      sheet.addRule(".map_image #" + strLinkID,"width: " + tileWidth + "px; height: " + tileHeight + "px; top: " + tilePosTop + "px; left: " + tilePosLeft+ "px;", 1);
      
      link = "<a class=map_link id=" + strLinkID + " href=#></a>";  
      document.getElementById("map_param_exploration_5_subjects").innerHTML += link;
            
      // link hover action function
      $("#"+strLinkID).hover(function(){
        // use hash table to map tile id's to variable values
        alert("drin");
        $(".map_simulated_image").css('background-image',hover_image_url);
      });
        hover_image_url = "url('/static/js/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + 100 + "_CSF_" + 0.07 + ".jpeg')";
        $("#map_link_0_0").hover(function(){
          // use hash table to map tile id's to variable values
          $(".map_simulated_image").css('background-image',hover_image_url);
        });
        hover_image_url = "url('/static/js/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + 60 + "_CSF_" + 0.17 + ".jpeg')";
        $("#map_link_0_1").hover(function(){
          // use hash table to map tile id's to variable values
          $(".map_simulated_image").css('background-image',hover_image_url);
        });
        hover_image_url = "url('/static/js/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + 20 + "_CSF_" + 0.25 + ".jpeg')";
        $("#map_link_0_2").hover(function(){
          // use hash table to map tile id's to variable values
          $(".map_simulated_image").css('background-image',hover_image_url);
        });
    }
  }
}




function fcSlider_a() {
  var factor = 0.02;
  document.getElementById("overlayVal_a").value = parseInt(((document.getElementById("overlaySlider_a").value * factor) + 0.02)*100)/100.0;
    
  var pic = document.getElementById("img_fc_results");
  pic.src = "/static/js/sim_images/only_FC_for_BOLD/only_FC_for_BOLD_0" + parseInt(document.getElementById("overlayVal_a").value / factor - 0.02) + ".png";
}

function fcSlider_src2_a() {
  var factor = 0.02;
  document.getElementById("overlayVal_src2_a").value = parseInt(((document.getElementById("overlaySlider_src2_a").value * factor) + 0.02)*100)/100.0;
    
  var pic = document.getElementById("img_fc_results_src2");
  pic.src = "/static/js/sim_images/FC_for_BOLD/FC_for_BOLD_0" + parseInt(document.getElementById("overlayVal_src2_a").value / factor - 0.02) + ".png";  
}

function fcSlider_src3_a() {
  var factor = 0.01;
  document.getElementById("overlayVal_src3_a").value = parseInt(((document.getElementById("overlaySlider_src3_a").value * factor) + 0.03)*100)/100.0;
    
  var pic = document.getElementById("img_fc_results_src3");
  pic.src = "/static/js/sim_images/timeline_plotter/timeline_plotter_0" + parseInt((document.getElementById("overlayVal_src3_a").value / factor)-3) + ".png";
}


function fcSlider_speed() {
  var factor = 20;
  document.getElementById("overlayVal_speed").value = document.getElementById("overlaySlider_speed").value * factor;
}


function slider_5s_subs_d075_a004_02_cs20_40_60() {
  var speed_factor = 20;
  var speed = document.getElementById("speed_5s_subs_d075_a004_02_cs20_40_60").value;
  var coupling = document.getElementById("coupling_5s_subs_d075_a004_02_cs20_40_60").value;
  
  // set the values next to the sliders
  document.getElementById("val_coupling_5s_subs_d075_a004_02_cs20_40_60").value = coupling / 100.0 + 0.03;
  document.getElementById("val_speed_5s_subs_d075_a004_02_cs20_40_60").value = speed * speed_factor;
    
  // get adapted value
  speed = document.getElementById("val_speed_5s_subs_d075_a004_02_cs20_40_60").value;
  var picId = document.getElementById("img_5s_subs_d075_a004_02_cs20_40_60");
  picId.src = "/static/js/sim_images/pics_5s_subs_d0.75_a0.04_0.2_cs20_40_60/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".png";  
}

function slider_5s_subs_d075_10_25_a004_001_02_cs20_20_60() {
  var speed_factor = 20;
  var speed = document.getElementById("speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value;
  var coupling = document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value;
  var noise = document.getElementById("noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value;
  var noise_address;
  
  if(noise == 1){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = 0.75;
    noise_address = "0_75";
    // coupling 01..17 images, 0.04:0.01:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").max = 17;
    if(coupling > 17)
      coupling= 17;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = (coupling / 100.0 + 0.03).toFixed(3);
  }else if(noise == 2){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = 1.0;
    noise_address = "1_0";
    // coupling 01..31 images, 0.04:0.005:0.19
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").max = 31;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = (coupling / 100.0 / 2.0 + 0.035).toFixed(3);
  }else if(noise == 3){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = 2.5;
    noise_address = "2_5";
    // coupling 01..27 images, 0.07:0.005:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").max = 27;
    if(coupling > 27)
      coupling= 27;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = (coupling / 100.0 / 2.0 + 0.065).toFixed(3);
  }
  
  // set the values next to the sliders
  document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value = speed * speed_factor;
  
  // get adapted value
  speed = document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60").value;
  var picId = document.getElementById("img_5s_subs_d075_10_25_a004_001_02_cs20_20_60");
  picId.src = "/static/js/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".png";
}


function slider_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1() {
  var speed_factor = 20;
  var speed = document.getElementById("speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value;
  var coupling = document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value;
  var noise = document.getElementById("noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value;
  var noise_address;
  
  if(noise == 1){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = 0.75;
    noise_address = "0_75";
    // coupling 01..17 images, 0.04:0.01:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").max = 17;
    if(coupling > 17){
      coupling = 17;
    }
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = (coupling / 100.0 + 0.03).toFixed(3);
  }else if(noise == 2){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = 1.0;
    noise_address = "1_0";
    // coupling 01..31 images, 0.04:0.005:0.19
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").max = 31;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = (coupling / 100.0 / 2.0 + 0.035).toFixed(3);
  }else if(noise == 3){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = 2.5;
    noise_address = "2_5";
    // coupling 01..27 images, 0.07:0.005:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").max = 27;
    if(coupling > 27)
      coupling= 27;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = (coupling / 100.0 / 2.0 + 0.065).toFixed(3);
  }
  
  // set the values next to the sliders
  document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value = speed * speed_factor;
  
  // get adapted value
  speed = document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1").value;
  var picId = document.getElementById("img_5s_subs_d075_10_25_a004_001_02_cs20_20_60_1");
  picId.src = "/static/js/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
}

function slider_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2() {
  var speed_factor = 20;
  var speed = document.getElementById("speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value;
  var coupling = document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value;
  var noise = document.getElementById("noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value;
  var noise_address;
  
  if(noise == 1){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = 0.75;
    noise_address = "0_75";
    // coupling 01..17 images, 0.04:0.01:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").max = 17;
    if(coupling > 17)
      coupling= 17;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = (coupling / 100.0 + 0.03).toFixed(3);
  }else if(noise == 2){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = 1.0;
    noise_address = "1_0";
    // coupling 01..31 images, 0.04:0.005:0.19
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").max = 31;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = (coupling / 100.0 / 2.0 + 0.035).toFixed(3);
  }else if(noise == 3){
    document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = 2.5;
    noise_address = "2_5";
    // coupling 01..27 images, 0.07:0.005:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").max = 27;
    if(coupling > 27)
      coupling= 27;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = (coupling / 100.0 / 2.0 + 0.065).toFixed(3);
  }
  
  // set the values next to the sliders
  document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value = speed * speed_factor;
  
  // get adapted value
  speed = document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2").value;
  var picId = document.getElementById("img_5s_subs_d075_10_25_a004_001_02_cs20_20_60_2");
  picId.src = "/static/js/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
}

function slider_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3() {
  var speed_factor = 20;
  var speed = document.getElementById("speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value;
  var coupling = document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value;
  var noise = 3;
  var noise_address;
  
  if(noise == 1){
    noise_address = "0_75";
    // coupling 01..17 images, 0.04:0.01:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").max = 17;
    if(coupling > 17)
      coupling= 17;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = (coupling / 100.0 + 0.03).toFixed(3);
  }else if(noise == 2){
    noise_address = "1_0";
    // coupling 01..31 images, 0.04:0.005:0.19
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").max = 31;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = (coupling / 100.0 / 2.0 + 0.035).toFixed(3);
  }else if(noise == 3){
    noise_address = "2_5";
    // coupling 01..27 images, 0.07:0.005:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").max = 27;
    if(coupling > 27)
      coupling= 27;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = (coupling / 100.0 / 2.0 + 0.065).toFixed(3);
  }
  
  // set the values next to the sliders
  document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = speed * speed_factor;
  
  // get adapted value
  speed = document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value;
  
  var picId = document.getElementById("img_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3");
  picId.src = "/static/js/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
}

function slider_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4() {
  var speed_factor = 20;
  var speed = document.getElementById("speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value;
  var coupling = document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value;
  var noise = 3;
  var noise_address;
  
  if(noise == 1){
    // document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = 0.75;
    noise_address = "0_75";
    // coupling 01..17 images, 0.04:0.01:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").max = 17;
    if(coupling > 17)
      coupling= 17;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = (coupling / 100.0 + 0.03).toFixed(3);
  }else if(noise == 2){
    // document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = 1.0;
    noise_address = "1_0";
    // coupling 01..31 images, 0.04:0.005:0.19
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").max = 31;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = (coupling / 100.0 / 2.0 + 0.035).toFixed(3);
  }else if(noise == 3){
    // document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = 2.5;
    noise_address = "2_5";
    // coupling 01..27 images, 0.07:0.005:0.2
    document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").max = 27;
    if(coupling > 27)
      coupling= 27;
    document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = (coupling / 100.0 / 2.0 + 0.065).toFixed(3);
  }
  
  // set the values next to the sliders
  document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value = speed * speed_factor;
  
  // get adapted value
  speed = document.getElementById("val_speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4").value;
  var picId = document.getElementById("img_5s_subs_d075_10_25_a004_001_02_cs20_20_60_4");
  
  picId.src = "/static/js/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
}


function slider_15s_D075_a012_cs100_K11_0_5_K12_0_25() {
  var K12_factor = 0.25;
  var K11_factor = 0.5;
  var K11 = document.getElementById("K11_15s_D075_a012_cs100_K11_0_5_K12_0_25").value;
  var K12 = document.getElementById("K12_15s_D075_a012_cs100_K11_0_5_K12_0_25").value;
  
  // set the values next to the sliders
  document.getElementById("val_K11_15s_D075_a012_cs100_K11_0_5_K12_0_25").value = K11 * K11_factor;
  document.getElementById("val_K12_15s_D075_a012_cs100_K11_0_5_K12_0_25").value = K12 * K12_factor;
  
  // get adapted value
  K11 = document.getElementById("val_K11_15s_D075_a012_cs100_K11_0_5_K12_0_25").value;
  K12 = document.getElementById("val_K12_15s_D075_a012_cs100_K11_0_5_K12_0_25").value;
  
  var picId = document.getElementById("img_15s_D075_a012_cs100_K11_0_5_K12_0_25");
  
  picId.src = "/static/js/sim_images/timelineplotter_15s_D0.75_a0.12_cs100_K11_5_K12_2.5/K12_" + K12 + "_K11_" + K11 + ".png";  
}


function slider_150s_Bold_cs_20_40_60_a01_003_016() { 
  var speed_factor = 20;
  var coupling_factor = 0.03;
  var speed = document.getElementById("speed_150s_Bold_cs_20_40_60_a01_003_016").value;
  var coupling = document.getElementById("coupling_150s_Bold_cs_20_40_60_a01_003_016").value;
  
  // set the values next to the sliders
  document.getElementById("val_coupling_150s_Bold_cs_20_40_60_a01_003_016").value = coupling * coupling_factor + 0.07;
  document.getElementById("val_speed_150s_Bold_cs_20_40_60_a01_003_016").value = speed * speed_factor;
  
  // get adapted value
  coupling = document.getElementById("val_coupling_150s_Bold_cs_20_40_60_a01_003_016").value;
  var picId = document.getElementById("img_150s_Bold_cs_20_40_60_a01_003_016");
  
  picId.src = "/static/js/sim_images/pics_150s_Bold_cs_20_40_60_a0.1_0.03_0.16/a_" + coupling + "/FC_for_BOLD_" + zeroPad(parseInt(speed), 2) + ".png";  
}
