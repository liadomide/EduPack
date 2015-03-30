// ---------------------------------------------------------
//              EDUPACK RELATED FUNCTIONS
// ---------------------------------------------------------


var FLAG_edupackActive = false;
var FLAG_HelperElementsActive = null;
var FLAG_tutorialCheck = false;
var FLAG_devTutorialCheck = false;
var FLAG_recheck = false;
var FLAG_showHighlightArrow = false;
var FLAG_compareHighlights = false;
var FLAG_correctParameters = true;
var FLAG_eduCase = false;
var FLAG_showAnimationArrow = false;

var hashMap;
var highlight_arrow_position;
var arrow_offset_top = -70;
var arrow_offset_left = 55;
var current_highlight_arrow_position = 0;

// colors of helper elements (menu color etc.)
var descriptionTypeColor = "4DA83F";
var parameterTypeColor = "EB4F2D";
var miscTypeColor = "0000FF";

var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove (small overlay windows)
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _debug = $('debug');    // makes life easier

var FLAG_overlay_new;
var FLAG_showEduPackHelp_description_active = false;
var FLAG_showEduPackHelp_parameter_active = false;
var FLAG_showEduPackHelp_misc_active = false;
var FLAG_parameters = false;

var _currentMouseX = 0;
var _currentMouseY = 0;

var parameterCheckHash;
var projectXML;

var xmlDataDetailDescriptions;
var genericOffset;

/*
 * script is integrated into TVB base_template.html and will directly loaded
 * into the system.
 * so the edupack will be loaded too, but not visualized at the start
 * TODO: change this and load it when getting activated?
 */
$(document).ready(function() {
  
  // call function to create and load variable mapping in HashMap
  createVariableMapping();
  activeActions = new HashTable();
  loadXMLDetailDescriptions();
  
  // map a function to event
  document.onmousedown = OnMouseDown;
  document.onmouseup = OnMouseUp;
  
  // randomized offset value for "non-static" element positioning
  genericOffset = Math.floor((Math.random()*12)-6);
  
  $(document).addClass('.map_image #map_link_0 { width: 35px; height: 146px; top: 68px; left: 157px;}');
    
  /*
   * reads a hardcoded xml tutorial file,
   * when reading was successful, start to parse and generate EduPack
   * visuals out of it (menu, tasks, ...)
   */
  $.ajax({
    type: "GET",
    // url: "/static/js/edupack/xml/edupack_xml_tutorial.xml",
    // url: "/static/js/edupack/xml/edupack_xml_tutorial_randy.xml",
    url: "/static/js/edupack/xml/edupack_xml_tutorial_thesis.xml",
    dataType: "xml",
    // function's called, when file is readable
    success: function(xml) { parseXMLTutorial(xml); },
    // function's called when file is not readable 
    error: function (xhr, ajaxOptions, thrownError){ 
      document.getElementById("tutorial-area").innerHTML="<font color='#ff0000'>1: "+xhr.status + ", 2: " + thrownError + "</font>";
      } 
  });
  
  $(document).addClass('.map_image #map_link_0 { width: 35px; height: 146px; top: 68px; left: 157px;}');

  jQuery("#div-simulator-parameters").scroll(function() {
    if($('.showEduPackHelp_parameter').is(':checked')){
      deleteXMLDetailDescriptionElements("parameter");
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "parameter");
    }
  });
});


/*
 * function parses a given xml tutorial file and 
 * creates the frontend and design out of the content
 */
