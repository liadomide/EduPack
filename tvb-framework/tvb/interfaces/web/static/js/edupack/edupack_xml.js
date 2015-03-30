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


function setHelperElementsActive(value){
  
  if(value != FLAG_HelperElementsActive){
    FLAG_HelperElementsActive = value;
  }
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


function ExtractNumber(value)
{
    var n = parseInt(value);
  
    return n == null || isNaN(n) ? 0 : n;
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
      if(variable_name=="burst-history"){
        xOffset = 70;
        yOffset = -60;
      }
    }else if(type=="parameter"){
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