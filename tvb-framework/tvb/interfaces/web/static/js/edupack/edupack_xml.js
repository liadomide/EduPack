
// ---------------------------------------------------------
//              EDUPACK RELATED FUNCTIONS
// ---------------------------------------------------------
var FLAG_edupackActive = false;
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


var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _debug = $('debug');    // makes life easier
var FLAG_overlay_new;


// hashtable that is used for storing 
var parameterCheckHash;
var FLAG_parameters = false;
var projectXML;

var xmlDataDetailDescriptions;

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
	
	/*
	 * reads a hardcoded xml tutorial file
	 * when reading was successful, start to parse and generate EduPack
	 * visuals out of it (menu, tasks, ...)
	 */
	$.ajax({
		type: "GET",
		url: "/static/js/edupack_xml_tutorial.xml",
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
	
	

	

	
});



/*
 * TODO comment on function
 */
function parseXMLTutorial(data) {

	var output = '',
		stepId,
		subStepValue,
		subStepAddress,
		manualFinishLink,
		contentString;
 	
 	// TODO, this loads a specific project simulations xml file with parameters of a simulation
 	loadXML("tralala");
 	
	/*
	 * generate the HTML Code for the EduPack, filled with the loaded XML tutorial
	 */
	
	output +='<div><h2 align="center"><u>' + $(data).find("title").text() + '</u></h2></div><br/>';
	output +='<div class="tutorial_area" id="tutorial_area">';
	output += '<input type="checkbox" name="showEduPackHelp" id="showEduPackHelp" class="showEduPackHelp" value="showEduPackHelp">Show TVB-EduPack Helper&nbsp;&nbsp;&nbsp;&nbsp;';
	output += '<input type="range" onchange="changeLinkOpacity(event)" disabled="true" value="80" max="100" min="0" id="sliderLinkOpacityValue"><br/><br/>';
        
    
	output += '<u>Description:</u> <br/>' + $(data).find("description").text() + '<br/><br/>';
	  
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
		
		output += '<ul class="sub-step">';
    	$(this).find("sub-step").each(function() {	
    		subStepValue = $(this).find("value").text();
    		subStepAddress = stepId + '_' + subStepValue;
    		output += 	'<li id="' + subStepAddress + '" class="sub-introduction">' +
              			'<a href="#' + subStepAddress + '" id="' + subStepAddress + '">';
            output += 'Task ' + subStepValue + ': ';
            output += $(this).find("task").text();
            output += '<span id="span_' + subStepAddress + '">open</span></a>';
            output += '<p class="detail-step" id="detail_' + subStepAddress +'">';
    		output += $(this).find("detail").text();
    		// TODO what happens if there's no manual link
    		// TODO show achievement list for automated goals
    		manualFinishLink = $(this).find("finish_constraints").find("manual").text();
    		$(this).find("overlay").each(function() {	
    			contentString = $(this).find("content").text().replace(/(\r\n|\n|\r)/gm,"");
    			
    			var methodName = "actionOverlay('display', '" + contentString + "')";
    			var methodName2 = "actionOverlay('display', '<img src=/static/js/example_01.png>')";
    			output += '<a href="#" onclick="' + methodName + '">Click here to open additional information.</a><br/>';
    		});
    		$(this).find("read_project_xml").each(function() {	
    			
    			var method = "checkParametersFromHash();";
    			output += '<a href="#" onclick="' + method + '">Click here to load the XML.</a><br/><span id="read_project_xml"></span>';
    		});
    		// if($(this).find("overlay").text() == "tralala"){
	    		// // output += '<a href="#" class="paulund_modal" onclick="testModal()">Click here</a>';
	    		// output += '<a href="#" class="paulund_modal">Click here</a><br/>';
	    		// output += '<a href="#" class="paulund_modal_2">Click Here</a><br/>';
	    		// output += '<a href="#" class="paulund_modal_3">Click here</a><br/>';
	    		// output += '<a href="#" class="paulund_modal_4">Click here</a><br/>';
	    		// output += '<a href="#" class="paulund_modal_5">Click here</a><br/>';
	    		// // testModal();
	    	// } 
    		output += '<a href="#" id="' + subStepAddress + '">' + manualFinishLink + '</a>';
    		output += '</p></li>';
    	});
    	
    	output += '</ul>';
    	output += '</li>';
	});
	output += '</ul></div>';
	document.getElementById("edupackOverlay").innerHTML=output;
  	
	
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

	$('.showEduPackHelp').click(function(){
	    if($(this).is(':checked')){

	    	document.getElementById("sliderLinkOpacityValue").disabled= false;
	    	
	    	parseXMLDetailDescriptions(xmlDataDetailDescriptions);
	    	
	    	// document.getElementById("sliderLinkOpacityValue").disabled = true;
	    	// document.getElementById("sliderLinkOpacityValue").setAttribute("disabled","disabled");
	    } else {
	    	document.getElementById("sliderLinkOpacityValue").disabled= true;
	        deleteXMLDetailDescriptionElements();
	        // document.getElementById("sliderLinkOpacityValue").removeAttribute("disabled");
	        // document.getElementById("sliderLinkOpacityValue").disabled = false;
	    }
	});

	// Open the first tab on load
	tutorial_head.first().addClass('active').next().slideDown('normal');
	
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
	
	document.getElementById("section-simulator-main").onscroll = moveHighlightArrow;
	
	
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
		// alert(event.target.id);
		
		// Disable header links
		event.preventDefault();
		
		var stepId = $(this).attr("id").substr(0, $(this).attr("id").indexOf('_'));
		var taskId = $(this).attr("id").substr($(this).attr("id").indexOf('_')+1, $(this).attr("id").length);
			
		
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
		}


		/*
		 * TODO: old and html tag specific actions 
		 * remove and adapt to xml actions
		 */
		// activate and start parameter check
		if ($(this).attr('class').indexOf("parameter-check") != -1){
			FLAG_tutorialCheck = true;
			launchNewBurst("new");
			$(this).addClass('not-completed');
		}
		
		// activate and start parameter check
		if ($(this).attr('class').indexOf("dev-parameter-check") != -1){
			FLAG_devTutorialCheck = true;
			launchNewBurst("new");
			$(this).addClass('not-completed');
		}
		// activate and start new parameter check
		if ($(this).attr('class').indexOf("compareParametersWithHighlighting") != -1){
			FLAG_compareHighlights = true;
			launchNewBurst("new");
			moveHighlightArrow();
			$(this).addClass('not-completed');
		}	
		
		if (($(this).attr('class') == 'completed') ){
			$(this).parent().slideUp('normal');
			$(this).parent().next().stop(true,true).slideToggle('normal');
		}	
	});
	

	// $("#slider").slider({
        // value: 50,
        // slide: function(e, ui) {
            // linkOverlay_elements.setOpacity(ui.value / 100);
            // alert("hi");
        // }
    // });

}