function parseXMLTutorial(data) {

  var output = '',
      stepId,
      subStepValue,
      subStepType,
      subStepAddress,
      manualFinishLink,
      contentString,
      button_title,
      numberMenuEntries = {};
  
  // can be used to read tvb project xml files
  //loadProjectXML();
  
  // generate the HTML Code for the EduPack, filled with the content from the xml
  output +='<div><h2 align="center"><u>' + $(data).find("title").text() + '</u></h2></div><br/>';
  output +='<div class="tutorial_area" id="tutorial_area">';
  output += '<input type="checkbox" name="showEduPackHelp_description" id="showEduPackHelp_description" class="showEduPackHelp_description" value="showEduPackHelp_description"><img width=5% height=5% valign=bottom src=/static/style/img/edupack/jessica/bolder_icons/icons_sky12_BOLD_48.png> TVB-GUI Helper&nbsp;&nbsp;&nbsp;&nbsp;';
  output += '<input type="checkbox" name="showEduPackHelp_parameter" id="showEduPackHelp_parameter" class="showEduPackHelp_parameter" value="showEduPackHelp_parameter"><img  valign=bottom width=5% height=4% src=/static/style/img/edupack/jessica/bolder_icons/icons_orange12_BOLD_48.png> TVB-parameter Helper&nbsp;&nbsp;&nbsp;';
  output += '<input type="checkbox" name="showEduPackHelp_misc" id="showEduPackHelp_misc" class="showEduPackHelp_misc" value="showEduPackHelp_misc"><img width=5% height=10% valign=bottom src=/static/style/img/edupack/jessica/bolder_icons/icons_gold12_BOLD_48.png> TVB-Misc<br/>';

  output += '<input type="range" onchange="changeLinkOpacity(event)" value="80" max="100" min="0" id="sliderLinkOpacityValue"><br/>';
  output += '<u>Description:</u> <br/>' + $(data).find("description").text() + '<br/><br/>';
  
  // Batch Generator
  output += '<a href="#" class=batchscript_button onclick=onButtonCreateBatchPressed() active=false>./Create_Batch_Script</a><br/><br/>';
    
  output += '<ul class="tutorial-step" id="tutorial-step">';
  $(data).find("step").each(function() {
    stepId = $(this).find("step-id").text(); 
    output += '<li id="' + stepId + '" class="introduction">' +
              '<a href="#' + stepId + '">';
    output += 'Step ' + stepId + ': ';
    output += $(this).find("label").text();
    output += '<span id="span_' + stepId + '">' + $(this).find("sub-step").size() + '</span></a>';
    
    numberMenuEntries[stepId] =  $(this).find("sub-step").size();
    
    output += '<ul class="sub-step">';
      $(this).find("sub-step").each(function() {  
        subStepValue = $(this).find("value").text();
        subStepType = $(this).find("type").text();
        subStepAddress = stepId + '_' + subStepValue;
        output +=   '<li id="' + subStepAddress + '" class="sub-introduction">' +
                    '<a href="#' + subStepAddress + '" id="' + subStepAddress + '">';
            if(subStepType.toLowerCase() == "description"){
              output += '<font color="#' + descriptionTypeColor + '">';
            } else if(subStepType.toLowerCase() == "parameter"){
              output += '<font color="#' + parameterTypeColor + '">';
            } else if(subStepType.toLowerCase() == "misc"){
              output += '<font color="#' + miscTypeColor + '">';
            }
            output += 'Task ' + subStepValue + ': ';
            output += $(this).find("task").text() + "</font>";
            output += '<span id="span_' + subStepAddress + '">open</span></a>';
            output += '<p class="detail-step" id="detail_' + subStepAddress +'">';
    
        var content = $(this).find("detail").text();
        // output += '<font align="right"><a href=# onclick="readOutLoud(\'' + content.replace(/(\r\n|\n|\r)/gm,"") + '\')"><img src="/static/style/img/edupack/speaker.png" valign="bottom">&nbsp;&nbsp;readOutLoud</a></font>';
        output += content;
        // TODO what happens if there's no manual link
        // TODO show achievement list for automated goals
        manualFinishLink = $(this).find("finish_constraints").find("manual").text();
        $(this).find("overlay").each(function() { 
          contentString = $(this).find("content").text().replace(/(\r\n|\n|\r)/gm,"");
          
          var methodName = "actionOverlay('display', '" + contentString + "')";
          output += '<a href="#" class=overlay_button onclick="' + methodName + '"><font color ="#DDDDDD">Info</font></a>';
        });

        $(this).find("animation").each(function() {
          contentString = $(this).find("content").text().replace(/(\r\n|\n|\r)/gm,"");
          var subtitle = $(this).find("description").text().replace(/(\r\n|\n|\r)/gm,"");
          
          var methodName = "actionOverlay('display', '" + contentString + "')";

          output += '<a href="#" class="pic-link" onclick="' + methodName + '"><img src=/static/style/img/edupack/anim00_preview.png width="350" style="margin:0px; padding:0px; border: 1px solid #000000;">';
          if(subtitle != null){
            output += '<span>' + subtitle + '<span></a><br><br>';
          }
          else {
            output += '</a><br>';
          }
              
        });

        $(this).find("read_project_xml").each(function() {  
          var method = "checkParametersFromHash();";
          output += '<a href="#" onclick="' + method + '">Click here to load the XML.</a><br/><span id="read_project_xml"></span>';
        });

        output += '<a href="#" id="' + subStepAddress + '">' + manualFinishLink + '</a>';
        output += '</p></li>';
      });
      
      output += '</ul>';
      output += '</li>';
  });
  output += '</ul></div>';
  document.getElementById("edupackOverlay").innerHTML=output;
    
  var animation_arrow_div = $(document.createElement("div"));
  animation_arrow_div.attr({
    id : "animation_arrow",
    "class" : "animation_arrow" 
  });
  $("body").append(animation_arrow_div);
  

/* 
 * functionality and behavior of different EduPack DOM elements
 * e.g. menu and submenu structure (open, close, open tasks etc.)
 */
  var tutorial_head = $('.tutorial-step > li > a'),
    tutorial_body = $('.tutorial-step li > .sub-menu'),
    tutorial_substep_head = $('.sub-step > li > a'),
    tutorial_substep_body = $('.sub-step li > .detail-menu'),
    detail_completed =  $('.detail-step a');


  document.getElementById("showEduPackHelp_parameter").onclick = function(e){
    if(document.getElementById("showEduPackHelp_parameter").checked){
      localStorage.setItem("helper_parameter", "true");
      document.getElementById("sliderLinkOpacityValue").disabled= false;
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "parameter");
      setHelperElementsActive(true);
    } else {
      localStorage.setItem("helper_parameter", "false");
      deleteXMLDetailDescriptionElements("parameter");
      if(!document.getElementById("showEduPackHelp_description").checked && 
         !document.getElementById("showEduPackHelp_parameter").checked && 
         !document.getElementById("showEduPackHelp_misc").checked) {
              
        document.getElementById("sliderLinkOpacityValue").disabled= true;
        setHelperElementsActive(false);
      }
    }
  }
  
  document.getElementById("showEduPackHelp_description").onclick = function(e){
    if(document.getElementById("showEduPackHelp_description").checked == true){
      localStorage.setItem("helper_description", "true");
      document.getElementById("sliderLinkOpacityValue").disabled = false;
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "description");
      setHelperElementsActive(true);
    } else {
      localStorage.setItem("helper_description", "false");
      deleteXMLDetailDescriptionElements("description");
      if(!document.getElementById("showEduPackHelp_description").checked && 
         !document.getElementById("showEduPackHelp_parameter").checked && 
         !document.getElementById("showEduPackHelp_misc").checked) {
           
        document.getElementById("sliderLinkOpacityValue").disabled= true;
        setHelperElementsActive(false);
      }
    }
  }
  
  document.getElementById("showEduPackHelp_misc").onclick = function(e){
    if(document.getElementById("showEduPackHelp_misc").checked){
      localStorage.setItem("helper_misc", "true");
      document.getElementById("sliderLinkOpacityValue").disabled= false;
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "misc");
      setHelperElementsActive(true);
    } else {
      localStorage.setItem("helper_misc", "false");
      deleteXMLDetailDescriptionElements("misc");
      if(!document.getElementById("showEduPackHelp_description").checked && 
         !document.getElementById("showEduPackHelp_parameter").checked && 
         !document.getElementById("showEduPackHelp_misc").checked) {
           
        document.getElementById("sliderLinkOpacityValue").disabled= true;
        setHelperElementsActive(false);
      }
    }
  }

  var latest_step = localStorage.getItem("latest_step");
  var latest_task = localStorage.getItem("latest_task");
  
  if(latest_step == null || latest_task == null){
    latest_step = "0";
    latest_task = "1";
  }
  
  // return and open last task  
  var latest_task_int = parseInt(latest_task-1);
  for(var i = 0; i < latest_step; i++){
    latest_task_int += numberMenuEntries['0'+i]
  }
  latest_task = latest_task_int.toString();
  
  tutorial_head.eq(latest_step).addClass('active').next().slideDown('normal');
  var stepId = tutorial_substep_head.eq(latest_task).attr("id").substr(0, tutorial_substep_head.eq(latest_task).attr("id").indexOf('_'));
  var taskId = tutorial_substep_head.eq(latest_task).attr("id").substr(tutorial_substep_head.eq(latest_task).attr("id").indexOf('_')+1, tutorial_substep_head.eq(latest_task).attr("id").length);
  
  localStorage.setItem("latest_step", stepId);
  localStorage.setItem("latest_task", taskId);
  unloadActions(data, stepId, taskId);
  if(checkForPrecondition(data, stepId, taskId)){
    // Show and hide the tabs on click
    if (tutorial_substep_head.eq(latest_task).attr('class') != 'active'){
      // mark it as "active" when task is not already done and open
      if (document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML.indexOf("done") == -1){
        document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML="<font color='#ff0000'>active</font>";
        tutorial_substep_head.eq(latest_task).addClass('active');
      }
      tutorial_substep_body.slideUp('normal');
      tutorial_substep_head.eq(latest_task).next().stop(true,true).slideToggle('normal');
      
      /*
       * get step and task id of current opening detail task
       * check in xml if there are any actions within this task
       * TODO: deactivate the actions of all other open tasks
       */
      // checkForActions(data, stepId, taskId);
      
    } else {
      // mark it as "open" when it is not already done and closed (default and after closing)
      if (document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML.indexOf("done") == -1){
        document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML="<font color='#797979'>open</font>";
        tutorial_substep_head.eq(latest_task).removeClass('active');
      }
      tutorial_substep_body.slideUp('normal');
      tutorial_substep_head.eq(latest_task).next().stop(true,true).slideToggle('normal');
      unloadActions(data, stepId, taskId);
    }      
  }
  
  document.body.onclick = function(e){
    if (FLAG_recheck)
      launchNewBurst("new");
    if(FLAG_compareHighlights)
      launchNewBurst("new");
    if(!FLAG_correctParameters)
      checkParametersFromHash();
  }
  
  /*
   * Behaviour of the Tutorial Step elements after clicking to show the tasks / sub-steps
   */
  tutorial_head.on('click', function(event) {
    // Disable header links
    event.preventDefault();
    // Show and hide the tabs on click
    if ($(this).attr('class') != 'active'){
      
      tutorial_body.slideUp('normal');
      $(this).next().stop(true,true).slideToggle('normal');
      $(this).addClass('active');
    } else {
      tutorial_body.slideUp('normal');
      $(this).next().stop(true,true).slideToggle('normal');
      $(this).removeClass('active');
    }
  });
  
  /*
   * Behaviour of the Tutorial Sub-Step elements after clicking to show the details
   */
  tutorial_substep_head.on('click', function(event) {
    
    // Disable header links
    event.preventDefault();
    
    var stepId = $(this).attr("id").substr(0, $(this).attr("id").indexOf('_'));
    var taskId = $(this).attr("id").substr($(this).attr("id").indexOf('_')+1, $(this).attr("id").length);
    
    localStorage.setItem("latest_step", stepId);
    localStorage.setItem("latest_task", taskId);
    
    if(checkForPrecondition(data, stepId, taskId)){
      // Show and hide the tabs on click
      if ($(this).attr('class') != 'active'){
        // mark it as "active" when task is not already done and open
        if (document.getElementById("span_" + $(this).attr("id")).innerHTML.indexOf("done") == -1){
          document.getElementById("span_" + $(this).attr("id")).innerHTML="<font color='#ff0000'>active</font>";
          $(this).addClass('active');
        }
        tutorial_substep_body.slideUp('normal');
        $(this).next().stop(true,true).slideToggle('normal');
        
        /*
         * get step and task id of current opening detail task
         * check in xml if there are any actions within this task
         * TODO: deactivate the actions of all other open tasks
         */
        checkForActions(data, stepId, taskId);

      } else {
        // mark it as "open" when it is not already done and closed (default and after closing)
        if (document.getElementById("span_" + $(this).attr("id")).innerHTML.indexOf("done") == -1){
          document.getElementById("span_" + $(this).attr("id")).innerHTML="<font color='#797979'>open</font>";
          $(this).removeClass('active');
        }
        
        tutorial_substep_body.slideUp('normal');
        $(this).next().stop(true,true).slideToggle('normal');
        unloadActions(data, stepId, taskId);
      }      
    }
  });
  
  
  /*
   * Behavior for the manual finish links in detail-steps 
   * which will mark the tutorial_substep / task as "done"
   */
  detail_completed.on('click', function(event) {
    
    // Disable header links
    event.preventDefault();
    
    var stepId = $(this).attr("id").substr(0, $(this).attr("id").indexOf('_'));
    var taskId = $(this).attr("id").substr($(this).attr("id").indexOf('_')+1, $(this).attr("id").length);
    
    //when not already completed, set class to completed and mark the tutorial_substep as "done"
    if (($(this).attr('class') != 'completed') ){ 
      document.getElementById("span_" + $(this).attr("id")).innerHTML="<font color='#45a23e'>done</font>";
      $(this).addClass('completed');

      /*
       * retrieve the span element of the parent (step), to get the number of open tasks and
       * reduce it, if another tasks is finished
       */
      var parentSpanElement = document.getElementById("span_" + ($(this).attr("id").substr(0, $(this).attr("id").indexOf('_'))));
      var numOpenTasks = parentSpanElement.innerHTML - 1; 
      parentSpanElement.innerHTML = numOpenTasks;
      unloadActions(data, stepId, taskId);

      if (($(this).attr('class') == 'completed') ){
        $(this).parent().slideUp('normal');
        $(this).parent().next().stop(true,true).slideToggle('normal');
        
        setTimeout(function(){
          
          var latest_step = localStorage.getItem("latest_step");
          var latest_task = localStorage.getItem("latest_task");
          var latest_task_int = parseInt(latest_task);
          
          for (var i = 0; i < latest_step; i++){
            latest_task_int += numberMenuEntries['0'+i];
          }
          var max_task_current_step = latest_task_int;
          for (var i = latest_step-1; i >= 0; i--){
            max_task_current_step -= numberMenuEntries['0'+i];
          }
          
          latest_task = latest_task_int.toString();  
          
          // TODO
          // simulatedClick(document.getElementById("01_02"));
          // alert(numberMenuEntries[latest_step] + ", " + latest_task + ", " + max_task_current_step);
          
          if(numberMenuEntries[latest_step] == max_task_current_step){  
            tutorial_head.eq(latest_step).addClass('active').next().slideUp('normal');
            setTimeout(function(){
              latest_step = "0" + (parseInt(latest_step) + 1);
              tutorial_head.eq(latest_step).addClass('active').next().slideDown('normal');
            }, 800);
          }
          
          var stepId = tutorial_substep_head.eq(latest_task).attr("id").substr(0, tutorial_substep_head.eq(latest_task).attr("id").indexOf('_'));
          var taskId = tutorial_substep_head.eq(latest_task).attr("id").substr(tutorial_substep_head.eq(latest_task).attr("id").indexOf('_')+1, tutorial_substep_head.eq(latest_task).attr("id").length);
          
          // save latest open element in localStorage of local browser
          localStorage.setItem("latest_step", stepId);
          localStorage.setItem("latest_task", taskId);
          
          // checks for defined preconditions  
          if(checkForPrecondition(data, stepId, taskId)){
            
            // Show and hide the tabs on click
            if (tutorial_substep_head.eq(latest_task).attr('class') != 'active'){
              // mark it as "active" when task is not already done and open
              if (document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML.indexOf("done") == -1){
                document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML="<font color='#ff0000'>active</font>";
                tutorial_substep_head.eq(latest_task).addClass('active');
              }
              tutorial_substep_body.slideUp('normal');
              tutorial_substep_head.eq(latest_task).next().stop(true,true).slideToggle('normal');
              
              /*
               * get step and task id of current opening detail task
               * check in xml if there are any actions within this task
               * TODO: deactivate the actions of all other open tasks
               */
              checkForActions(data, stepId, taskId);
            } 
            else {
              // mark it as "open" when it is not already done and closed (default and after closing)
              if (document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML.indexOf("done") == -1){
                document.getElementById("span_" + tutorial_substep_head.eq(latest_task).attr("id")).innerHTML="<font color='#797979'>open</font>";
                tutorial_substep_head.eq(latest_task).removeClass('active');
              }
              
              tutorial_substep_body.slideUp('normal');
              tutorial_substep_head.eq(latest_task).next().stop(true,true).slideToggle('normal');
              unloadActions(data, stepId, taskId);
            }      
          }
        }, 800);
      } 
    }
  });
  
  // checks for latest saved configuration and loads Helper elements if configured
  checkAndLoadHelpElements();
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


