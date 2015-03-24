
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