function fcSlider_a() {
	var factor = 0.01;
	document.getElementById("overlayVal_a").value = document.getElementById("overlaySlider_a").value * factor;
  	
  	var pic = document.getElementById("img_fc_results");
	pic.src = "/static/js/read_hdf5_file_0" + parseInt(document.getElementById("overlayVal_a").value / factor ) + ".png";
	
	
}

function fcSlider_speed() {
	var factor = 20;
	document.getElementById("overlayVal_speed").value = document.getElementById("overlaySlider_speed").value * factor;
  	
}

function changeLinkOpacity() {
	var opac = document.getElementById('sliderLinkOpacityValue').value / 100.;
	$('.linkOverlay_elements').css('opacity', opac);
	
  	
}

// http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
function OnMouseDown(e)
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    

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
		url: "/static/js/edupack_xml_detail_descriptions.xml",
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
function parseXMLDetailDescriptions(data){
	
	var name, content, type, section; 
	alert("Hallo");
	$(data).find("description").each(function() {
		
		section = $(this).attr("section");
		
		alert(section);
		alert(document.documentElement.id);
		// check if current section and the section from edupack_xml_detail element match, otherwise continue
		if(section == document.documentElement.id){
			name = $(this).attr("name");
			type = $(this).attr("type");
			
			// problems with forwarding strings with linebreaks, eliminate them
			content = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
	
			addHelperElements(section, type, name, content);			
		}
		

	});
}

function deleteXMLDetailDescriptionElements(){
	var element = document.getElementById("linkOverlay_block_page");
	if(element)
		element.parentNode.removeChild(element);
}