function setHelperElementsActive(value){
  
  if(value != FLAG_HelperElementsActive){
    FLAG_HelperElementsActive = value;
  }
}


function simulatedClick(target, options) {
  var event = target.ownerDocument.createEvent('MouseEvents'),
      options = options || {};
  
  //Set your default options to the right of ||
  var opts = {
      type: options.type                  || 'click',
      canBubble:options.canBubble             || true,
      cancelable:options.cancelable           || true,
      view:options.view                       || target.ownerDocument.defaultView, 
      detail:options.detail                   || 1,
      screenX:options.screenX                 || 0, //The coordinates within the entire page
      screenY:options.screenY                 || 0,
      clientX:options.clientX                 || 0, //The coordinates within the viewport
      clientY:options.clientY                 || 0,
      ctrlKey:options.ctrlKey                 || false,
      altKey:options.altKey                   || false,
      shiftKey:options.shiftKey               || false,
      metaKey:options.metaKey                 || false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
      button:options.button                   || 0, //0 = left, 1 = middle, 2 = right
      relatedTarget:options.relatedTarget     || null,
  }

  //Pass in the options
  event.initMouseEvent(
      opts.type,
      opts.canBubble,
      opts.cancelable,
      opts.view, 
      opts.detail,
      opts.screenX,
      opts.screenY,
      opts.clientX,
      opts.clientY,
      opts.ctrlKey,
      opts.altKey,
      opts.shiftKey,
      opts.metaKey,
      opts.button,
      opts.relatedTarget
  );
  //Fire the event
  target.dispatchEvent(event);
}



function zeroPad(num, places){
  var zero = places - num.toString().length + 1;
  return Array(+(zero>0 && zero)).join("0") + num;
}

function changeLinkOpacity() {
  var opac = document.getElementById('sliderLinkOpacityValue').value / 100.;
  $('.linkOverlay_elements_description').css('opacity', opac);
  $('.linkOverlay_elements_parameter').css('opacity', opac);
  $('.linkOverlay_elements_misc').css('opacity', opac);
}


function OnMouseDown(e) {
  // IE is retarded and doesn't pass the event object
  if (e == null) 
      e = window.event; 
  
  // IE uses srcElement, others use target
  var target = e.target != null ? e.target : e.srcElement;
  
  _currentMouseX = e.clientX;
  _currentMouseY = e.clientY;

  // for IE, left click == 1
  // for Firefox, left click == 0
  if ((e.button == 1 && window.event != null || 
      e.button == 0) && 
    target.className == 'helpOverlay_modal_box')
  {
    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;
    
    if(FLAG_overlay_new){
      _offsetX = _startX;
      _offsetY = _startY;
      FLAG_overlay_new = false;
    }else {
      _offsetX = ExtractNumber(target.style.left);
      _offsetY = ExtractNumber(target.style.top);
    }
    
    // we need to access the element in OnMouseMove
    _dragElement = target;

    // tell our code to start moving the element with the mouse
    document.onmousemove = OnMouseMove;
    
    // cancel out any text selections
    document.body.focus();

    // prevent text selection in IE
    document.onselectstart = function () { return false; };
    // prevent IE from trying to drag an image
    target.ondragstart = function() { return false; };
    
    // prevent text selection (except IE)
    return false;
  }
}

