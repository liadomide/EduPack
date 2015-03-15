
function onButtonCreateBatchPressed(){
  // alert("pressed");
  checkAndRunTVBPage();
}

function checkAndRunTVBPage(){
  var section = document.getElementsByTagName("body")[0].id;
  
  if(section == "s-burst"){
    // alert("Hallo?");
    runBatchGeneratorSimulator();
    return true;
  } else {
    var message = "The Batch Script Tool does only work within the TVB Simulator Page"
    
    var posX = Math.round(window.screen.width / 3);
    var posY = Math.round(window.screen.height / 2);
    helpOverlay(message, posX, posY);
    return false; 
  }
}

function getCurrentParameterConfigurationAsHashtable(){
  // get dictionary of parameters, an bring it into data structure of HashTable
  var currentParameters = getSubmitableData('div-simulator-parameters', false);
  var currentParametersHash = new HashTable();
  for (key in currentParameters) {
    currentParametersHash.setItem(key, currentParameters[key]);
  }
  
  return currentParametersHash;
}

function runBatchGeneratorSimulator() {
  var paramConfig = getCurrentParameterConfigurationAsHashtable();
  
  // var dataString = "";
  // paramConfig.each(function(k, v) {
    // dataString += k + ': ' + v + '\n';
  // });
//   
  // // alert(dataString);
  // saveTextAsFile(dataString);  
  // alert();
  saveTextAsFile(createScript(paramConfig));

}

function createScript(dataHash){
  var content = "";
  // alert("jo");
  content +=  "# -*- coding: utf-8 -*-\n" +
              "#\n" +
              "#\n" +
              "#  TheVirtualBrain-Scientific Package. This package holds all simulators, and\n" + 
              "# analysers necessary to run brain-simulations. You can use it stand alone or\n" +
              "# in conjunction with TheVirtualBrain-Framework Package. See content of the\n" +
              "# documentation-folder for more details. See also http://www.thevirtualbrain.org\n" +
              "#\n" +
              "# (c) 2012-2013, Baycrest Centre for Geriatric Care (\"Baycrest\")\n" +
              "#\n" +
              "# This program is free software; you can redistribute it and/or modify it under\n" + 
              "# the terms of the GNU General Public License version 2 as published by the Free\n" +
              "# Software Foundation. This program is distributed in the hope that it will be\n" +
              "# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of \n" +
              "# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public\n" +
              "# License for more details. You should have received a copy of the GNU General \n" +
              "# Public License along with this program; if not, you can download it here\n" +
              "# http://www.gnu.org/licenses/old-licenses/gpl-2.0\n" +
              "#\n" +
              "#\n" +
              "#   CITATION:\n" +
              "# When using The Virtual Brain for scientific publications, please cite it as follows:\n" +
              "#\n" +
              "#   Paula Sanz Leon, Stuart A. Knock, M. Marmaduke Woodman, Lia Domide,\n" +
              "#   Jochen Mersmann, Anthony R. McIntosh, Viktor Jirsa (2013)\n" +
              "#   The Virtual Brain: a simulator of primate brain network dynamics.\n" +
              "#   Frontiers in Neuroinformatics (7:10. doi: 10.3389/fninf.2013.00010)\n" +
              "#\n" +
              "#\n" +
              "# AUTOMATIC CREATED SCRIPT USING TVB-EDUPACK BATCH-SCRIPT-GENERATOR\n" +
              "#\n" +
              "#\n" +
              "\n" +    
              "# import third party python libraries\n" + 
              "import numpy\n" + 
              "import scipy\n" +
              "import os\n" +
              "\n";
  // alert("joho");
  content += addModelToScript(dataHash);
  // alert("johoho");
              
  return content;
}

/*
 * check model in current Configuration and configure it with the selected parameters
 * and create script text 
 */
function addModelToScript(dataHash){
  var modelType = dataHash.getItem('model');
  var modelParam = "model_parameters_option_" + modelType + "_";
  var content = "";
    
  if(modelType == "ReducedSetHindmarshRose"){
    
    var str_varOfInterest = "" + dataHash.getItem(modelParam + "variables_of_interest");
    var variables_of_interest_array = str_varOfInterest.split(',');
    var variables_of_interest_string = "[";
    
    for(var i = 0; i< variables_of_interest_array.length; i++){
      variables_of_interest_string += "\"" + variables_of_interest_array[i] + "\","; 
    }
    // delete last comma sign
    variables_of_interest_string = variables_of_interest_string.substring(0, variables_of_interest_string.length - 1);
    variables_of_interest_string += "]";
    
    content = "oscilator = models." + modelType + "(" +
              "r=" + dataHash.getItem(modelParam + "r") + ", " + 
              "a=" + dataHash.getItem(modelParam + "a") + ", " +
              "b=" + dataHash.getItem(modelParam + "b") + ", " +
              "c=" + dataHash.getItem(modelParam + "c") + ", " +
              "d=" + dataHash.getItem(modelParam + "d") + ", " +
              "s=" + dataHash.getItem(modelParam + "s") + ", " +
              "xo=" + dataHash.getItem(modelParam + "xo") + ", " +
              "K11=" + dataHash.getItem(modelParam + "K11") + ", " +
              "K12=" + dataHash.getItem(modelParam + "K12") + ", " +
              "K21=" + dataHash.getItem(modelParam + "K21") + ", " +
              "sigma=" + dataHash.getItem(modelParam + "sigma") + ", " +
              "mu=" + dataHash.getItem(modelParam + "mu") + ", " +
              "variables_of_interest=" + variables_of_interest_string +
              ")\n";
  }
  content += "oscilator.configure()\n";
  
  return content;
}

//generate string for filename
function getDateAndTime(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var seconds = today.getSeconds();
  
  if(dd < 10) {
    dd = '0' + dd;
  } 

  if(mm < 10) {
    mm = '0' + mm;
  } 
  
  //generate string for filnemae
  today = yyyy+'-'+ mm + '-'+dd + '-'+hours + 'h-'+minutes + 'm-'+seconds+'s';
  
  return today;
}

function saveTextAsFile(data) {      
  
  // grab the content of the form field and place it into a variable
  var textToWrite = data;
  //  create a new Blob (html5 magic) that contains the data from your form field
  var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
  // Specify the name of the file to be saved
  var fileNameToSaveAs = getDateAndTime() + "_edupack_batch.txt";
 
  // Optionally allow the user to choose a file name by providing 
  // an imput field in the HTML and using the collected data here
  // var fileNameToSaveAs = txtFileName.text;

  // create a link for our script to 'click'
  var downloadLink = document.createElement("a");
  //  supply the name of the file (from the var above).
  // you could create the name here but using a var
  // allows more flexability later.
  downloadLink.download = fileNameToSaveAs;
  // provide text for the link. This will be hidden so you
  // can actually use anything you want.
  downloadLink.innerHTML = "Hidden_Link";
    
  // allow our code to work in webkit & Gecko based browsers
  // without the need for a if / else block.
  window.URL = window.URL || window.webkitURL;
          
  // Create the link Object.
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  // when link is clicked call a function to remove it from
  // the DOM in case user wants to save a second file.
  downloadLink.onclick = destroyClickedElement;
  // make sure the link is hidden.
  downloadLink.style.display = "none";
  // add the link to the DOM
  document.body.appendChild(downloadLink);
    
  // click the new link
  downloadLink.click();
}

function destroyClickedElement(event)
{
  // remove the link from the DOM
  document.body.removeChild(event.target);
}