function addHelperElements(section, type, variable_name, value){
	
	// var search_name, spanClass, spanId;
	// interface specific adaptions
	// if(section=="simulator"){
		// section = document.getElementById('section-simulator-main');
		// search_name = '<label for="' + variable_name + '">';
		// spanClass = "detail_description";
		// spanId = spanClass + "_" + variable_name;
// 		
		// if(!document.getElementById("detail_description_" + spanId)) {	
// 		
			// var methodName = "helpOverlay('" + value + "', 'none', 'none')";
// 			
			// var link = '<a href="#" class="help_links" onclick="' + methodName + '">';//Click here to open additional information.</a><br/>';
// 				
		    // var content = section.innerHTML,
		    	// // pattern = new RegExp('(>[^<.]*)(' + search_name + ')([^<.]*)','g'),
		    	// // replaceWith = '$1 $2<span name="detail_description_element" ' + ( spanId ? 'id="' + spanId + '"' : '' ) + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">' + link + ' </a> $3</span> ',
		    	// pattern = new RegExp('(>[^<.]*)(' + search_name + ')(.*?\\n)([^<.]*)','g'),
		    	// replaceWith = '$1 $2 $3<span name="detail_description_element" ' + ( spanId ? 'id="' + spanId + '"' : '' ) + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">' + link + ' ? ? ? ? ? ? </a></span>',
		    	// // replaceWith = link + '$1 $2</a> $3 $4',
		    	// highlighted = content.replace(pattern,replaceWith);
				// // moveHighlightArrow();
// 				
		    // return (section.innerHTML = highlighted) !== content;
		// } else
			// return false;
// 		
	// } else
	
	var element;
	var xOffset, yOffset;
	
	if(section == "s-burst"){
		xOffset = 0;
		yOffset = -45;
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
		if(type == "elementClass")
			yOffset = -345; // due to the upload button in project... TODO: bad solution
	} else {
		xOffset = 0;
		yOffset = 0;
	}
	// some random factor
	xOffset += Math.floor((Math.random()*12)-6);
	yOffset += Math.floor((Math.random()*12)-6);
	
	if(type=="elementName"){
		element = document.getElementsByName(variable_name)[0];
	} else if(type=="elementId"){
		element = document.getElementById(variable_name);
		// alert(element);
	} else if(type=="elementClass"){
		// only the upload button so far, therefore the yOffset was adapted
		element = document.getElementsByClassName(variable_name)[0];
		xOffset += 15;
		yOffset += 300;
	} else if(type=="elementUpload"){
		// only the upload button so far, therefore the yOffset was adapted
		element = document.getElementsByClassName(variable_name)[0];
		xOffset = 0;
		yOffset = 0;
	}
	
	// check if is in viewport or actually not visible (like in hidden menues)
	if(isElementInViewport(element) && (element.offsetWidth > 0 && element.offsetHeight > 0)){
		
		var pos_element = getOffset(element);
		pos_element.left += xOffset;
		pos_element.top  += yOffset;
		
		var methodName = "helpOverlay('" + value + "', " + pos_element.left + ", " + pos_element.top + ")";
		var link = '<a href="#" onclick="' + methodName + '">';//Click here to open additional information.</a><br/>';
		
		if(!document.getElementById("linkOverlay_block_page")){
			var block_page = $('<div class="linkOverlay_block_page" id="linkOverlay_block_page"></div>');
			$(block_page).appendTo('body');
			
			$('.linkOverlay_block_page').dblclick(function(){
				$(this).fadeOut().remove();				 
			});	
		}

		var pop_up = $('<div name="linkOverlay_elements" class="linkOverlay_elements" id="linkOverlay_element_' + variable_name +'">' + link + '</a></div>');

		

			
		$(pop_up).appendTo('.linkOverlay_block_page');
		// position of speech bubble div image
		document.getElementById("linkOverlay_element_" + variable_name).style.left = (pos_element.left) + 'px';
		document.getElementById("linkOverlay_element_" + variable_name).style.top =  (pos_element.top) + 'px';
	}

	var opac = document.getElementById('sliderLinkOpacityValue').value / 100.;
	$('.linkOverlay_elements').css('opacity', opac);
	return true;
}	