function OnMouseMove(e) {
  if (e == null) 
    var e = window.event; 

  // this is the actual "drag code"
  _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
  _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
}


function OnMouseUp(e)
{
  if (_dragElement != null){
    _dragElement.style.zIndex = _oldZIndex;

      document.onmousemove = null;
      document.onselectstart = null;
      _dragElement.ondragstart = null;

      // this is how we know we're not dragging      
      _dragElement = null;     
  }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
  
    return n == null || isNaN(n) ? 0 : n;
}

/*
 * reads a xml file with detailed information about parameters, etc.
 * when reading was successful, and help requested, EduPack will integrate elements into the site
 */
function loadXMLDetailDescriptions(){
  $.ajax({
    type: "GET",
    url: "/static/js/edupack/xml/edupack_xml_detail_descriptions_randy.xml",
    dataType: "xml",
    // function's called, when file is readable
    success: function(xml) { xmlDataDetailDescriptions  = xml },
    // function's called when file is not readable 
    error: function (xhr, ajaxOptions, thrownError){ 
      document.getElementById("tutorial-area").innerHTML="<font color='#ff0000'>1: "+xhr.status + ", 2: " + thrownError + "</font>";
      // alert(xhr.status);
      // alert(thrownError);
      } 
  });
}


/*
 * method parses a given xml structure
 * all "description" elements will create helper links at the position of the name
 * and the overlay content of description
 */
function parseXMLDetailDescriptions(data, who){
  
  var name, 
      content, 
      group, 
      section, 
      type; 
  
  $(data).find("description").each(function() {

    section = $(this).attr("section");
    if(section == "all"){
      section = document.documentElement.id;
    }
    // check if current section and the section from edupack_xml_detail element match, otherwise continue
    if(section == document.documentElement.id || section == "s-burst"){
      type = $(this).attr("type");
      if(type == who){
        name = $(this).attr("name");
        group = $(this).attr("group");
        
        // problems with forwarding strings with linebreaks, eliminate them
        content = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
        
        if($(this).attr("read") == "true"){
          addHelperElements(section, group, name, content, type, null, true);
        }else {
          addHelperElements(section, group, name, content, type, null, false);
        }
      }       
    }
  });
  
  return true;
}

/*
 * method parses a given xml structure
 * all "description" elements will create helper links at the position of the name
 * and the overlay content of description
 */
function parseSpecialXMLDetailDescriptions(data){
  
  var name, 
      content, 
      type, 
      section, 
      group, 
      read;
       
  $(data).find("description").each(function() {
    section = $(this).attr("section");

    // check if current section and the section from edupack_xml_detail element match, otherwise continue
    if(section == document.documentElement.id){
      if($(this).attr("inOverlay") == "true"){
        
        name = $(this).attr("name");
        type = $(this).attr("type");
        group= $(this).attr("group");
        read= $(this).attr("read");
        // problems with forwarding strings with linebreaks, eliminate them
        content = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
        addHelperElements(section, group, name, content, type, null, read);             
      }
    }
  });
}

function deleteXMLDetailDescriptionElements(type){
  
  var element = document.getElementById("linkOverlay_block_page_" + type);
  if(element){
    element.parentNode.removeChild(element);
  }
}

/**
 * add elements with detailed information about specific elements, 
 * get the position of the elements by id and/or name etc.
 * @TODO: some elements needed manual repositioning
 */
function addHelperElements(section, group, variable_name, value, type, taskId, readOut){
  
  var element;
  var xOffset, yOffset;
  var specialElement = false;
  
  if(section == "s-burst"){
    xOffset = 0;
    yOffset = -40;
    
    if(type=="description"){
      // xOffset = -150;
      // yOffset = 200;
      if(variable_name=="burst-history"){
        xOffset = 70;
        yOffset = -60;
      }
    }else if(type=="parameter"){
      // xOffset = -150;
      // yOffset = 200;
      if(variable_name=="button-launch-new-burst"){
        xOffset = -40;
        yOffset = -5;
      }
      if(variable_name=="connectivity"){
        xOffset = -50;
        yOffset = -15;
      }
      if(variable_name=="conduction_speed"){
        xOffset = -60;
        yOffset = -15;
      }
      if(variable_name=="coupling"){
        xOffset = -50;
        yOffset = -15;
      }
      if(variable_name=="model"){
        xOffset = -60;
        yOffset = -20;
      }
      if(variable_name=="monitors"){
        xOffset = -120;
        yOffset = -10;
      }
      if(variable_name=="integrator_HeunDeterministic"){
        xOffset = 0;
        yOffset = -35;
      }
      if(variable_name=="simulation_length"){
        xOffset = -70;
        yOffset = -30;
      }
    }
  } else if(section == "s-project"){
    // TODO: here: weird check for specific section on site
    // found on page of data structure menu
    if(document.getElementsByClassName("data-view view-column col-2")[0]){
      xOffset = 0;
      yOffset = -45;
    } else { // project main menu
      xOffset = 300;
      yOffset = -35;
    }
  } else if(section == "s-connectivity"){
    // xOffset = Math.floor((Math.random()*70)); good for menu, but not in interface
    xOffset = 0; 
    yOffset = -45;
    if(group == "elementClass")
      yOffset = -345; // due to the upload button in project...
  } else {
    xOffset = 0;
    yOffset = 0;
  }
  // some random factor
  xOffset += genericOffset;
  yOffset += genericOffset;
  
  if(group=="elementName"){
    element = document.getElementsByName(variable_name)[0];
    if(variable_name == "create" || variable_name == "save"){
      xOffset = 60;
      yOffset = -30;
    }
  } else if(group=="elementId"){
    element = document.getElementById(variable_name);
    if(variable_name == "description"){
      xOffset = 350;
      yOffset = 50;
    }
    if(variable_name == "name"){
      yOffset += 10;
    }

  } else if(group=="elementClass"){
    // only the upload button so far, therefore the yOffset was adapted
    element = document.getElementsByClassName(variable_name)[0];
    xOffset += 15;
    yOffset += 300;
    if(variable_name == "id"){
      element = document.getElementsByClassName(variable_name)[1];
      xOffset = 70;
      yOffset = -10;
    }
    if(variable_name == "data"){
      element = document.getElementsByClassName(variable_name)[1];
      xOffset = 120;
      yOffset = -10;
    }
    if(variable_name == "action action-upload"){ // upload button
      element = document.getElementsByClassName(variable_name)[0];
      xOffset = 60;
      yOffset = 460;
    }
    if(variable_name == "view-history view-column col-1"){ // upload button
      element = document.getElementsByClassName(variable_name)[0];
      xOffset = 220;
      yOffset = -20;
    }
  } else if(group=="elementUpload"){
    // only the upload button so far, therefore the yOffset was adapted
    element = document.getElementsByClassName(variable_name)[0];
    xOffset = 0;
    yOffset = 0;
  } else if(group=="elementId_data1"){
    element = document.getElementById(variable_name);
    xOffset += 100;
    yOffset += 5;
  } else if(group=="elementId_data2"){
    element = document.getElementById(variable_name);
    xOffset += 200;
    yOffset += 5;
  }

  // check for elements from footer menu
  if(variable_name == "nav-user" || 
     variable_name == "nav-project" || 
     variable_name == "nav-burst" || 
     variable_name == "nav-analyze" || 
     variable_name == "nav-stimulus" || 
     variable_name == "nav-connectivity"){
       specialElement = true;
       
       if(variable_name == "nav-user"){
         xOffset = 160;
       }else if(variable_name == "nav-project"){
         xOffset = 200; 
       }else if(variable_name == "nav-burst"){
         xOffset = 250; 
       }else if(variable_name == "nav-analyze"){
         xOffset = 210; 
       }else if(variable_name == "nav-stimulus"){
         xOffset = 220; 
       }else if(variable_name == "nav-connectivity"){
         xOffset = 230; 
       }else {
         xOffset = 0;
       }
       yOffset = 0;
     }
  
  // check if is in viewport or actually not visible (like in hidden menues)
  if((isElementInViewport(element, variable_name) || specialElement) && (element.offsetWidth > 0 && element.offsetHeight > 0)){
    
    var pos_element = getOffset(element);    
    pos_element.left += xOffset;
    pos_element.top  += yOffset;
    
    // alert(pos_element.left);
    var methodName = "helpOverlay('" + value + "', " + pos_element.left + ", " + pos_element.top + ", " + readOut + ")";
    
    if(type == "task")
      var link = '<a href="#" onclick="' + methodName + '"><b>' + taskId + '.</b>';//Click here to open additional information.</a><br/>';
    else
        var link = '<a href="#" onclick="' + methodName + '">';
        
    var block_page_name = "linkOverlay_block_page_" + type;
    if(!document.getElementById(block_page_name)){
      var block_page = $('<div class="' + block_page_name + '" id="' + block_page_name + '"></div>');
      $(block_page).appendTo('body');
    }

    var elemName = "linkOverlay_elements_" + type;
    var elemId = type + "_" + variable_name;
    var pop_up = $('<div name="' + elemName + '" class="' + elemName + '" id="' + elemId +'">' + link +'</a></div>');

    // needs '.' for accessing this element
    $(pop_up).appendTo('.' + block_page_name);
    // position of speech bubble div image
    document.getElementById(elemId).style.left = (pos_element.left) + 'px';
    document.getElementById(elemId).style.top =  (pos_element.top) + 'px';
  }

  var opac = document.getElementById('sliderLinkOpacityValue').value / 100.;
  $('.linkOverlay_elements_description_'+type).css('opacity', opac);
  
  return true;
} 

