
// ---------------------------------------------------------
//              EDUPACK RELATED FUNCTIONS
// ---------------------------------------------------------
var FLAG_edupackActive = false;
var FLAG_tutorialCheck = false;
var FLAG_devTutorialCheck = false;
var FLAG_recheck = false;
var FLAG_showHighlightArrow = false;
var FLAG_compareHighlights = false;
var FLAG_correctParameters = false;
var hashMap;
var highlight_arrow_position;
var arrow_offset_top = -70;
var arrow_offset_left = 55;
var current_highlight_arrow_position = 0;


// var dialog = document.querySelector('dialog');
// 
// var show = document.querySelector('#show');
// document.querySelector('#show').onclick = function() {
  // dialog.show();
// };
// document.querySelector('#close').onclick = function() {
  // dialog.close();
// };
// show.addEventListener('click', function() {
  // dialog.showModal();
  // console.log('dialog opened');
// });
// show.addEventListener('close', function() {
  // console.log('dialog closed');
// });
// show.addEventListener('cancel', function() {
  // console.log('dialog canceled');
// });

// function is called when script file is integrated:
$(document).ready(function() {
	// call function to create and load variable mapping
	createVariableMapping();


	
/*** methods for the accordion menu, without page stepping ***/	
	// Store variables
	var tutorial_head = $('.tutorial-step > li > a'),
		tutorial_body = $('.tutorial-step li > .sub-menu'),
		tutorial_substep_head = $('.sub-step > li > a'),
		tutorial_substep_body = $('.sub-step li > .detail-menu'),
		detail_completed =  $('.detail-step a');
		// compareParamHighlight = $('.detail-step compareParametersWithHighlighting');

	// Open the first tab on load
	// tutorial_head.first().addClass('active').next().slideDown('normal');
	
	document.body.onclick = function(e){
		if (FLAG_recheck)
			launchNewBurst("new");
		if(FLAG_compareHighlights)
			launchNewBurst("new");
	}
	
	// check scrolling in simulator parameter area
	document.getElementById("section-simulator-main").onscroll = moveHighlightArrow;
	
	// Click on Tutorial step 
	tutorial_head.on('click', function(event) {

		// Disable header links
		event.preventDefault();

		// Show and hide the tabs on click
		if ($(this).attr('class') != 'active'){
			tutorial_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
			//tutorial_head.removeClass('active');
			$(this).addClass('active');
		} else {
			tutorial_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
			//tutorial_head.removeClass('visited');
			$(this).addClass('visited');
		}

	});
	
	// Click on Tutorial Sub step
	tutorial_substep_head.on('click', function(event) {

		// Disable header links
		event.preventDefault();

		// Show and hide the tabs on click
		if ($(this).attr('class') != 'active'){
			// mark it as "active" when it is not already done, but opening/closing will work independently
			if (document.getElementById("span_" + $(this).attr("id")).innerHTML.indexOf("done") == -1){
				document.getElementById("span_" + $(this).attr("id")).innerHTML="<font color='#ff0000'>active</font>";
				tutorial_substep_head.removeClass('active');
				tutorial_substep_head.removeClass('visited');
				$(this).addClass('active');
				
			}
			tutorial_substep_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
				
		} else {
			// mark it as "open" when it is not already done, but opening/closing will work independently
			if (document.getElementById("span_" + $(this).attr("id")).innerHTML.indexOf("done") == -1){
				document.getElementById("span_" + $(this).attr("id")).innerHTML="<font color='#797979'>open</font>";
				tutorial_substep_head.removeClass('visited');
				tutorial_substep_head.removeClass('active');
				$(this).addClass('visited');
			}
			tutorial_substep_body.slideUp('normal');
			$(this).next().stop(true,true).slideToggle('normal');
		}
		
		// needed for dev function of showing parameters, activate and show parameters after clicking on this substep
		// if ($(this).attr('class').indexOf("parameter-check") != -1){
			// FLAG_tutorialCheck = true;
			// launchNewBurst("new");
		// }

	});
	
	// there's a link in all detail-steps which will mark the tutorial_substep as "done"
	detail_completed.on('click', function(event) {
		// Disable header links
		event.preventDefault();

		// check if this was marked as completed
		// if (($(this).attr('class') != 'completed') && 
			// ($(this).attr('class').indexOf("parameter-check") == 1) && 
			// ($(this).attr('class').indexOf("dev-parameter-check") == 1)){
		
		//when not already completed, set class to completed and mark the tutorial_substep as "done"
		if (($(this).attr('class') != 'completed') ){
			
			document.getElementById("span_" + $(this).attr("id")).innerHTML="<font color='#45a23e'>done</font>";
			$(this).addClass('completed');
			
		}

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
});


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

/**
 * called when FLAG_showHighlightArrow is getting actived and is true
 */
function moveHighlightArrow(){
	if(FLAG_showHighlightArrow && FLAG_edupackActive){
		highlight_arrow_position = getOffset( document.getElementsByName('highlighted')[current_highlight_arrow_position]);
		// document.getElementById("compareParametersWithHighlighting").innerHTML="length: " + document.getElementsByName('highlighted').length + "left: " + highlight_arrow_position.left + ", top: " + highlight_arrow_position.top;
		// moveDivToXY("highlight_arrow", Math.floor(Math.random()*1000), Math.floor(Math.random()*800));
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

// function highlight(container,what,spanClass) {
    // var content = container.innerHTML,
        // pattern = new RegExp('(>[^<.]*)(' + what + ')([^<.]*)','g'),
        // replaceWith = '$1<span ' + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">$2</span>$3',
        // highlighted = content.replace(pattern,replaceWith);
    // return (container.innerHTML = highlighted) !== content;
// }

function highlight2(container,what,spanClass, spanId) {
	if(!document.getElementById("highlight_" + spanId)){
	    var content = container.innerHTML,
	        pattern = new RegExp('(>[^<.]*)(' + what + ')([^<.]*)','g'),
	        // pattern = new RegExp('(>[^<.]*)(' + '<label for="' + what + '">' + ')([^<.]*)','g'),
	        replaceWith = '$1 $2<span  name="highlighted" ' + ( spanId ? 'id="highlight_' + spanId + '"' : '' ) + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>$3',
	        // replaceWith = '$1<span name="highlighted"' + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">$5</span>$6',
	        highlighted = content.replace(pattern,replaceWith);
	    return (container.innerHTML = highlighted) !== content;
	}else
		return false;
}

function unhighlight2(spanId) {
	var element = document.getElementById("highlight_"+ spanId);
	if(element)
		element.parentNode.removeChild(element);
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
