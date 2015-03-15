
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
var hashMap;
var highlight_arrow_position;
var arrow_offset_top = -70;
var arrow_offset_left = 55;
var current_highlight_arrow_position = 0;

// colors
var descriptionTypeColor = "4DA83F";
var parameterTypeColor = "EB4F2D";
var miscTypeColor = "0000FF";

var FLAG_showAnimationArrow = false;

var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _debug = $('debug');    // makes life easier
var FLAG_overlay_new;
var FLAG_showEduPackHelp_description_active = false;
var FLAG_showEduPackHelp_parameter_active = false;
var FLAG_showEduPackHelp_misc_active = false;

var _currentMouseX = 0;
var _currentMouseY = 0;

// hashtable that is used for storing 
var parameterCheckHash;
var FLAG_parameters = false;
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
  
  document.onmousedown = OnMouseDown;
  document.onmouseup = OnMouseUp;
  
  genericOffset = Math.floor((Math.random()*12)-6);
  
  $(document).addClass('.map_image #map_link_0 { width: 35px; height: 146px; top: 68px; left: 157px;}');
  
  
  // geht leider nicht:
  // $("head").append('<script type="text/javascript" src="edupack_batch_generator.js"></script>');
  
  // document.onkeypress=function(){
//     
//     
  // };
  
  // document.onscroll = adaptHelperElementEvent;

  // document.getElementById("section-simulator-main").onscroll = adaptHelperElementEvent;
  
  /*
   * reads a hardcoded xml tutorial file
   * when reading was successful, start to parse and generate EduPack
   * visuals out of it (menu, tasks, ...)
   */
  $.ajax({
    type: "GET",
    // url: "/static/js/edupack/xml/edupack_xml_tutorial.xml",
    // url: "/static/js/edupack/xml/edupack_xml_tutorial_randy.xml",
    url: "/static/js/edupack/xml/edupack_xml_tutorial_thesis.xml",
    // url: "/static/js/edupack/xml/edupack_thesis_tutorial.xml",
    dataType: "xml",
    // function's called, when file is readable
    success: function(xml) { parseXMLTutorial(xml); },
    // function's called when file is not readable 
    error: function (xhr, ajaxOptions, thrownError){ 
      document.getElementById("tutorial-area").innerHTML="<font color='#ff0000'>1: "+xhr.status + ", 2: " + thrownError + "</font>";
      // alert(xhr.status);
      // alert(thrownError);
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
 * TODO comment on function
 */
function parseXMLTutorial(data) {

  var output = '',
    stepId,
    subStepValue,
    subStepType,
    subStepAddress,
    manualFinishLink,
    contentString,
    button_title;
  var numberMenuEntries = {};
  
  // TODO, this loads a specific project simulations xml file with parameters of a simulation
  loadXML("tralala");
  
  /*
   * generate the HTML Code for the EduPack, filled with the loaded XML tutorial
   */
  
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
    
    /*
     * TODO the number of tasks should refer to "open" tasks,
     * e.g. if a tasks is done / completed, reduce the value
     */
    output += '<span id="span_' + stepId + '">' + $(this).find("sub-step").size() + '</span></a>';
    
    // alert(stepId);
    // alert($(this).find("sub-step").size());
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
        // hier
        var content = $(this).find("detail").text();
        // output += '<font align="right"><a href=# onclick="readOutLoud(\'' + content.replace(/(\r\n|\n|\r)/gm,"") + '\')"><img src="/static/style/img/edupack/speaker.png" valign="bottom">&nbsp;&nbsp;readOutLoud</a></font>';
        output += content;
        // TODO what happens if there's no manual link
        // TODO show achievement list for automated goals
        manualFinishLink = $(this).find("finish_constraints").find("manual").text();
        $(this).find("overlay").each(function() { 
          contentString = $(this).find("content").text().replace(/(\r\n|\n|\r)/gm,"");
          
          var methodName = "actionOverlay('display', '" + contentString + "')";
          // var methodName2 = "actionOverlay('display', '<img src=/static/style/img/edupack/sim_images/example_01.png>')";
          output += '<a href="#" class=overlay_button onclick="' + methodName + '"><font color ="#DDDDDD">Info</font></a>';
        });

        $(this).find("animation").each(function() { 
          contentString = $(this).find("content").text().replace(/(\r\n|\n|\r)/gm,"");
          var subtitle = $(this).find("description").text().replace(/(\r\n|\n|\r)/gm,"");
          
          var methodName = "actionOverlay('display', '" + contentString + "')";
          // output += '<a href="#" class="animation_button" onclick="' + methodName + '"><img src=/static/style/img/edupack/anim00_preview.png width="350" style="margin:0px; padding:0px; border: 1px solid #000000;"></a>';
          // if(subtitle != null)
            // output += subtitle + '<br><br>';
          // else
            // output += '<br>';
            
          output += '<a href="#" class="pic-link" onclick="' + methodName + '"><img src=/static/style/img/edupack/anim00_preview.png width="350" style="margin:0px; padding:0px; border: 1px solid #000000;">';
          if(subtitle != null)
          // <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span></a>
            output += '<span>' + subtitle + '<span></a><br><br>';
          else
            output += '</a><br>';  
            
          
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
 * DOM elements of the accordion menu, which allows to show elements
 * without page stepping. Baheviour functions for these elements are
 * implemented.
 */
  var tutorial_head = $('.tutorial-step > li > a'),
    tutorial_body = $('.tutorial-step li > .sub-menu'),
    tutorial_substep_head = $('.sub-step > li > a'),
    tutorial_substep_body = $('.sub-step li > .detail-menu'),
    detail_completed =  $('.detail-step a');


  document.getElementById("showEduPackHelp_parameter").onclick = function(e){
    if(document.getElementById("showEduPackHelp_parameter").checked){
      localStorage.setItem("helper_parameter", "true");
      // alert("param activated: " + localStorage.getItem("helper_parameter"));
      document.getElementById("sliderLinkOpacityValue").disabled= false;
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "parameter");
      setHelperElementsActive(true);
    } else {
        localStorage.setItem("helper_parameter", "false");
        // alert("param deactivated: " + localStorage.getItem("helper_parameter"));
        deleteXMLDetailDescriptionElements("parameter");
        if(!document.getElementById("showEduPackHelp_description").checked && !document.getElementById("showEduPackHelp_parameter").checked && !document.getElementById("showEduPackHelp_misc").checked){
          document.getElementById("sliderLinkOpacityValue").disabled= true;
          setHelperElementsActive(false);
        }
    }
  }
  
  
  document.getElementById("showEduPackHelp_description").onclick = function(e){
    if(document.getElementById("showEduPackHelp_description").checked == true){
      localStorage.setItem("helper_description", "true");
      // alert("desc activated: " + localStorage.getItem("helper_description"));
      document.getElementById("sliderLinkOpacityValue").disabled = false;
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "description");
      setHelperElementsActive(true);
    } else {
        localStorage.setItem("helper_description", "false");
        // alert("desc deactivated: " + localStorage.getItem("helper_description"));
        deleteXMLDetailDescriptionElements("description");
        if(!document.getElementById("showEduPackHelp_description").checked && !document.getElementById("showEduPackHelp_parameter").checked && !document.getElementById("showEduPackHelp_misc").checked){
          document.getElementById("sliderLinkOpacityValue").disabled= true;
          setHelperElementsActive(false);
        }
    }
  }
  
  document.getElementById("showEduPackHelp_misc").onclick = function(e){
    if(document.getElementById("showEduPackHelp_misc").checked){
      localStorage.setItem("helper_misc", "true");
      // alert("misc activated: " + localStorage.getItem("helper_misc"));
      document.getElementById("sliderLinkOpacityValue").disabled= false;
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "misc");
      setHelperElementsActive(true);
    } else {
        localStorage.setItem("helper_misc", "false");
        // alert("misc deactivated: " + localStorage.getItem("helper_misc"));
        deleteXMLDetailDescriptionElements("misc");
        if(!document.getElementById("showEduPackHelp_description").checked && !document.getElementById("showEduPackHelp_parameter").checked && !document.getElementById("showEduPackHelp_misc").checked){
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
  
  var latest_task_int = parseInt(latest_task-1);
  for(var i = 0; i < latest_step; i++){
    latest_task_int += numberMenuEntries['0'+i]
  }
  latest_task = latest_task_int.toString();
  
  //////////////////////////////////////////////////////////////  
  // TODO
  // tutorial_substep_head.eq(latest_task).addClass('active').next().slideDown('normal');
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
   * check scrolling in simulator parameter area
   * TODO: only activate when in simulator tab!!!
   */
  
  

	

	

  
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
   * Behaviour for the manual finish link in detail-steps 
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
          
          for(var i = 0; i < latest_step; i++){
            latest_task_int += numberMenuEntries['0'+i];
          }
          // alert(latest_step);
//           
          var max_task_current_step = latest_task_int;
          for(var i = latest_step-1; i >= 0; i--){
            
            // alert(numberMenuEntries['0'+i]);
            max_task_current_step -= numberMenuEntries['0'+i];
          }
          
          latest_task = latest_task_int.toString();  
          // TODO
          // simulatedClick(document.getElementById("01_02"));
          // alert(numberMenuEntries[latest_step] + ", " + latest_task + ", " + max_task_current_step);
          if(numberMenuEntries[latest_step] == max_task_current_step){
            
            tutorial_head.eq(latest_step).addClass('active').next().slideUp('normal');
            setTimeout(function(){
              latest_step = "0" + (parseInt(latest_step)+1);
              // alert(latest_step);
              tutorial_head.eq(latest_step).addClass('active').next().slideDown('normal');
            }, 800);
          }
          //////////////////////////////////////////
          // tutorial_substep_head.eq(latest_task).addClass('active').next().slideDown('normal');
          // tutorial_head.eq(latest_step).addClass('active').next().slideDown('normal');
          
          var stepId = tutorial_substep_head.eq(latest_task).attr("id").substr(0, tutorial_substep_head.eq(latest_task).attr("id").indexOf('_'));
          var taskId = tutorial_substep_head.eq(latest_task).attr("id").substr(tutorial_substep_head.eq(latest_task).attr("id").indexOf('_')+1, tutorial_substep_head.eq(latest_task).attr("id").length);
          
          localStorage.setItem("latest_step", stepId);
          localStorage.setItem("latest_task", taskId);
          
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
    
        // /*
     // * TODO: old and html tag specific actions 
     // * remove and adapt to xml actions
     // */
    // // activate and start parameter check
    // if ($(this).attr('class').indexOf("parameter-check") != -1){
      // FLAG_tutorialCheck = true;
      // launchNewBurst("new");
      // $(this).addClass('not-completed');
    // }
//     
    // // activate and start parameter check
    // if ($(this).attr('class').indexOf("dev-parameter-check") != -1){
      // FLAG_devTutorialCheck = true;
      // launchNewBurst("new");
      // $(this).addClass('not-completed');
    // }
    // // activate and start new parameter check
    // if ($(this).attr('class').indexOf("compareParametersWithHighlighting") != -1){
      // FLAG_compareHighlights = true;
      // launchNewBurst("new");
      // // moveHighlightArrow();
      // $(this).addClass('not-completed');
    // } 
//     
    // if (($(this).attr('class') == 'completed') ){
      // $(this).parent().slideUp('normal');
      // $(this).parent().next().stop(true,true).slideToggle('normal');
    // } 
  });
  
  
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
  // for (var h = 0; h < 2; h++) {
    // for (var v = 0; v < 2; v++) {
      tilePosTop = posTop + v * tileHeight;
      tilePosLeft = posLeft + h * tileWidth;
      var strLinkID = "map_link_" + h + "_" + v;
      hover_image_url = "url('/static/style/img/edupack/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + cs[v] + "_CSF_" + gcf[h] + ".jpeg')";
      
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
        hover_image_url = "url('/static/style/img/edupack/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + 100 + "_CSF_" + 0.07 + ".jpeg')";
        $("#map_link_0_0").hover(function(){
          // use hash table to map tile id's to variable values
          $(".map_simulated_image").css('background-image',hover_image_url);
        });
        hover_image_url = "url('/static/style/img/edupack/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + 60 + "_CSF_" + 0.17 + ".jpeg')";
        $("#map_link_0_1").hover(function(){
          // use hash table to map tile id's to variable values
          $(".map_simulated_image").css('background-image',hover_image_url);
        });
        hover_image_url = "url('/static/style/img/edupack/sim_images/param_exploration_5_subjects/AA_20120815_CS_" + 20 + "_CSF_" + 0.25 + ".jpeg')";
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
    // if(FLAG_HelperElementsActive){
      // document.body.onresize = adaptHelperElementEvent;
      // document.body.onscroll = adaptHelperElementEvent;
      // // window.addEventListener('onresize', adaptHelperElementEvent(FLAG_HelperElementsActive), true);
      // // window.addEventListener('onscroll', adaptHelperElementEvent(FLAG_HelperElementsActive), true);
    // }else{
      // // window.removeEventListener('onresize', adaptHelperElementEvent(FLAG_HelperElementsActive), true);
      // // window.removeEventListener('onscroll', adaptHelperElementEvent(FLAG_HelperElementsActive), true);
    // }
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

// function adaptHelperElementEvent() {
  // alert("jo");
  // if(FLAG_HelperElementsActive){
    // alert("jo");
    // deleteXMLDetailDescriptionElements("parameter");
    // parseXMLDetailDescriptions(xmlDataDetailDescriptions, "parameter");
  // }
//       
// }

function fcSlider_a() {
  var factor = 0.02;
  document.getElementById("overlayVal_a").value = parseInt(((document.getElementById("overlaySlider_a").value * factor) + 0.02)*100)/100.0;
    
  var pic = document.getElementById("img_fc_results");
  pic.src = "/static/style/img/edupack/sim_images/only_FC_for_BOLD/only_FC_for_BOLD_0" + parseInt(document.getElementById("overlayVal_a").value / factor - 0.02) + ".png";
  
}

function fcSlider_src2_a() {
  var factor = 0.02;
  document.getElementById("overlayVal_src2_a").value = parseInt(((document.getElementById("overlaySlider_src2_a").value * factor) + 0.02)*100)/100.0;
    
    var pic = document.getElementById("img_fc_results_src2");
  pic.src = "/static/style/img/edupack/sim_images/FC_for_BOLD/FC_for_BOLD_0" + parseInt(document.getElementById("overlayVal_src2_a").value / factor - 0.02) + ".png";  
}

function fcSlider_src3_a() {
  var factor = 0.01;
  document.getElementById("overlayVal_src3_a").value = parseInt(((document.getElementById("overlaySlider_src3_a").value * factor) + 0.03)*100)/100.0;
    
    var pic = document.getElementById("img_fc_results_src3");
  
  	pic.src = "/static/style/img/edupack/sim_images/timeline_plotter/timeline_plotter_0" + parseInt((document.getElementById("overlayVal_src3_a").value / factor)-3) + ".png";
  
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
  	
	picId.src = "/static/style/img/edupack/sim_images/pics_5s_subs_d0.75_a0.04_0.2_cs20_40_60/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".png";  
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
  	
  	picId.src = "/static/style/img/edupack/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".png";
  	
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
      if(coupling > 17)
        coupling= 17;
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
    
    picId.src = "/static/style/img/edupack/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
    
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
    
    picId.src = "/static/style/img/edupack/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
    
}

// for thesis
function slider_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3() {
    var speed_factor = 20;
    var speed = document.getElementById("speed_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value;
    var coupling = document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value;
    var noise = 3;
    var noise_address;
    
    if(noise == 1){
      // document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = 0.75;
      noise_address = "0_75";
      // coupling 01..17 images, 0.04:0.01:0.2
      document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").max = 17;
      if(coupling > 17)
        coupling= 17;
      document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = (coupling / 100.0 + 0.03).toFixed(3);
    }else if(noise == 2){
      // document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = 1.0;
      noise_address = "1_0";
      // coupling 01..31 images, 0.04:0.005:0.19
      document.getElementById("coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").max = 31;
      document.getElementById("val_coupling_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = (coupling / 100.0 / 2.0 + 0.035).toFixed(3);
    }else if(noise == 3){
      // document.getElementById("val_noise_5s_subs_d075_10_25_a004_001_02_cs20_20_60_3").value = 2.5;
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
    
    picId.src = "/static/style/img/edupack/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";

    
}
// for thesis
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
    
    picId.src = "/static/style/img/edupack/sim_images/pics_5s_subs_d0.75_1.0_2.5_a0.04_0.01_0.2_cs20_20_60_fc/d_" + noise_address + "/c_" + speed + "/timeline_plotter_" + zeroPad(parseInt(coupling), 2) + ".jpg";
    
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
  
  // alert("K11: " + K11);
  // alert("K12: " + K12);
  var picId = document.getElementById("img_15s_D075_a012_cs100_K11_0_5_K12_0_25");
  
  picId.src = "/static/style/img/edupack/sim_images/timelineplotter_15s_D0.75_a0.12_cs100_K11_5_K12_2.5/K12_" + K12 + "_K11_" + K11 + ".png";
    
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
  	
  	picId.src = "/static/style/img/edupack/sim_images/pics_150s_Bold_cs_20_40_60_a0.1_0.03_0.16/a_" + coupling + "/FC_for_BOLD_" + zeroPad(parseInt(speed), 2) + ".png";  
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

// http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
function OnMouseDown(e)
{
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
        
        // grab the clicked element's position
        // alert(target);
        
        
        // alert(getOffset( document.getElementsByName('helpOverlay_modal_box')).left);
        if(FLAG_overlay_new){
          _offsetX = _startX;
          _offsetY = _startY;
          FLAG_overlay_new = false;
        }else {
          _offsetX = ExtractNumber(target.style.left);
          _offsetY = ExtractNumber(target.style.top);
        }
        
        // bring the clicked element to the front while it is being dragged
        // _oldZIndex = target.style.zIndex;
        // target.style.zIndex = 10000;
        
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

function OnMouseMove(e)
{
    if (e == null) 
        var e = window.event; 

    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
    
}


function OnMouseUp(e)
{
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
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
  
  var name, content, group, section, type; 
  
  $(data).find("description").each(function() {

    section = $(this).attr("section");
    // alert(section);
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
        }else 
          addHelperElements(section, group, name, content, type, null, false);
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
  
  var name, content, type, section, group, read; 
    alert("hallo");
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
      yOffset = -345; // due to the upload button in project... TODO: bad solution
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
  // alert(xOffset);
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

    //special bonus for those using jQuery
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
    // document.getElementById("detail_01_02").innerHTML+=document.getElementsByName('highlighted').length;
    highlight_arrow_position = getOffset( document.getElementsByName('highlighted')[current_highlight_arrow_position]);
    // document.getElementById("compareParametersWithHighlighting").innerHTML="length: " + document.getElementsByName('highlighted').length + "left: " + highlight_arrow_position.left + ", top: " + highlight_arrow_position.top;
    // moveDivToXY("highlight_arrow", Math.floor(Math.random()*1000), Math.floor(Math.random()*800));
    // document.getElementById("detail_01_02").innerHTML+= "(" + highlight_arrow_position.left + ", " + highlight_arrow_position.top + ")";
    moveDivToXY("highlight_arrow", highlight_arrow_position.left, highlight_arrow_position.top);
  }
}

// x coming from left, y coming from top in screen
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
 * function that checks for actions within a substep in xml data
 */
function checkForPrecondition(xml_data, stepId, taskId){
  var returnValue = true;
  if(FLAG_edupackActive){
      // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "hui yeah, works";
      
      $(xml_data).find("step").each(function() {
        if($(this).find("step-id").text() == stepId){
          $(this).find("sub-step").each(function() {        
            if($(this).find("value").text() == taskId){
              // when landing in here, we've got the correct element
              $(this).find("precondition").each(function() {
                // evaluate the action and call specific functions $(this).attr("type")
                // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions" + $(this).attr("type") + "<br/>";
                
                var precondition = $(this).attr("section");
                // alert(document.getElementById(precondition)); 
                // alert("pre: " + document.getElementById(precondtition).text());
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
  
  // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "hui yeah, works";
  
  $(xml_data).find("step").each(function() {
    if($(this).find("step-id").text() == stepId){
      $(this).find("sub-step").each(function() {        
        if($(this).find("value").text() == taskId){
          // when landing in here, I've got the correct action element
          $(this).find("action").each(function() {
            // evaluate the action and call specific functions $(this).attr("type")
            // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions" + $(this).attr("type") + "<br/>";
            
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
              // alert(actionName);
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {"helper_type":helper_type, "group":group, "read":read });
              
            }else if(type == "autopilot"){
              
              var section = $(this).attr("section");
              var group = $(this).attr("group");
              var helper_type = $(this).attr("helper_type");
              var variable_name = $(this).attr("variable_name");
              var value = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
              
              // create action, that it can get removed when task is closed
              var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
              // alert(actionName);
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {"helper_type":helper_type, "group":group});
              
            }else if(type =="move_edupack"){
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
              // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions before: " + section + variable_name + value + "<br/>";
              // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions before: " + typeof(section) + typeof(variable_name) + typeof(value) + "<br/>";
              var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
              addAction(type, section, variable_name, value, stepId, taskId, actionName, {});
              // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions after<br/>";
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
            // evaluate the action and call specific functions $(this).attr("type")
            // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions" + $(this).attr("type") + "<br/>";
            
            
            var type = $(this).attr("type"); 
            var section = $(this).attr("section");
            var variable_name = $(this).attr("variable_name");
            var value = $(this).attr("value");
            // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions before: " + section + variable_name + value + "<br/>";
            // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions before: " + typeof(section) + typeof(variable_name) + typeof(value) + "<br/>";
            
            var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
            
            removeAction(type, section, variable_name, value, stepId, taskId, actionName);
            // document.getElementById("detail_" + stepId + "_" + taskId).innerHTML += "3. hui yeah, unload";
            // document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions after<br/>";
          
          });
        }
      });   
    }
  });
  return true;
}

/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
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

/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
function actionOverlay(mode, content){
  
  
  
  if(mode == 'display') {
    // add block page
    var block_page = $('<div class="paulund_block_page"></div>');
    $(block_page).appendTo('body');
    
    // add popup box
    var pop_up = $('<div class="paulund_modal_box"><a href="#" class="paulund_modal_close">x</a><div class="paulund_inner_modal_box">' + content + '</div></div>');
    // TODO timeseries viewer integrated
    // var content =
          // '<h2>Dataset 1:</h2><iframe width="90%" height="100%" src="/burst/launch_visualization/0/100/100"' +  
            // // 'py:if="portlet_entity.status == ' + '"finished"' + '"' + 
          // 'onload="this.contentWindow.launchViewer(500, 100);"></iframe>' + 
          // '<br><br><br><hr><br><br><br><h2>Dataset 2:</h2><iframe width="90%" height="100%" src="/burst/launch_visualization/0/100/100"' +  
            // // 'py:if="portlet_entity.status == ' + '"finished"' + '"' + 
          // 'onload="this.contentWindow.launchViewer(500, 100);"></iframe>';
        // // '<div id="portlet-view-${portlet_entity.td_gid}" class="portlet portlet-type-${portlet_entity.algorithm_identifier.lower()} portlet-${portlet_idx if defined(' + '"portlet_idx"' +') else portlet_entity.index_in_tab}" ' +
          // // 'xmlns:py="http://genshi.edgewall.org/">' +
          // // // '<h5>${portlet_entity.name}</h5>' +
          // // // '<div class="specialviewer" >' +
          // // '<iframe width="100%" height="100%" src="/burst/launch_visualization/0/500/600"' +  
            // // 'py:if="portlet_entity.status == ' + '"finished"' + '"' + 
          // // 'onload="this.contentWindow.launchViewer(500, 400);"></iframe>' +
          // // // '<div class="errorMessage" py:if="portlet_entity.status == ' + '"error"' + '">ERROR: ${portlet_entity.error_msg}</div>' +
          // // // '<div class="warningMessage" py:if="portlet_entity.status == ' + '"canceled"' + '">STATUS: Operation canceled by user!</div>' +
          // // // '<div class="infoMessage" py:if="portlet_entity.status == ' + '"running"' + '">' +
            // // // 'STATUS: Operation is still running!' +
          // // // '</div>' +
        // // // '</div>' +
        // // '<input type="hidden" id="running-portlet-${portlet_entity.index_in_tab}" value="${portlet_entity.td_gid}" py:if="portlet_entity.status == ' + '"running"' + '"/>' +
      // // '</div>'; 
    // var pop_up = $('<div class="paulund_modal_box"><a href="#" class="paulund_modal_close"><b>x</b></a><div class="paulund_inner_modal_box">' + content + '</div></div>');
    $(pop_up).appendTo('.paulund_block_page');
    
    $('.paulund_block_page').dblclick(function(){
      $(this).fadeOut().remove();
      $('.paulund_modal_close').fadeOut().remove();        
    });  
    
    $('.paulund_modal_close').click(function(){
      $(this).parent().fadeOut().remove();
      $('.paulund_block_page').fadeOut().remove();         
    });
    
      // if the overlay is dbl clicked, don't act as the parent (block_page) and close it
	  $('.paulund_modal_box').dblclick(function(e){
	  	e.stopPropagation();
	  });
    
    $('.paulund_modal_box').fadeIn();
  } else {
    
    $('.paulund_modal_box').fadeOut();
    
  }
  
  generateStylesForOverlay();
} 




function closeThisOverlay(){
  $('.paulund_block_page').fadeOut().remove();
  $('.paulund_modal_close').fadeOut().remove();        
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
    
    // TODO: adapt position if out of screen, but resolution call is always 1920
    // alert(String(window.innerWidth));
    // alert(String(document.documentElement.clientWidth));
    // if ((document.documentElement.clientWidth - left) <= element.style.width){
      // left = document.documentElement.clientWidth - element.style.width;
      // alert("whush");
    // }
    element.style.left = left + 'px';     
  }
  
  $('.helpOverlay_modal_box').fadeIn();
  FLAG_overlay_new = true;
  
} 

function readOutLoud(content){
  // alert(content);
  var msg = new SpeechSynthesisUtterance(content.replace(/<(?:.|\n)*?>/gm, ''));
  window.speechSynthesis.speak(msg);
}


function parseProjectXML(xml_data){
  var parameters;
  // alert("in parser method");
  $(xml_data).find("tvb_data").each(function() {
    parameters = $(this).find("parameters").text();
    // delete all "&quot;" elements
    
    // .replace("[","").replace("]","");
    parameters = parameters.replace(/(&quot;|[|])/gm, "");
    // parameters = parameters.replace(/ /g, "");
    var obj = JSON.parse(parameters);
    // >> Object({ id: 0, folder: "Next", text: "Apple" })
    parameterCheckHash = new HashTable(obj);
  });
  // alert(getStringFromHashTable(parameterCheckHash));
  // checkParametersFromHash();
  // document.getElementById("detail_01_01").innerHTML += parameterCheckHash;
}

// document.getElementById("section-simulator-main").onscroll = function(e){
    // // moveHighlightArrow();
    // alert("scroll");
    // // if($('.showEduPackHelp_description').is(':checked')){
      // // parseXMLDetailDescriptions(xmlDataDetailDescriptions);
    // // }
// }




function checkParametersFromHash(){
  
  
  
  // compare currentParameters with data from project xml
  var currentParameters = getCurrentParameterHashTable();
  // TODO work with copy of object and removeItem locally or just add / remove actions and check all params?
  var hash = jQuery.extend(true, {}, parameterCheckHash); // get copy of global variable
    // hash = parameterCheckHash;
  
  // alert(hash.keys());
  // alert(currentParameters.keys());
  
  // iterate over elements from xml and compare it with current parameters
  // if they match, delete them from the hash
  // TODO
  if(hash.getItem("currentAlgoId"))
    hash.removeItem("currentAlgoId");
  if(hash.getItem("connectivity"))
    hash.removeItem("connectivity");  
  
  var keys = hash.keys();
  var len = keys.length;
  
  // for (var k in currentParameters.items) {
    // if (currentParameters.hasItem(k)) {
        // alert('key is: ' + k + ', value is: ' + currentParameters.items[k]);
    // }
  // }

  for (var i = 0; i < len; i++) {
    // alert("anfang for: " + currentParameters.getItem(keys[i]) + ", " + hash.getItem(keys[i]));
    if(currentParameters.getItem(keys[i]) == hash.getItem(keys[i])){
      
      hash.removeItem(keys[i]);
      removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 03, 02, "highlight_" + keys[i]);
      
    }
    else if(String(hash.getItem(keys[i])).localeCompare(String(currentParameters.getItem(keys[i]))) == 0){
      
      hash.removeItem(keys[i]);
      removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 03, 02, "highlight_" + keys[i]);
    }
     else {
      // alert("something to highlight");
      addAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 03, 02, "highlight_" + keys[i], {});
      // alert("current: " + currentParameters.getItem(keys[i]) + ", xml: " + hash.getItem(keys[i]));
    }
//     


    // var a = String(hash.getItem(keys[i]));
    // var b = String(currentParameters.getItem(keys[i]));
    // if(a.localeCompare(b) == 0){
      // // alert("removed a:" + keys[i]);
      // hash.removeItem(keys[i]);
      // removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 01, 02, "highlight_" + keys[i]);
    // }
  }
  
  // for (var i = 0, keys = hash.keys(), len = keys.length; i < len; i++) {
    // alert("key: " + keys[i] + ", current: " + currentParameters.getItem(keys[i]) + ", xml: " + hash.getItem(keys[i]));
  // }
  
  // when finished comparing, check if all keys matched ( parameterCheckHash is then empty)
  // if not, start calling this method after each click
  if(hash.keys().length == 0){
    FLAG_correctParameters = true;
    FLAG_eduCase = true;
    document.getElementById("read_project_xml").innerHTML += "<br/>Congrats, you are now ready to start the simulation";
  } else {
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
function loadXML(filename){
  
  /*
   * reads a hardcoded xml tutorial file
   * when reading was successful, start to parse and generate EduPack
   * visuals out of it (menu, tasks, ...)
   */
  // TODO file management and references -_-
  $.ajax({
    type: "GET",
    // url: "/static/js/edupack/xml/edupack_Operation.xml",
    url: "/static/js/edupack/xml/edupack_paul_Operation.xml",
    // url: "/Users/henrikmatzke/TVB/PROJECTS/Default_Project_admin/15/Operation.xml",
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

/*
 * TODO: when to call this function? it only needs the span identifier: highlight_conduction_speed
 */
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
      // addHelperElements(section, opts['group'], variable_name, value, opts['helper_type'], taskId, false);
    }
    
  
    if(type == "highlight"){
      
      actionHighlight(section, variable_name, value);
      // activateFLAG_schowHighlightArrow();
      // // moveHighlightArrow();
    }
    if(type == "timeseries"){
      
      // initTimeseriesViewer("$baseURL", "$preview", "$shape", "$t0", "$dt",$labels_json);
      // initTimeseriesViewer("/flow/read_datatype_attribute/09d48bcc-bdcc-11e3-b785-1093e900d146", "True", "[200, 3, 96, 3]", "5.0048828125", "5.0048828125","RM-TCpol_R,RM-TCs_R,RM-Amyg_R,RM-PFCoi_R,RM-IA_R,RM-PFCom_R,RM-TCc_R,RM-PFCol_R,RM-TCi_R,RM-PHC_R,MM82a-G_R,RM-PMCvl_R,RM-VACv_R,RM-Ip_R,RM-PFCpol_R,RM-HC_R,RM-CCs_R,RM-PFCvl_R,RM-V2_R,RM-PFCm_R,RM-TCv_R,RM-VACd_R,RM-V1_R,RM-PFCcl_R,RM-A2_R,RM-CCr_R,RM-CCp_R,RM-CCa_R,RM-S2_R,RM-S1_R,RM-A1_R,RM-M1_R,RM-PCi_R,RM-PCm_R,RM-PFCdm_R,RM-PCip_R,RM-PCs_R,RM-FEF_R,RM-PFCdl_R,RM-PMCm_R,RM-PMCdl_R,TM-F_R,TM-T_R,TM-OP_R,BG-Cd_R,BG-Pu_R,BG-Pa_R,BG-Acc_R,RM-TCpol_L,RM-TCs_L,RM-Amyg_L,RM-PFCoi_L,RM-IA_L,RM-PFCom_L,RM-TCc_L,RM-PFCol_L,RM-TCi_L,RM-PHC_L,MM82a-G_L,RM-PMCvl_L,RM-VACv_L,RM-Ip_L,RM-PFCpol_L,RM-HC_L,RM-CCs_L,RM-PFCvl_L,RM-V2_L,RM-PFCm_L,RM-TCv_L,RM-VACd_L,RM-V1_L,RM-PFCcl_L,RM-A2_L,RM-CCr_L,RM-CCp_L,RM-CCa_L,RM-S2_L,RM-S1_L,RM-A1_L,RM-M1_L,RM-PCi_L,RM-PCm_L,RM-PFCdm_L,RM-PCip_L,RM-PCs_L,RM-FEF_L,RM-PFCdl_L,RM-PMCm_L,RM-PMCdl_L,TM-F_L,TM-T_L,TM-OP_L,BG-Cd_L,BG-Pu_L,BG-Pa_L,BG-Acc_L");
      // alert("Damn");
      actionOverlay("display", "tut");
      // alert("damn2");
      // add thi portlet div here
      
      /*
       * initTimeSeriesViewer:

baseURL: /flow/read_datatype_attribute/09d48bcc-bdcc-11e3-b785-1093e900d146

isPreview: True

dataShape: [200, 3, 96, 3]

t0: 5.0048828125

dt: 5.0048828125

channelLabels: RM-TCpol_R,RM-TCs_R,RM-Amyg_R,RM-PFCoi_R,RM-IA_R,RM-PFCom_R,RM-TCc_R,RM-PFCol_R,RM-TCi_R,RM-PHC_R,MM82a-G_R,RM-PMCvl_R,RM-VACv_R,RM-Ip_R,RM-PFCpol_R,RM-HC_R,RM-CCs_R,RM-PFCvl_R,RM-V2_R,RM-PFCm_R,RM-TCv_R,RM-VACd_R,RM-V1_R,RM-PFCcl_R,RM-A2_R,RM-CCr_R,RM-CCp_R,RM-CCa_R,RM-S2_R,RM-S1_R,RM-A1_R,RM-M1_R,RM-PCi_R,RM-PCm_R,RM-PFCdm_R,RM-PCip_R,RM-PCs_R,RM-FEF_R,RM-PFCdl_R,RM-PMCm_R,RM-PMCdl_R,TM-F_R,TM-T_R,TM-OP_R,BG-Cd_R,BG-Pu_R,BG-Pa_R,BG-Acc_R,RM-TCpol_L,RM-TCs_L,RM-Amyg_L,RM-PFCoi_L,RM-IA_L,RM-PFCom_L,RM-TCc_L,RM-PFCol_L,RM-TCi_L,RM-PHC_L,MM82a-G_L,RM-PMCvl_L,RM-VACv_L,RM-Ip_L,RM-PFCpol_L,RM-HC_L,RM-CCs_L,RM-PFCvl_L,RM-V2_L,RM-PFCm_L,RM-TCv_L,RM-VACd_L,RM-V1_L,RM-PFCcl_L,RM-A2_L,RM-CCr_L,RM-CCp_L,RM-CCa_L,RM-S2_L,RM-S1_L,RM-A1_L,RM-M1_L,RM-PCi_L,RM-PCm_L,RM-PFCdm_L,RM-PCip_L,RM-PCs_L,RM-FEF_L,RM-PFCdl_L,RM-PMCm_L,RM-PMCdl_L,TM-F_L,TM-T_L,TM-OP_L,BG-Cd_L,BG-Pu_L,BG-Pa_L,BG-Acc_L
       */
    }
    // if(type == "project_xml"){
      // // loadXML("tralala");
      // // parseProjectXML(projectXML);
      // // checkParametersFromHash();
    // }
    // if(type == "overlay"){
      // actionOverlay('display', '<h1>Test</h1>test2');
    // }
  }
}




// http://javascript.info/tutorial/animation

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
      // alert(fromX);
      // element.style.left = (fromX-toX) * delta + "px";
      // element.style.top  = (fromY-toY) * delta + "px";
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
  // alert("easeout");
  return function(progress) {
    return 1 - delta(1 - progress)
  }
}


function callAutoPilot(section, group, variable_name, value, type, taskId, readOut){
  // alert("click? " + variable_name);
  var a = document.getElementById(variable_name);
  var left = a.getElementsByTagName('a')[0].offsetLeft;
  var top = a.getElementsByTagName('a')[0].offsetTop;
  // // a.getElementsByTagName('a')[0].click();
  // // a.getElementsByTagName('a')[0].position();

  

  changeFLAG_schowAnimationArrow();
  // alert(document.getElementById("animation_arrow").style.left);
  // var bounceEaseOut = makeEaseOut(bounce)

  
  moveMe(document.getElementById("animation_arrow"), makeEaseOut(bounce), {x: left, y: top});
  
  // changeFLAG_schowAnimationArrow();
  // var element;
  // var xOffset, yOffset;
  // var specialElement = false;
//   
  // if(section == "s-burst"){
    // xOffset = 0;
    // yOffset = -30;
    // if(type=="parameter"){
      // // xOffset = -150;
      // // yOffset = 200;
      // if(variable_name=="button-launch-new-burst"){
        // xOffset = -40;
        // yOffset = -5;
      // }
      // if(variable_name=="connectivity"){
        // xOffset = -60;
        // yOffset = -15;
      // }
      // if(variable_name=="conduction_speed"){
        // xOffset = -80;
        // yOffset = -15;
      // }
      // if(variable_name=="coupling"){
        // xOffset = -60;
        // yOffset = -15;
      // }
    // }
  // } else if(section == "s-project"){
    // // TODO: here: weird check for specific section on site
    // // found on page of data structure menu
    // if(document.getElementsByClassName("data-view view-column col-2")[0]){
      // xOffset = 0;
      // yOffset = -45;
    // } else { // project main menu
      // xOffset = 300;
      // yOffset = -35;
    // }
  // } else if(section == "s-connectivity"){
    // // xOffset = Math.floor((Math.random()*70)); good for menu, but not in interface
    // xOffset = 0; 
    // yOffset = -45;
    // if(group == "elementClass")
      // yOffset = -345; // due to the upload button in project... TODO: bad solution
  // } else {
    // xOffset = 0;
    // yOffset = 0;
  // }
  // // some random factor
  // xOffset += Math.floor((Math.random()*12)-6);
  // yOffset += Math.floor((Math.random()*12)-6);
//   
  // if(group=="elementName"){
    // element = document.getElementsByName(variable_name)[0];
    // if(variable_name == "create" || variable_name == "save"){
      // xOffset = 0;
      // yOffset = 0;
    // }
  // } else if(group=="elementId"){
    // element = document.getElementById(variable_name);
    // if(variable_name == "description"){
      // xOffset = 350;
      // yOffset = 50;
    // }
    // if(variable_name == "name"){
      // yOffset += 10;
    // }
// 
//     
  // } else if(group=="elementClass"){
    // // only the upload button so far, therefore the yOffset was adapted
    // element = document.getElementsByClassName(variable_name)[0];
    // xOffset += 15;
    // yOffset += 300;
    // if(variable_name == "id"){
      // element = document.getElementsByClassName(variable_name)[1];
      // xOffset = 70;
      // yOffset = -10;
    // }
    // if(variable_name == "data"){
      // element = document.getElementsByClassName(variable_name)[1];
      // xOffset = 120;
      // yOffset = -10;
    // }
    // if(variable_name == "action action-upload"){ // upload button
      // element = document.getElementsByClassName(variable_name)[0];
      // xOffset = 60;
      // yOffset = 460;
    // }
  // } else if(group=="elementUpload"){
    // // only the upload button so far, therefore the yOffset was adapted
    // element = document.getElementsByClassName(variable_name)[0];
    // xOffset = 0;
    // yOffset = 0;
  // } else if(group=="elementId_data1"){
    // element = document.getElementById(variable_name);
    // xOffset += 100;
    // yOffset += 5;
  // } else if(group=="elementId_data2"){
    // element = document.getElementById(variable_name);
    // xOffset += 200;
    // yOffset += 5;
  // }
  // // alert(xOffset);
  // // check for elements from footer menu
  // if(variable_name == "nav-user" || 
     // variable_name == "nav-project" || 
     // variable_name == "nav-burst" || 
     // variable_name == "nav-analyze" || 
     // variable_name == "nav-stimulus" || 
     // variable_name == "nav-connectivity"){
       // specialElement = true;
//        
       // if(variable_name == "nav-user"){
         // xOffset = 160;
       // }else if(variable_name == "nav-project"){
         // xOffset = 200; 
       // }else if(variable_name == "nav-burst"){
         // xOffset = 250; 
       // }else if(variable_name == "nav-analyze"){
         // xOffset = 210; 
       // }else if(variable_name == "nav-stimulus"){
         // xOffset = 220; 
       // }else if(variable_name == "nav-connectivity"){
         // xOffset = 230; 
       // }else {
         // xOffset = 0;
       // }
       // yOffset = 0;
     // }
//   
  // // check if is in viewport or actually not visible (like in hidden menues)
  // if((isElementInViewport(element) || specialElement) && (element.offsetWidth > 0 && element.offsetHeight > 0)){
//     
// 
    // var pos_element = getOffset(element);
//     
    // pos_element.left += xOffset;
    // pos_element.top  += yOffset;
//     
    // // alert(pos_element.left);
    // var methodName = "helpOverlay('" + value + "', " + pos_element.left + ", " + pos_element.top + ", " + readOut + ")";
//     
    // if(type == "task")
      // var link = '<a href="#" onclick="' + methodName + '"><b>' + taskId + '.</b>';//Click here to open additional information.</a><br/>';
    // else
        // var link = '<a href="#" onclick="' + methodName + '">';
//         
    // var block_page_name = "linkOverlay_block_page_" + type;
    // if(!document.getElementById(block_page_name)){
      // var block_page = $('<div class="' + block_page_name + '" id="' + block_page_name + '"></div>');
      // $(block_page).appendTo('body');
    // }
// 
    // var elemName = "linkOverlay_elements_" + type;
    // var elemId = type + "_" + variable_name;
    // var pop_up = $('<div name="' + elemName + '" class="' + elemName + '" id="' + elemId +'">' + link +'</a></div>');
// 
    // // needs '.' for accessing this element
    // $(pop_up).appendTo('.' + block_page_name);
    // // position of speech bubble div image
    // document.getElementById(elemId).style.left = (pos_element.left) + 'px';
    // document.getElementById(elemId).style.top =  (pos_element.top) + 'px';
  // }
// 
  // var opac = document.getElementById('sliderLinkOpacityValue').value / 100.;
  // $('.linkOverlay_elements_description_'+type).css('opacity', opac);
  
  return true;
  
}

/*
 * not finished
 * TODO more specific about active actions, names (with step and task id) etc. 
 * not only delete a highlighter because of name highlight_conduction_speed
 */
function removeAction(type, section, variable_name, value, stepId, taskId, actionName){
  activeActions.removeItem(stepId + '_' + taskId + '_' + actionName, actionName);
  
  if((type == "highlight") || (type == "project_xml")){
    actionRemoveElement(type, variable_name);
    // // moveHighlightArrow();
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
  // actionHighlight(section, variable_name, value);
  // activeActions.removeItem(stepId + ' ' + taskId, actionName);
  actionRemoveElement(variable_name);
}

/*
 * not finished
 * TODO RemoveAll function steps
 */
function removeAllActionsFromStep(section, variable_name, value, stepId, taskId){
  // actionHighlight(section, variable_name, value);
  // activeActions.removeItem(stepId + ' ' + taskId, actionName);
}

/*
 * not finished
 * TODO RemoveAll function for whole tutorial
 */
function removeAllActionsFromStep(section, variable_name, value, stepId, taskId){
  // actionHighlight(section, variable_name, value);
  // activeActions.removeItem(stepId + ' ' + taskId, actionName);
}

/*
 * <Pages>
  <Page Name="test">
    <controls>
      <test>this is a test.</test>
    </controls>
  </Page>
  <page Name = "User">
    <controls>
      <name>Sunil</name>
    </controls>
  </page>
</Pages>

var $xml = $(jQuery.parseXML(xml));

var $test = $xml.find('Page[Name="test"] > controls > test');
 */


/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
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
    // if(property.indexOf(""))
    /*
     * conduction_speed: 5.0
     * model: ReducedSetHindmarshRose
     * simulation_length: 500.0
     */
      output += property + ': ' + data[property]+'<br> ';
  }
  document.getElementById(id).innerHTML=output;
  FLAG_devTutorialCheck = false;
}

function tutorialParameters(data){
  var output = 'ToDo: load specific parameters from project file <br/>Please go to the Configuration Tab and set the following parameters:';
  
  var count_correct = 0;
  for (property in data) {
    if(property.localeCompare("conduction_speed") == 0){
      if(data[property] == 5.0){//}.indexOf("5.0") != -1){
        // good
        output+="<br/><font color='#45cc3e'>1. Conduction Speed: 5.0</font>";
        count_correct+=1;
        document.getElementById("span_two_3").innerHTML="<font color='#ff0000'>driin</font>";
      } else {
        // bad
        output+="<br/><font color='#ff0000'>1. Please change: Conduction Speed: 5.0</font>";
      }
    }else if(property.localeCompare("model") == 0){
      if(data[property].indexOf("ReducedSetHindmarshRose") != -1){
        // good
        output+="<br/><font color='#45cc3e'>3. Local Dynamic Model: select Stefansecu Jirsa 3D</font>";
        count_correct+=1;
      } else {
        // bad
        output+="<br/><font color='#ff0000'>3. Local Dynamic Model: select Stefansecu Jirsa 3D</font>";
      }
    } else if(property.localeCompare("simulation_length")  == 0){
      if(data[property] == 20.0){//}.indexOf("20.0") != -1){
        // good
        output+="<br/><font color='#45cc3e'>2. Set the simulation length to 20 ms</font>";
        count_correct+=1;
      } else {
        // bad
        output+="<br/><font color='#ff0000'>2. Set the simulation length to 20 ms</font>";
      }
    }
    /*
     * conduction_speed: 5.0
     * model: ReducedSetHindmarshRose
     * simulation_length: 500.0
     */
      // output += property + ': ' + data[property]+'<br> ';
  }
  
  if(count_correct == 3){
    output+="<br/><br/><a href='#' id='two_3' class='parameter-check'>Good, you're done with this task</a>";
    document.getElementById("span_two_3").innerHTML="<font color='#45a23e'>done</font>";
    FLAG_recheck=false;
  }else {
    output+="<br/><br/><a href='#' id='two_3' class='parameter-check'>Click here after your correction to check the parameters again</a>";
    document.getElementById("span_two_3").innerHTML="<font color='#ff0000'>incomplete</font>";
    FLAG_recheck=true;  
  }
  
  document.getElementById("tut_info").innerHTML=output;
  // document.getElementById("span_two_4").innerHTML="bla";
  
  return true;
}

function tutorialParameters2(data){
  //var output = 'ToDo: load specific parameters from project file <br/>Please go to the Configuration Tab and set the following parameters:';
  var b = document.getElementById('section-simulator-main'); 
  current_highlight_arrow_position = 0;
  
  var count_correct = 0;
  for (property in data) {
    if(property.localeCompare("conduction_speed") == 0){
      if(data[property] == 5.0){//}.indexOf("5.0") != -1){
        // good
        count_correct+=1;
        unhighlight2("conduction_speed");
      } else {
        // bad
        highlight2(b,'<label for="conduction_speed">','highlight', 'conduction_speed');
        // // moveHighlightArrow();
      }
    }else if(property.localeCompare("model") == 0){
      if(data[property].indexOf("ReducedSetHindmarshRose") != -1){
        // good
        unhighlight2("model");
        count_correct+=1;
      } else {
        // bad
        highlight2(b,'<label for="model">','highlight', 'model'); 
        // // moveHighlightArrow();     
      }
    } else if(property.localeCompare("simulation_length")  == 0){
      if(data[property] == 20.0){//}.indexOf("20.0") != -1){
        // good
        count_correct+=1;
        unhighlight2("simulation_length");
      } else {
        // bad
        highlight2(b,'<label for="simulation_length">','highlight', 'simulation_length');
        // moveHighlightArrow();         
      }
    }
    if(count_correct == 3){
      deactivateFLAG_schowHighlightArrow();
      FLAG_compareHighlights = false;
      document.getElementById("span_two_6").innerHTML="<font color='#45a23e'>done</font>";
      FLAG_correctParameters = true;
    } else
      activateFLAG_schowHighlightArrow();
      
    /*
     * conduction_speed: 5.0
     * model: ReducedSetHindmarshRose
     * simulation_length: 500.0
     */
      // output += property + ': ' + data[property]+'<br> ';
  }
//  
  // if(count_correct == 3){
    // output+="<br/><br/><a href='#' id='two_3' class='parameter-check'>Good, you're done with this task</a>";
    // document.getElementById("span_two_3").innerHTML="<font color='#45a23e'>done</font>";
    // FLAG_recheck=false;
  // }else {
    // output+="<br/><br/><a href='#' id='two_3' class='parameter-check'>Click here after your correction to check the parameters again</a>";
    // document.getElementById("span_two_3").innerHTML="<font color='#ff0000'>incomplete</font>";
    // FLAG_recheck=true; 
  // }
//  
  // document.getElementById("tut_info").innerHTML=output;
  // document.getElementById("span_two_4").innerHTML="bla";
  
  return true;
}


function highlightFunction(){
  //$('li').highlight('Sim');
  $('body').highlight('Local dynamic model');
  //$('body').highlight('a');
  $('body').highlight('State Variable ranges');
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

  // $('a').click(function(){
      // alert("hu");
//       
  // });
  $("li#nav-edupack").toggleClass('clicked');
  
  if (!localStorage.getItem("tvb_active")){ // inactive, so activate it now
    localStorage.setItem("tvb_active", true);
    FLAG_edupackActive = true;
    // alert("tvb active, stored");
    // document.getElementById("edupackOverlay").style.display="block";
    document.getElementById("container").style.display="block";
    checkAndLoadHelpElements();
  }else {
    localStorage.removeItem("tvb_active");
    // alert("edupack off and tvb_active removed");
    // document.getElementById("edupackOverlay").style.display="none";
    document.getElementById("container").style.display="none";
    FLAG_edupackActive = false;
    // alert(localStorage.getItem("tvb_active"));
    deleteXMLDetailDescriptionElements("description");
    deleteXMLDetailDescriptionElements("parameter");
    deleteXMLDetailDescriptionElements("misc");
  }
}

function loadEdupack(){
  // alert("loadedupack");
	// document.getElementById("edupackOverlay").style.display="block";
	document.getElementById("container").style.display="block";
	FLAG_edupackActive = true;
}

function checkAndLoadHelpElements(){

  // alert("desc: " + localStorage.getItem("helper_description"));  
  // alert("param: " + localStorage.getItem("helper_parameter"));
  // alert("misc: " + localStorage.getItem("helper_misc"));

  if(localStorage.getItem("helper_description") == "true"){
    // alert("a desc: " + localStorage.getItem("helper_description"));
    document.getElementById("showEduPackHelp_description").checked = true;
    if(FLAG_edupackActive){
      
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "description");
      // alert("after parse desc: " + localStorage.getItem("helper_description"));
    }
  }else{
    document.getElementById("showEduPackHelp_description").checked = false;
  }
    
  if(localStorage.getItem("helper_parameter") == "true"){
    // alert("a param: " + localStorage.getItem("helper_parameter"));
    document.getElementById("showEduPackHelp_parameter").checked = true;
    if(FLAG_edupackActive){
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "parameter");
    }
  }else{
    document.getElementById("showEduPackHelp_parameter").checked = false;
  }
    
    
  if(localStorage.getItem("helper_misc") == "true"){
    // alert("a misc: " + localStorage.getItem("helper_misc"));
    document.getElementById("showEduPackHelp_misc").checked = true;
    if(FLAG_edupackActive){
      parseXMLDetailDescriptions(xmlDataDetailDescriptions, "misc");
    }
  } else{
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
      // moveHighlightArrow();
    } else {
      document.getElementById("highlight_arrow").style.display="none";
      FLAG_showHighlightArrow = false;
      // ?
      //$('body').removeHighlights();
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
      // moveHighlightArrow();
    }
}

function testUnHighlighting(){

  var b = $('body'); 
  b.removeHighlight();
  
  changeFLAG_schowHighlightArrow();
  // moveDivToXY("highlight_arrow", Math.floor(Math.random()*1000), Math.floor(Math.random()*800));
      
  // highlight all elements from hashmap
  // for (var i = 0, v = hashMap.values(), len = v.length; i < len; i++) {
      // b.highlight(v[i]);
  // }
  
}

function testHighlighting(){

  var b = $('body'); 
  b.highlight('Cortical surface');

  
  changeFLAG_schowHighlightArrow();
  // moveDivToXY("highlight_arrow", Math.floor(Math.random()*1000), Math.floor(Math.random()*800));
      
  // highlight all elements from hashmap
  // for (var i = 0, v = hashMap.values(), len = v.length; i < len; i++) {
      // b.highlight(v[i]);
  // }
  
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
  // hashMap.setItem('surface', 'Surface');
  // hashMap.setItem('surface', 'Surface');
  // hashMap.setItem('surface', 'Surface');
  // hashMap.setItem('surface', 'Surface');
  // hashMap.setItem('surface', 'Surface'); 
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