/**
 * method checks if the DOM element is visible in the current viewport in browser
 */
function isElementInViewport (el, name) {

  if (el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  if(name == "connectivity" || name == "coupling" || name == "conduction_speed" || name == "model" || name == "simulation_length" || name == "monitors" || name == "integrator_HeunDeterministic"){
    return (
      rect.top >= 160 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight-30 || document.documentElement.clientHeight-30) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }else {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }
}

/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
function moveHighlightArrow(){
  
  if(FLAG_showHighlightArrow && FLAG_edupackActive){
    alert("movehighlightarrow");
    highlight_arrow_position = getOffset( document.getElementsByName('highlighted')[current_highlight_arrow_position]);
    moveDivToXY("highlight_arrow", highlight_arrow_position.left, highlight_arrow_position.top);
  }
}

// x coming from left, y coming from top screen
function moveDivToXY(id, x,y, element_id){
  if(y >= 65){ 
    document.getElementById(id).style.opacity = 1.0;
  }else {
    document.getElementById(id).style.opacity = 0.0;
  }
  document.getElementById(id).style.left = (x + arrow_offset_left) + "px";
  document.getElementById(id).style.top  = (y + arrow_offset_top)  + "px";
}

/**
 * function that checks for preconditions within a substep in the given xml tutorial data
 */
function checkForPrecondition(xml_data, stepId, taskId){
  var returnValue = true;
  if(FLAG_edupackActive){
      
    $(xml_data).find("step").each(function() {
      if($(this).find("step-id").text() == stepId){
        $(this).find("sub-step").each(function() {        
          if($(this).find("value").text() == taskId){
            // when landing in here, we've got the correct element
            $(this).find("precondition").each(function() {
              
              var precondition = $(this).attr("section");
              if(document.getElementById(precondition) != null){
                returnValue = true;
              } else {
                var message = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
                var posX = Math.round(window.screen.width / 3);
                var posY = Math.round(window.screen.height / 2);
                helpOverlay(message, posX, posY);
                returnValue = false;
              }
            });
          }
        });   
      }
    });
  }

  return returnValue;
}

/**
 * function that checks for actions within a substep in xml data
 */
function checkForActions(xml_data, stepId, taskId){
  
  $(xml_data).find("step").each(function() {
    if($(this).find("step-id").text() == stepId){
      $(this).find("sub-step").each(function() {        
        if($(this).find("value").text() == taskId){
          // when landing in here, I've got the correct action element
          $(this).find("action").each(function() {
            
            // evaluate the action and call specific functions $(this).attr("type")
            var type = $(this).attr("type"); 
            if(type == "task_overlay"){
              
              var section = $(this).attr("section");
              var group = $(this).attr("group");
              var helper_type = $(this).attr("helper_type");
              var variable_name = $(this).attr("variable_name");
              var read = $(this).attr("read");
              var value = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
              
              // create action, that it can get removed when task is closed
              var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
              
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {"helper_type":helper_type, "group":group, "read":read });
              
            }else if(type == "autopilot") {
              
              var section = $(this).attr("section");
              var group = $(this).attr("group");
              var helper_type = $(this).attr("helper_type");
              var variable_name = $(this).attr("variable_name");
              var value = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
              
              // create action, that it can get removed when task is closed
              var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {"helper_type":helper_type, "group":group});
              
            }else if(type =="move_edupack") {
              var section = $(this).attr("section");
              var group = $(this).attr("group");
              var helper_type = $(this).attr("helper_type");
              var variable_name = $(this).attr("variable_name");
              var value = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
              
              var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {});
            } else {
              var section = $(this).attr("section");
              var variable_name = $(this).attr("variable_name");
              var value = $(this).attr("value");
              var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {});
            }
          });
        }
      });   
    }
  });
  
  return true;
}

/**
 * function that checks for actions within a substep in xml data and deletes them
 */
function unloadActions(xml_data, stepId, taskId){
  
  $(xml_data).find("step").each(function() {
    if($(this).find("step-id").text() == stepId){
      $(this).find("sub-step").each(function() {        
        if($(this).find("value").text() == taskId){
          // when landing in here, I've got the correct action element
          $(this).find("action").each(function() {
            
            var type = $(this).attr("type"); 
            var section = $(this).attr("section");
            var variable_name = $(this).attr("variable_name");
            var value = $(this).attr("value");
            var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
            
            removeAction(type, section, variable_name, value, stepId, taskId, actionName);
            
          });
        }
      });   
    }
  });
  
  return true;
}


function actionHighlight(section, variable_name, value){
  
  var search_name, spanClass, spanId;
  
  // interface specific adaptions
  if(section=="simulator"){
    section = document.getElementById('section-simulator-main');
    search_name = '<label for="' + variable_name + '">';
    spanClass = "highlight";
    spanId = spanClass + "_" + variable_name;
  }
  
  if(!document.getElementById("highlight_" + spanId)){    
      var content = section.innerHTML,
        pattern = new RegExp('(>[^<.]*)(' + search_name + ')([^<.]*)','g'),
        replaceWith = '$1 $2<span name="highlighted" ' + ( spanId ? 'id="' + spanId + '"' : '' ) + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '"><p align="right"><font color="white">' + value + '</font></p></span>$3',
        highlighted = content.replace(pattern,replaceWith);
      // moveHighlightArrow();
      return (section.innerHTML = highlighted) !== content;
  }else
    return false;

  return true;
} 


function actionOverlay(mode, content){
  
  if(mode == 'display') {
    // add block page
    var block_page = $('<div class="overlay_block_page"></div>');
    $(block_page).appendTo('body');
    
    // add popup box
    var pop_up = $('<div class="overlay_modal_box"><a href="#" class="overlay_modal_close">x</a><div class="overlay_inner_modal_box">' + content + '</div></div>');
    $(pop_up).appendTo('.overlay_block_page');
    
    $('.overlay_block_page').dblclick(function(){
      $(this).fadeOut().remove();
      $('.overlay_modal_close').fadeOut().remove();        
    });  
    
    $('.overlay_modal_close').click(function(){
      $(this).parent().fadeOut().remove();
      $('.overlay_block_page').fadeOut().remove();         
    });
    
    // if the overlay is dbl clicked, don't act as the parent (block_page) and close it
    $('.overlay_modal_box').dblclick(function(e){
      e.stopPropagation();
    });
    
    $('.overlay_modal_box').fadeIn();
  } else {
    
    $('.overlay_modal_box').fadeOut();
  }
  
  generateStylesForOverlay();
} 