/**
 * method checks if the DOM element is visible in the current viewport in browser
 */
function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}


/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
function moveHighlightArrow(){
	
	if(FLAG_showHighlightArrow && FLAG_edupackActive){
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
						var section = $(this).attr("section");
						var variable_name = $(this).attr("variable_name");
						var value = $(this).attr("value");
						// document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions before: " + section + variable_name + value + "<br/>";
						// document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions before: " + typeof(section) + typeof(variable_name) + typeof(value) + "<br/>";
						
						var actionName = $(this).attr("type") + "_" + $(this).attr("variable_name");
						addAction(type, section, variable_name, value, stepId, taskId, actionName);
						
						// document.getElementById("detail_" + stepId +"_" + taskId).innerHTML += "actions after<br/>";
					
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
			moveHighlightArrow();
	    return (section.innerHTML = highlighted) !== content;
	}else
		return false;

	return true;
}	

/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
function actionOverlay(mode, content){
	
	// $('.paulund_modal').paulund_modal_box();
	// $('.paulund_modal_2').paulund_modal_box({
		// title:'Second Title Box',
		// description:'Custom description for box <br/><br/>Quisque sodales odio nec dolor porta sed laoreet mauris pretium. Aenean id mauris ligula, semper pulvinar dolor. Suspendisse rutrum, libero eu condimentum porta, mauris mauris semper augue, ut tempor nunc arcu vel ligula. Quisque orci eros, consequat vel iaculis eget, blandit bibendum est. Morbi ac tellus dui. Nullam eget eros et lectus dignissim placerat. Nulla facilisi. Ut congue posuere vulputate.'
	// });
	// $('.paulund_modal_3').paulund_modal_box({
	// title: 'Change Title with height',
	// height: '500'
	// });
	// $('.paulund_modal_4').paulund_modal_box({
	// title: 'Change Title with Width',
		// width: '800'
	// });
	// $('.paulund_modal_5').paulund_modal_box({
		// title:'Second Title Box',
	// description:'Custom description for box <br/><br/>Quisque sodales odio nec dolor porta sed laoreet mauris pretium. Aenean id mauris ligula, semper pulvinar dolor. Suspendisse rutrum, libero eu condimentum porta, mauris mauris semper augue, ut tempor nunc arcu vel ligula. Quisque orci eros, consequat vel iaculis eget, blandit bibendum est. Morbi ac tellus dui. Nullam eget eros et lectus dignissim placerat. Nulla facilisi. Ut congue posuere vulputate.',
	// height: '500',
	// width: '800'
	// });
	
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
		
		$('.paulund_modal_box').fadeIn();
	} else {
		
		$('.paulund_modal_box').fadeOut();
		
	}
	
}	