function closeThisOverlay(){
  $('.overlay_block_page').fadeOut().remove();
  $('.overlay_modal_close').fadeOut().remove();        
}


function helpOverlay(content, left, top, readOut){
  
  if(window.screen.height - top <= 100)
    top = window.screen.height - 150;
  
  if(window.screen.width - left <= 100)
    left = window.screen.width - 200;
  
  // add block page
  var block_page = $('<div class="helpOverlay_block_page" id="helpOverlay_block_page"></div>');
  $(block_page).appendTo('body');
  
  // add popup box
  if(readOut){
    var pop_up = $('<div name="helpOverlay_modal_box" class="helpOverlay_modal_box"><a href="#" class="helpOverlay_modal_close"><b>x</b></a><div class="helpOverlay_inner_modal_box"><font align="right"><a href=# onclick="readOutLoud(\'' + content + '\')"><img src="/static/style/img/edupack/speaker.png" valign="bottom">&nbsp;&nbsp;readOutLoud</a></font><br>' + content + '</div></div>');  
  }else {
    var pop_up = $('<div name="helpOverlay_modal_box" class="helpOverlay_modal_box"><a href="#" class="helpOverlay_modal_close"><b>x</b></a><div class="helpOverlay_inner_modal_box">' + content + '</div></div>');
  }
  
  $(pop_up).appendTo('.helpOverlay_block_page');  
  
  $('.helpOverlay_block_page').dblclick(function(){
    $(this).fadeOut().remove();
    $('.helpOverlay_modal_close').fadeOut().remove();        
  });  
  
  $('.helpOverlay_modal_close').click(function(){
    $(this).parent().fadeOut().remove();
    $('.helpOverlay_block_page').fadeOut().remove();         
  });
  
  // if the overlay is dbl clicked, don't act as the parent (block_page) and close it
  $('.helpOverlay_inner_modal_box').dblclick(function(e){
    e.stopPropagation();
  });
  
  if((left != "none") && (top != "none")){
    var element = document.getElementsByName("helpOverlay_modal_box")[0];
    element.style.top = top + 45 + 'px';
    
    element.style.left = left + 'px';     
  }
  
  $('.helpOverlay_modal_box').fadeIn();
  FLAG_overlay_new = true;
  
} 


function readOutLoud(content){
  var msg = new SpeechSynthesisUtterance(content.replace(/<(?:.|\n)*?>/gm, ''));
  window.speechSynthesis.speak(msg);
}


function parseProjectXML(xml_data){
  var parameters;
  $(xml_data).find("tvb_data").each(function() {
    parameters = $(this).find("parameters").text();
    // delete all "&quot;" elements
    // .replace("[","").replace("]","");
    parameters = parameters.replace(/(&quot;|[|])/gm, "");
    // parameters = parameters.replace(/ /g, "");
    var obj = JSON.parse(parameters);
    
    parameterCheckHash = new HashTable(obj);
  });
}


function checkParametersFromHash(){
  
  // compare currentParameters with data from project xml
  var currentParameters = getCurrentParameterHashTable();
  // TODO work with copy of object and removeItem locally or just add / remove actions and check all params?
  var hash = jQuery.extend(true, {}, parameterCheckHash); // get copy of global variable
  
  // iterate over elements from xml and compare it with current parameters
  // if they match, delete them from the hash
  if(hash.getItem("currentAlgoId"))
    hash.removeItem("currentAlgoId");
  if(hash.getItem("connectivity"))
    hash.removeItem("connectivity");  
  
  var keys = hash.keys();
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    if(currentParameters.getItem(keys[i]) == hash.getItem(keys[i])) {
      
      hash.removeItem(keys[i]);
      removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 03, 02, "highlight_" + keys[i]);
    }else if(String(hash.getItem(keys[i])).localeCompare(String(currentParameters.getItem(keys[i]))) == 0) {
      hash.removeItem(keys[i]);
      removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 03, 02, "highlight_" + keys[i]);
    }else {
      addAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 03, 02, "highlight_" + keys[i], {});
    }
  }
  
  // when finished comparing, check if all keys matched ( parameterCheckHash is then empty)
  // if not, start calling this method after each click
  if(hash.keys().length == 0){
    FLAG_correctParameters = true;
    FLAG_eduCase = true;
    document.getElementById("read_project_xml").innerHTML += "<br/>Congrats, you are now ready to start the simulation";
  }else {
    FLAG_correctParameters = false;  
  }
}

function getStringFromHashTable(h){
  var s = "";
  for (var i = 0, keys = h.keys(), len = keys.length; i < len; i++) {
      s +=(keys[i] + ': ' + h.getItem(keys[i]) + '\n\n');
  }
  
  return s;
}

function getCurrentParameterHashTable(){
  // get dictionary of parameters, an bring it into data structure of HashTable
  var currentParameters = getSubmitableData('div-simulator-parameters', false);
  var currentParametersHash = new HashTable();
  for (key in currentParameters) {
    currentParametersHash.setItem(key, currentParameters[key]);
  }
  
  return currentParametersHash;
}


/*
 * reads a tvb generated operation xml file in order to compare it with current settings in simulation interface
 */
function loadProjectXML(){
  // TODO file management and references -_-
  $.ajax({
    type: "GET",
    // url: "/static/js/edupack/xml/edupack_Operation.xml",
    url: "/static/js/edupack/xml/edupack_paul_Operation.xml",
    dataType: "xml",
    // function's called, when file is readable
    success: function(xml) { projectXML = xml; parseProjectXML(projectXML);},
    // function's called when file is not readable 
    error: function (xhr, ajaxOptions, thrownError){ 
      document.getElementById("tutorial-area").innerHTML="<font color='#ff0000'>1: "+xhr.status + ", 2: " + thrownError + "</font>";
      // alert(xhr.status);
      // alert(thrownError);
    } 
  });
}


function actionRemoveElement(type, variable_name) {
  var elemId = type + "_" + variable_name;
  var element = document.getElementById(elemId);
  if(element)
    element.parentNode.removeChild(element);
}


function addAction(type, section, variable_name, value, stepId, taskId, actionName, opts){
  var actionKey = stepId + '_' + taskId + '_' + actionName;
  
  if(activeActions.getItem(actionKey) != actionName){
    activeActions.setItem(actionKey, actionName);
  
    if(type == "move_edupack"){
      var element = document.getElementById("container");
      element.style.right = 120 + 'px';
    }
  
    if(type == "task_overlay"){
      addHelperElements(section, opts['group'], variable_name, value, opts['helper_type'], taskId, opts['read']);
    }
    
    if(type == "autopilot"){
      callAutoPilot(section, opts['group'], variable_name, value, opts['helper_type'], taskId, false);
    }
  
    if(type == "highlight"){
      actionHighlight(section, variable_name, value);
    }
    if(type == "timeseries"){
      actionOverlay("display", "tut");
    }
  }
}




/*
 * for auto control of mouse movement 
 * (http://javascript.info/tutorial/animation)
 * @TODO
 */
function moveMe(element, delta, pos) {
  var toX = pos.x;
  var toY = pos.y;
  
  element.style.left = _currentMouseX + "px";
  element.style.top = _currentMouseY + "px"; 
  
  var fromX = parseInt(element.style.left);
  var fromY = parseInt(element.style.top);
   
  animate({
    delay: 0,
    duration: 1500, // 1 sec by default
    delta: delta,
    step: function(delta) {
      element.style.left = (toX-fromX) * delta + fromX + "px";
      element.style.top  = (toY-fromY) * delta + fromY + "px";
    }
  });
}

function animate(opts) {
  var start = new Date;
  var id = setInterval(function() {
    var timePassed = new Date - start;
    var progress = timePassed / opts.duration;
    if (progress > 1) 
      progress = 1;
    var delta = opts.delta(progress);
    opts.step(delta);
    if (progress == 1) {
      clearInterval(id);
    }
  }, opts.delay || 10);
}

function linear(progress) {
  return progress;
}