function helpOverlay(content, left, top){
	
	// add block page
	var block_page = $('<div class="helpOverlay_block_page" id="helpOverlay_block_page"></div>');
	$(block_page).appendTo('body');
	
	// add popup box
	var pop_up = $('<div name="helpOverlay_modal_box" class="helpOverlay_modal_box"><a href="#" class="helpOverlay_modal_close"><b>x</b></a><div class="helpOverlay_inner_modal_box">' + content + '</div></div>');
	$(pop_up).appendTo('.helpOverlay_block_page');
	
 	$('.helpOverlay_block_page').dblclick(function(){
		$(this).fadeOut().remove();
		$('.helpOverlay_modal_close').fadeOut().remove();				 
	});	 
 	
	$('.helpOverlay_modal_close').click(function(){
		$(this).parent().fadeOut().remove();
		$('.helpOverlay_block_page').fadeOut().remove();				 
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


function checkParametersFromHash(){
	
	// compare currentParameters with data from project xml
	var currentParameters = getCurrentParameterHashTable(),
	// TODO work with copy of object and removeItem locally or just add / remove actions and check all params?
		hash = jQuery.extend(true, {}, parameterCheckHash); // get copy of global variable
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
		
	for (var i = 0, keys = hash.keys(), len = keys.length; i < len; i++) {
		if(currentParameters.getItem(keys[i]) == hash.getItem(keys[i])){
			// alert("removed a:" + keys[i]);
			hash.removeItem(keys[i]);
			removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 01, 02, "highlight_" + keys[i]);
		}else if(String(hash.getItem(keys[i])).localeCompare(String(currentParameters.getItem(keys[i]))) == 0){
			// alert("removed a:" + keys[i]);
			hash.removeItem(keys[i]);
			removeAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 01, 02, "highlight_" + keys[i]);
		}else {
			// alert("something to highlight");
			addAction("highlight", "simulator", keys[i], hash.getItem(keys[i]), 01, 02, "highlight_" + keys[i]);
			// alert("current: " + currentParameters.getItem(keys[i]) + ", xml: " + hash.getItem(keys[i]));
		}
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
		
		
	// alert(hash.keys());
	// alert(currentParameters.keys());
	// alert(getStringFromHashTable(hash));
	// alert(getStringFromHashTable(currentParameters));
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
		// url: "/static/js/edupack_Operation.xml",
		url: "/static/js/edupack_paul_Operation.xml",
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
function actionRemoveHighlight(type, variable_name) {
	var element = document.getElementById(type + "_"+ variable_name);
	if(element)
		element.parentNode.removeChild(element);
}

function addAction(type, section, variable_name, value, stepId, taskId, actionName){
	var actionKey = stepId + '_' + taskId + '_' + actionName;
	
	if(activeActions.getItem(actionKey) != actionName){
		activeActions.setItem(actionKey, actionName);
	
		if(type == "highlight"){
			
			actionHighlight(section, variable_name, value);
			activateFLAG_schowHighlightArrow();
			moveHighlightArrow();
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

/*
 * not finished
 * TODO more specific about active actions, names (with step and task id) etc. 
 * not only delete a highlighter because of name highlight_conduction_speed
 */
function removeAction(type, section, variable_name, value, stepId, taskId, actionName){
	activeActions.removeItem(stepId + '_' + taskId + '_' + actionName, actionName);
	
	if((type == "highlight") || (type == "project_xml")){
		actionRemoveHighlight(type, variable_name);
		moveHighlightArrow();
	}
	if(type == "project_xml"){
		// remove all created highlights with this specific type - but the call comes from unloadactions, but there are more elements in it...
		actionRemoveHighlight(type, variable_name);
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
	actionRemoveHighlight(variable_name);
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
				moveHighlightArrow();
			}
		}else if(property.localeCompare("model") == 0){
			if(data[property].indexOf("ReducedSetHindmarshRose") != -1){
				// good
				unhighlight2("model");
				count_correct+=1;
			} else {
				// bad
				highlight2(b,'<label for="model">','highlight', 'model');	
				moveHighlightArrow();			
			}
		} else if(property.localeCompare("simulation_length")  == 0){
			if(data[property] == 20.0){//}.indexOf("20.0") != -1){
				// good
				count_correct+=1;
				unhighlight2("simulation_length");
			} else {
				// bad
				highlight2(b,'<label for="simulation_length">','highlight', 'simulation_length');
				moveHighlightArrow();					
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
 	if (!FLAG_edupackActive){ // inactive, so activate it now
  		document.getElementById("edupackOverlay").style.display="block";
  		FLAG_edupackActive = true;
  	} else {
  		document.getElementById("edupackOverlay").style.display="none";
  		FLAG_edupackActive = false;
 	}
}

function checkParameters(data){
	var edupackDiv=document.getElementById('edupackOverlay');
	
	var dataset = data["model_parameters_option_Generic2dOscillator_b"].replace("[","").replace("]","");
	var docColon = document.createTextNode("here is the result:" + '"' + dataset + '"');
	edupackDiv.innerHTML = "";
	
	edupackDiv.appendChild(docColon);
	
	var value = parseFloat(dataset);
	edupackDiv.innerHTML = value;
	
	if(value > 0){
		edupackDiv.innerHTML = "The value of <font color ='red'>model_parameters_option_Generic2dOscillator_b</font> is not in the expected range.";

		edupackDiv.appendChild(docColon);
		edupackDiv.appendChild(docColon);
		edupackDiv.appendChild(docColon);
	}
}

function readParameters(data){
	
	// for chrome javascript console
	console.log(data);

	
	var edupackDiv=document.getElementById('edupackOverlay');
	edupackDiv.innerHTML = "";
	
	var output = '';
	for (property in data) {
	  output += property + ': ' + data[property]+'<br> ';
	}
	edupackDiv.innerHTML = output;
//	var docOutput = document.createTextNode(output);
//	edupackDiv.appendChild(docOutput);
	/*
	
	var docKey;
	var docValue;
	var docColon = document.createTextNode(": ");
	var docLine = document.createTextNode("<br>");

	for (var key in data){
	    //key will be -> 'id'
	    //dictionary[key] -> 'value'
	    docKey = document.createTextNode(key);
		edupackDiv.appendChild(docKey);
		
		edupackDiv.appendChild(docColon);
		
		docValue = document.createTextNode(data[key]);
		edupackDiv.appendChild(docValue);
		
		edupackDiv.appendChild(docLine);
	}
	
	*/
/*	
	var myTable = document.createTextNode(data);
	edupackDiv.innerHTML ="";
	edupackDiv.appendChild(myTable);
*/
	
	//edupackDiv.innerHTML = "<table width='100%' height='100%'><tr><td align='center' valign='top' width='100%' height='100%'>Huhuuu</td></tr></table>";
	/*if(thediv.style.display == "none"){
		thediv.style.display = "";
		thediv.innerHTML = "<table width='100%' height='100%'><tr><td align='center' valign='middle' width='100%' height='100%'><object classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' codebase='http://www.apple.com/qtactivex/qtplugin.cab' width='640' height='500'><param name='src' value='http://cowcast.creativecow.net/after_effects/episodes/Shape_Tips_1_POD.mp4'><param name='bgcolor' value='#000000'><embed src='http://cowcast.creativecow.net/after_effects/episodes/Shape_Tips_1_POD.mp4' autoplay='true' pluginspage='http://www.apple.com/quicktime/download/' height='500' width='640' bgcolor='#000000'></embed></object><br><br><a href='#' onclick='return clicker();'>CLOSE WINDOW</a></td></tr></table>";
	}else{
		thediv.style.display = "none";
		thediv.innerHTML = '';
	}*/
	
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

function changeFLAG_schowHighlightArrow(){
	if (!FLAG_showHighlightArrow){ // inactive, so activate it now
  		document.getElementById("highlight_arrow").style.display="block";
  		FLAG_showHighlightArrow = true;
  		moveHighlightArrow();
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
  		moveHighlightArrow();
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



/** description for an hashtable object, for the mapping of variable names of the parameters and the value in html 
 *  http://www.mojavelinux.com/articles/javascript_hashes.html
 * 

var h = new HashTable({one: 1, two: 2, three: 3, "i'm no 4": 4});
alert('original length: ' + h.length);
alert('value of key "one": ' + h.getItem('one'));
alert('has key "foo"? ' + h.hasItem('foo'));
alert('previous value of key "foo": ' + h.setItem('foo', 'bar'));
alert('length after setItem: ' + h.length);
alert('value of key "foo": ' + h.getItem('foo'));
alert('value of key "i'm no 4": ' + h.getItem("i'm no 4"));
h.clear();
alert('length after clear: ' + h.length);
        
These calls should produce the following output:
original length: 4
value of key "one": 1
has key "foo"? false
previous value of key "foo": undefined
length after setItem: 5
value of key "foo": bar
value of key "i'm no 4": 4
length after clear: 0


Iterating the items, filtering out members inherited from the Object.prototype:
for (var k in h.items) {
    if (h.hasItem(k)) {
        alert('key is: ' + k + ', value is: ' + h.items[k]);
    }
}
        
        
Iterating the entries using each: (notice we don't have to use hasOwnProperty in this case)
h.each(function(k, v) {
    alert('key is: ' + k + ', value is: ' + v);
});
        
        
Iterating the collection of keys:
for (var i = 0, keys = h.keys(), len = keys.length; i < len; i++) {
    alert('key is: ' + keys[i] + ', value is: ' + h.getItem(keys[i]));
}
        
        
Iterating the collection of values:
for (var i = 0, v = h.values(), len = v.length; i < len; i++) {
    alert('value is: ' + v[i]);
}
        
        
You can also find out the size of the hash table:
alert('size of hash table: ' + h.length);


 * @param {Object} obj
 */
function HashTable(obj) {
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
    

    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
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