function bounce(progress) {
  for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (progress >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
    }
  }
}
function makeEaseOut(delta) { 
  return function(progress) {
    return 1 - delta(1 - progress)
  }
}


function callAutoPilot(section, group, variable_name, value, type, taskId, readOut){
  var a = document.getElementById(variable_name);
  var left = a.getElementsByTagName('a')[0].offsetLeft;
  var top = a.getElementsByTagName('a')[0].offsetTop;

  changeFLAG_schowAnimationArrow();
  moveMe(document.getElementById("animation_arrow"), makeEaseOut(bounce), {x: left, y: top});
    
  return true;
  
}


function removeAction(type, section, variable_name, value, stepId, taskId, actionName){
  activeActions.removeItem(stepId + '_' + taskId + '_' + actionName, actionName);
  
  if((type == "highlight") || (type == "project_xml")){
    actionRemoveElement(type, variable_name);
  }
  if(type == "task_overlay"){
    actionRemoveElement("task", variable_name);
  }
  
  if(type == "move_edupack"){
      var element = document.getElementById("container");
      element.style.right = 0 + 'px';
  }
  
  if(type == "project_xml"){
    // remove all created highlights with this specific type - but the call comes from unloadactions, but there are more elements in it...
    actionRemoveElement(type, variable_name);
  }
  if(type == "overlay"){
    actionOverlay('removeDisplay');
  }
}

/*
 * not finished
 * TODO RemoveAll function tasks
 */
function removeAllActionsFromTask(section, variable_name, value, stepId, taskId){
  actionRemoveElement(variable_name);
}


function compareParametersWithHighlighting(){
  var b = document.getElementById('section-simulator-main'); 
  current_highlight_arrow_position = 0;
  highlight2(b,'<label for="coupling">','highlight', 'highlight_coupling');
  highlight2(b,'<label for="model">','highlight','highlight_model');
  highlight2(b,'<label for="conduction_speed">','highlight','highlight_conduction_speed');
  
  changeFLAG_schowHighlightArrow();
}


function showParametersInSpecificElement(data, id){
  var output = "";
  for (property in data) {
      output += property + ': ' + data[property]+'<br> ';
  }
  document.getElementById(id).innerHTML=output;
  FLAG_devTutorialCheck = false;
}

  
function loadOverlayWithVideo(){
  var thediv=document.getElementById('edupackOverlay');
  if(thediv.style.display == "none"){
    thediv.style.display = "";
    thediv.innerHTML = "<table width='100%' height='100%'><tr><td align='center' valign='middle' width='100%' height='100%'><object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' codebase='http://www.apple.com/qtactivex/qtplugin.cab' width='640' height='500'><param name='src' value='http://cowcast.creativecow.net/after_effects/episodes/Shape_Tips_1_POD.mp4'><param name='bgcolor' value='#000000'><embed src='http://cowcast.creativecow.net/after_effects/episodes/Shape_Tips_1_POD.mp4' autoplay='true' pluginspage='http://www.apple.com/quicktime/download/' height='500' width='640' bgcolor='#000000'></embed></object><br><br><a href='#' onclick='return clicker();'>CLOSE WINDOW</a></td></tr></table>";
  }else{
    thediv.style.display = "none";
    thediv.innerHTML = '';
  }
  return false;
}




function openEdupack(){

  $("li#nav-edupack").toggleClass('clicked');
  
  if (!localStorage.getItem("tvb_active")){ // inactive, so activate it now
    localStorage.setItem("tvb_active", true);
    FLAG_edupackActive = true;
    document.getElementById("container").style.display="block";
    checkAndLoadHelpElements();
  }else {
    localStorage.removeItem("tvb_active");
    document.getElementById("container").style.display="none";
    FLAG_edupackActive = false;

    deleteXMLDetailDescriptionElements("description");
    deleteXMLDetailDescriptionElements("parameter");
    deleteXMLDetailDescriptionElements("misc");
  }
}

function loadEdupack(){
  document.getElementById("container").style.display="block";
  FLAG_edupackActive = true;
}

function checkAndLoadHelpElements(){

  if(localStorage.getItem("helper_description") == "true"){
    document.getElementById("showEduPackHelp_description").checked = true;
    if(FLAG_edupackActive){
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "description");
    }
  }else{
    document.getElementById("showEduPackHelp_description").checked = false;
  }
    
  if(localStorage.getItem("helper_parameter") == "true"){
    document.getElementById("showEduPackHelp_parameter").checked = true;
    if(FLAG_edupackActive){
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "parameter");
    }
  }else{
    document.getElementById("showEduPackHelp_parameter").checked = false;
  }
        
  if(localStorage.getItem("helper_misc") == "true"){
    document.getElementById("showEduPackHelp_misc").checked = true;
    if(FLAG_edupackActive){
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "misc");
    }
  } else {
    document.getElementById("showEduPackHelp_misc").checked = false;
  }
  
  return true
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };  
}

function changeFLAG_schowAnimationArrow(){
  if (!FLAG_showAnimationArrow){ // inactive, so activate it now
      document.getElementById("animation_arrow").style.display="block";
      FLAG_showAnimationArrow = true;
    } else {
      document.getElementById("animation_arrow").style.display="none";
      FLAG_showAnimationArrow = false;
  }
}

function changeFLAG_schowHighlightArrow(){
  if (!FLAG_showHighlightArrow){ // inactive, so activate it now
      document.getElementById("highlight_arrow").style.display="block";
      FLAG_showHighlightArrow = true;
    } else {
      document.getElementById("highlight_arrow").style.display="none";
      FLAG_showHighlightArrow = false;
  }
}

function deactivateFLAG_schowHighlightArrow(){
  if (FLAG_showHighlightArrow){ // inactive, so activate it now
      document.getElementById("highlight_arrow").style.display="none";
      FLAG_showHighlightArrow = false;
  }
}

function activateFLAG_schowHighlightArrow(){
  if (!FLAG_showHighlightArrow){ // inactive, so activate it now
      document.getElementById("highlight_arrow").style.display="block";
      FLAG_showHighlightArrow = true;
  }
}



/*
range_1: 0
range_2: 0
coupling_parameters_option_Linear_a: [0.00390625]
coupling_parameters_option_Linear_b: [0.0]
conduction_speed: 3.0
: 
model_parameters_option_Generic2dOscillator_tau: [1.0]
model_parameters_option_Generic2dOscillator_I: [0.0]
model_parameters_option_Generic2dOscillator_a: [-2.0]
model_parameters_option_Generic2dOscillator_b: [-10.0]
model_parameters_option_Generic2dOscillator_c: [0.0]
model_parameters_option_Generic2dOscillator_state_variable_range_parameters_W: [-6. 6.]
model_parameters_option_Generic2dOscillator_state_variable_range_parameters_V: [-2. 4.]
model_parameters_option_Generic2dOscillator_noise: Noise
model_parameters_option_Generic2dOscillator_noise_parameters_option_Noise_ntau: 0.0
model_parameters_option_Generic2dOscillator_noise_parameters_option_Noise_random_stream: RandomStream
model_parameters_option_Generic2dOscillator_noise_parameters_option_Noise_random_stream_parameters_option_RandomStream_init_seed: 42
integrator: HeunDeterministic
integrator_parameters_option_HeunDeterministic_dt: 0.01220703125
monitors_parameters_option_TemporalAverage_period: 0.9765625
simulation_length: 1000.0
connectivity: 618ecc5e-a382-11e3-a281-1093e900d146
coupling: Linear
surface: 
stimulus: 
model: Generic2dOscillator
model_parameters_option_Generic2dOscillator_variables_of_interest: V
monitors: TemporalAverage
 */

function createVariableMapping(){
  hashMap = new HashTable();
  hashMap.setItem('connectivity', 'Long-range connectivity');
  // zunaechst erstmal fuer a und b die gleiche Ueberschrift gewaehlt
  hashMap.setItem('coupling_parameters_option_Linear_a', 'Long-range coupling function');
  hashMap.setItem('coupling_parameters_option_Linear_b', 'Long-range coupling function');
  
  hashMap.setItem('conduction_speed', 'Conduction Speed');
  hashMap.setItem('surface', 'Cortical Surface');
  hashMap.setItem('stimulus', 'Spatiotemporal stimulus');
  hashMap.setItem('model', 'Local dynamic model');
  
  // zunaechst fuer V und W nur die Uebrschrift highlighten
  hashMap.setItem('model_parameters_option_Generic2dOscillator_state_variable_range_parameters_V', 'State Variable ranges [lo, hi]');
  hashMap.setItem('model_parameters_option_Generic2dOscillator_state_variable_range_parameters_W', 'State Variable ranges [lo, hi]');
  hashMap.setItem('model_parameters_option_Generic2dOscillator_variables_of_interest', 'Variables watched by Monitors');
  hashMap.setItem('model_parameters_option_Generic2dOscillator_noise', 'Initial Conditions Noise');
  hashMap.setItem('model_parameters_option_Generic2dOscillator_noise_parameters_option_Noise_random_stream', 'Random Stream');
  hashMap.setItem('model_parameters_option_Generic2dOscillator_noise_parameters_option_Noise_random_stream_parameters_option_RandomStream_init_seed', 'A random seed');
  hashMap.setItem('integrator', 'Integration scheme');
  hashMap.setItem('monitors', 'Monitor(s)');
  hashMap.setItem('simulation_length', 'Simulation Length (ms)');
}


/**
 * 
 * 
 * Standardwerte SJ3D in TVB
 Parameters: 
 ReducedSetHindmarshRose(
  a=[ 1.], 
  K12=[ 0.15], 
  K11=[ 0.5], 
  noise=Noise(ntau, random_stream), 
  d=[ 5.], 
  state_variable_range={
    'tau': array([  2.,  10.]), 
    'xi': array([-4.,  4.]), 
    'beta': array([-20.,  20.]), 
    'eta': array([-25.,  20.]), 
    'alpha': array([-4.,  4.]), 
    'gamma': array([  2.,  10.])}, 
  K21=[ 0.15], 
  c=[ 1.], 
  mu=[ 2.2], 
  s=[ 4.], 
  b=[ 3.], 
  variables_of_interest=[u'xi' u'eta' u'tau'], 
  r=[ 0.006], 
  sigma=[ 0.3], 
  xo=[-1.6])
 
 
range_1: 0
range_2: 0
coupling_parameters_option_Linear_a: [0.0672]
coupling_parameters_option_Linear_b: [0.0]
conduction_speed: 10.0
: 
model_parameters_option_ReducedSetHindmarshRose_r: [0.006]
model_parameters_option_ReducedSetHindmarshRose_a: [1.0]
model_parameters_option_ReducedSetHindmarshRose_b: [3.0]
model_parameters_option_ReducedSetHindmarshRose_c: [1.0]
model_parameters_option_ReducedSetHindmarshRose_d: [5.0]
model_parameters_option_ReducedSetHindmarshRose_s: [4.0]
model_parameters_option_ReducedSetHindmarshRose_xo: [-1.6]
model_parameters_option_ReducedSetHindmarshRose_K11: [0.5]
model_parameters_option_ReducedSetHindmarshRose_K12: [0.1]
model_parameters_option_ReducedSetHindmarshRose_K21: [0.15]
model_parameters_option_ReducedSetHindmarshRose_sigma: [0.3]
model_parameters_option_ReducedSetHindmarshRose_mu: [2.2]
model_parameters_option_ReducedSetHindmarshRose_state_variable_range_parameters_tau: [ 2. 10.]
model_parameters_option_ReducedSetHindmarshRose_state_variable_range_parameters_xi: [-4. 4.]
model_parameters_option_ReducedSetHindmarshRose_state_variable_range_parameters_beta: [-20. 20.]
model_parameters_option_ReducedSetHindmarshRose_state_variable_range_parameters_eta: [-25. 20.]
model_parameters_option_ReducedSetHindmarshRose_state_variable_range_parameters_alpha: [-4. 4.]
model_parameters_option_ReducedSetHindmarshRose_state_variable_range_parameters_gamma: [ 2. 10.]
model_parameters_option_ReducedSetHindmarshRose_noise: Noise
model_parameters_option_ReducedSetHindmarshRose_noise_parameters_option_Noise_ntau: 0.0
model_parameters_option_ReducedSetHindmarshRose_noise_parameters_option_Noise_random_stream: RandomStream
model_parameters_option_ReducedSetHindmarshRose_noise_parameters_option_Noise_random_stream_parameters_option_RandomStream_init_seed: 42
integrator: HeunStochastic
integrator_parameters_option_HeunStochastic_dt: 0.0156
integrator_parameters_option_HeunStochastic_noise: Additive
integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_ntau: 0.0
integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_random_stream: RandomStream
integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_random_stream_parameters_option_RandomStream_init_seed: 42
integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_nsig: [0.01]
monitors_parameters_option_Bold_hrf_kernel: FirstOrderVolterra
monitors_parameters_option_Bold_hrf_kernel_parameters_option_FirstOrderVolterra_equation: 1/3. * exp(-0.5*(var / tau_s)) * (sin(sqrt(1./tau_f - 1./(4.*tau_s**2)) * var)) / (sqrt(1./tau_f - 1./(4.*tau_s**2)))
monitors_parameters_option_Bold_hrf_kernel_parameters_option_FirstOrderVolterra_parameters_parameters_tau_f: 0.4
monitors_parameters_option_Bold_hrf_kernel_parameters_option_FirstOrderVolterra_parameters_parameters_k_1: 5.6
monitors_parameters_option_Bold_hrf_kernel_parameters_option_FirstOrderVolterra_parameters_parameters_V_0: 0.02
monitors_parameters_option_Bold_hrf_kernel_parameters_option_FirstOrderVolterra_parameters_parameters_tau_s: 0.8
monitors_parameters_option_Bold_period: 1940.0
simulation_length: 150000.0
connectivity: a0846659-a834-11e3-9cb3-1093e900d146
coupling: Linear
surface: 
stimulus: 
model: ReducedSetHindmarshRose
model_parameters_option_ReducedSetHindmarshRose_variables_of_interest: xi,eta,tau
monitors: Bold
 
  
 A_ik: array([[ 0.33281658,  0.18525242,  0.33281658],
       [ 0.59845379,  0.33311144,  0.59845379],
       [ 0.33281658,  0.18525242,  0.33281658]])
 B_ik: array([[ 0.33281658,  0.59845379,  0.33281658],
       [ 0.18525242,  0.33311144,  0.18525242],
       [ 0.33281658,  0.59845379,  0.33281658]])
 C_ik: array([[ 0.33281658,  0.18525242,  0.33281658],
       [ 0.59845379,  0.33311144,  0.59845379],
       [ 0.33281658,  0.18525242,  0.33281658]])
 a_i: array([[ 1.19969826,  3.87216781,  1.19969826]])
 e_i: array([[ 1.19969826,  3.87216781,  1.19969826]])
 b_i: array([[ 3.28592215,  5.90334738,  3.28592215]])
 f_i: array([[ 3.28592215,  5.90334738,  3.28592215]])
 c_i: array([[ 0.91298572,  0.50818626,  0.91298572]])
 h_i: array([[ 0.91298572,  0.50818626,  0.91298572]])
 IE_i: array([[ 1.51017138,  1.11800976,  2.5069658 ]])
 II_i: array([[ 1.51017138,  1.11800976,  2.5069658 ]])
 d_i: array([[ 4.5649286 ,  2.54093128,  4.5649286 ]])
 p_i: array([[ 4.5649286 ,  2.54093128,  4.5649286 ]])
 m_i: array([[-0.03505865, -0.01951435, -0.03505865]])
 n_i: array([[-0.03505865, -0.01951435, -0.03505865]])

2014-03-25 17:16:58,193 - ERROR [proc:4120]  - tvb.simulator.common - Bold(hrf_kernel, variables_of_interest, period, hrf_length): BOLD.period must be a multiple of 500.0, period = 1940.0
 */



/**
 * http://stackoverflow.com/questions/6157929/how-to-simulate-mouse-click-using-javascript
 * @param {Object} element
 * @param {Object} eventName
 */
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}


function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}


var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}


var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}