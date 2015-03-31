
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

  // models
  if(modelType == "WilsonCowan"){
    
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
              "c_ee=" + dataHash.getItem(modelParam + "c_ee") + ", " + 
              "c_ei=" + dataHash.getItem(modelParam + "c_ei") + ", " +
              "c_ie=" + dataHash.getItem(modelParam + "c_ie") + ", " +
              "c_ii=" + dataHash.getItem(modelParam + "c_ii") + ", " +
              "tau_e=" + dataHash.getItem(modelParam + "tau_e") + ", " +
              "tau_i=" + dataHash.getItem(modelParam + "tau_i") + ", " +
              "a_e=" + dataHash.getItem(modelParam + "a_e") + ", " +
              "b_e=" + dataHash.getItem(modelParam + "b_e") + ", " +
              "c_e=" + dataHash.getItem(modelParam + "c_e") + ", " +
              "theta_e=" + dataHash.getItem(modelParam + "theta_e") + ", " +
              "a_i=" + dataHash.getItem(modelParam + "a_i") + ", " +
              "b_i=" + dataHash.getItem(modelParam + "b_i") + ", " +
              "c_i=" + dataHash.getItem(modelParam + "c_i") + ", " +
              "r_e=" + dataHash.getItem(modelParam + "r_e") + ", " +
              "r_i=" + dataHash.getItem(modelParam + "r_i") + ", " +
              "k_e=" + dataHash.getItem(modelParam + "k_e") + ", " +
              "k_i=" + dataHash.getItem(modelParam + "k_i") + ", " +
              "P=" + dataHash.getItem(modelParam + "P") + ", " +
              "Q=" + dataHash.getItem(modelParam + "Q") + ", " +              
              "alpha_e=" + dataHash.getItem(modelParam + "alpha_e") + ", " +              
              "alpha_i=" + dataHash.getItem(modelParam + "alpha_i") + ", " +
              "I=" + dataHash.getItem(modelParam + "I") + ", " +              
              "E=" + dataHash.getItem(modelParam + "E") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "ReducedSetFitzHughNagumo"){
    
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
              "tau=" + dataHash.getItem(modelParam + "r") + ", " + 
              "a=" + dataHash.getItem(modelParam + "a") + ", " +
              "b=" + dataHash.getItem(modelParam + "b") + ", " +
              "K11=" + dataHash.getItem(modelParam + "K11") + ", " +
              "K12=" + dataHash.getItem(modelParam + "K12") + ", " +
              "K21=" + dataHash.getItem(modelParam + "K21") + ", " +
              "sigma=" + dataHash.getItem(modelParam + "sigma") + ", " +
              "alpha=" + dataHash.getItem(modelParam + "alpha") + ", " +
              "beta=" + dataHash.getItem(modelParam + "beta") + ", " +
              "xi=" + dataHash.getItem(modelParam + "xi") + ", " +
              "eta=" + dataHash.getItem(modelParam + "eta") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "ReducedSetHindmarshRose"){
    
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
              "tau=" + dataHash.getItem(modelParam + "tau") + ", " +
              "xi=" + dataHash.getItem(modelParam + "xi") + ", " +
              "beta=" + dataHash.getItem(modelParam + "beta") + ", " +
              "eta=" + dataHash.getItem(modelParam + "eta") + ", " +
              "alpha=" + dataHash.getItem(modelParam + "alpha") + ", " +
              "gamma=" + dataHash.getItem(modelParam + "gamma") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "JansenRit"){
    
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
              "A=" + dataHash.getItem(modelParam + "A") + ", " + 
              "B=" + dataHash.getItem(modelParam + "B") + ", " +
              "a=" + dataHash.getItem(modelParam + "a") + ", " +
              "b=" + dataHash.getItem(modelParam + "b") + ", " +
              "v0=" + dataHash.getItem(modelParam + "v0") + ", " +
              "nu_max=" + dataHash.getItem(modelParam + "nu_max") + ", " +
              "r=" + dataHash.getItem(modelParam + "r") + ", " +
              "J=" + dataHash.getItem(modelParam + "J") + ", " +
              "a_1=" + dataHash.getItem(modelParam + "a_1") + ", " +
              "a_2=" + dataHash.getItem(modelParam + "a_2") + ", " +
              "a_3=" + dataHash.getItem(modelParam + "a_3") + ", " +
              "a_4=" + dataHash.getItem(modelParam + "a_4") + ", " +
              "p_min=" + dataHash.getItem(modelParam + "p_min") + ", " +
              "p_max=" + dataHash.getItem(modelParam + "p_max") + ", " +
              "mu=" + dataHash.getItem(modelParam + "mu") + ", " +
              "y1=" + dataHash.getItem(modelParam + "y1") + ", " +
              "y0=" + dataHash.getItem(modelParam + "y0") + ", " +
              "y3=" + dataHash.getItem(modelParam + "y3") + ", " +
              "y2=" + dataHash.getItem(modelParam + "y2") + ", " +
              "y5=" + dataHash.getItem(modelParam + "y5") + ", " +
              "y4=" + dataHash.getItem(modelParam + "y4") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "ZetterbergJansen"){
    
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
              "He=" + dataHash.getItem(modelParam + "He") + ", " + 
              "Hi=" + dataHash.getItem(modelParam + "Hi") + ", " +
              "ke=" + dataHash.getItem(modelParam + "ke") + ", " +
              "ki=" + dataHash.getItem(modelParam + "ki") + ", " +
              "rho_2=" + dataHash.getItem(modelParam + "rho_2") + ", " +
              "e0=" + dataHash.getItem(modelParam + "e0") + ", " +
              "rho_1=" + dataHash.getItem(modelParam + "rho_1") + ", " +
              "gamma_1=" + dataHash.getItem(modelParam + "gamma_1") + ", " +
              "gamma_2=" + dataHash.getItem(modelParam + "gamma_2") + ", " +
              "gamma_3=" + dataHash.getItem(modelParam + "gamma_3") + ", " +
              "gamma_4=" + dataHash.getItem(modelParam + "gamma_4") + ", " +
              "gamma_5=" + dataHash.getItem(modelParam + "gamma_5") + ", " +
              "v1=" + dataHash.getItem(modelParam + "v1") + ", " +
              "v2=" + dataHash.getItem(modelParam + "v2") + ", " +
              "v3=" + dataHash.getItem(modelParam + "v3") + ", " +
              "v4=" + dataHash.getItem(modelParam + "v4") + ", " +
              "v5=" + dataHash.getItem(modelParam + "v5") + ", " +
              "v6=" + dataHash.getItem(modelParam + "v6") + ", " +
              "v7=" + dataHash.getItem(modelParam + "v7") + ", " +
              "y1=" + dataHash.getItem(modelParam + "y1") + ", " +
              "y3=" + dataHash.getItem(modelParam + "y3") + ", " +
              "y2=" + dataHash.getItem(modelParam + "y2") + ", " +
              "y5=" + dataHash.getItem(modelParam + "y5") + ", " +
              "y4=" + dataHash.getItem(modelParam + "y4") + ", " +
              "gamma_1T=" + dataHash.getItem(modelParam + "gamma_1T") + ", " +
              "gamma_3T=" + dataHash.getItem(modelParam + "gamma_3T") + ", " +
              "gamma_2T=" + dataHash.getItem(modelParam + "gamma_2T") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "Generic2dOscillator"){
    
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
              "Iext=" + dataHash.getItem(modelParam + "Iext") + ", " +
              "a=" + dataHash.getItem(modelParam + "a") + ", " +
              "b=" + dataHash.getItem(modelParam + "b") + ", " +
              "c=" + dataHash.getItem(modelParam + "c") + ", " +
              "e=" + dataHash.getItem(modelParam + "e") + ", " +
              "f=" + dataHash.getItem(modelParam + "f") + ", " +
              "g=" + dataHash.getItem(modelParam + "g") + ", " +
              "alpha=" + dataHash.getItem(modelParam + "alpha") + ", " +
              "beta=" + dataHash.getItem(modelParam + "beta") + ", " +
              "W=" + dataHash.getItem(modelParam + "W") + ", " +
              "V=" + dataHash.getItem(modelParam + "V") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "d=" + dataHash.getItem(modelParam + "d") + ", " +
              "gamma=" + dataHash.getItem(modelParam + "gamma") + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "LarterBreakspear"){
    
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
              "a_ne=" + dataHash.getItem(modelParam + "a_ne") + ", " + 
              "tau_K=" + dataHash.getItem(modelParam + "tau_K") + ", " +
              "VNa=" + dataHash.getItem(modelParam + "VNa") + ", " +
              "ani=" + dataHash.getItem(modelParam + "ani") + ", " +
              "gNa=" + dataHash.getItem(modelParam + "gNa") + ", " +
              "QZ_max=" + dataHash.getItem(modelParam + "QZ_max") + ", " +
              "TCa=" + dataHash.getItem(modelParam + "TCa") + ", " +
              "d_Na=" + dataHash.getItem(modelParam + "d_Na") + ", " +
              "rNMDA=" + dataHash.getItem(modelParam + "rNMDA") + ", " +
//TODO
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "ReducedWongWang"){
    
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
              "a=" + dataHash.getItem(modelParam + "a") + ", " + 
              "b=" + dataHash.getItem(modelParam + "b") + ", " +
              "d=" + dataHash.getItem(modelParam + "d") + ", " +
              "gamma=" + dataHash.getItem(modelParam + "gamma") + ", " +
              "tau_s=" + dataHash.getItem(modelParam + "tau_s") + ", " +
              "w=" + dataHash.getItem(modelParam + "w") + ", " +
              "J_N=" + dataHash.getItem(modelParam + "J_N") + ", " +
              "I_o=" + dataHash.getItem(modelParam + "I_o") + ", " +
              "S=" + dataHash.getItem(modelParam + "S") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "Kuramoto"){
    
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
              "omega=" + dataHash.getItem(modelParam + "omega") + ", " +
              "theta=" + dataHash.getItem(modelParam + "theta") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "Hopfield"){
    
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
              "taux=" + dataHash.getItem(modelParam + "taux") + ", " + 
              "tauT=" + dataHash.getItem(modelParam + "tauT") + ", " +
              "dynamic=" + dataHash.getItem(modelParam + "dynamic") + ", " +
              "x=" + dataHash.getItem(modelParam + "x") + ", " +
              "theta=" + dataHash.getItem(modelParam + "theta") + ", " +
              "variables_of_interest=" + variables_of_interest_string + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "Epileptor"){
    
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
              "Iext=" + dataHash.getItem(modelParam + "Iext") + ", " + 
              "Iext2=" + dataHash.getItem(modelParam + "Iext2") + ", " +
              "x0=" + dataHash.getItem(modelParam + "x0") + ", " +
              "r=" + dataHash.getItem(modelParam + "r") + ", " +
              "slope=" + dataHash.getItem(modelParam + "slope") + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
              ")\n";
  }

  else if(modelType == "EpileptorPermittivityCoupling"){
    
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
              "Iext=" + dataHash.getItem(modelParam + "Iext") + ", " + 
              "Iext2=" + dataHash.getItem(modelParam + "Iext2") + ", " +
              "x0=" + dataHash.getItem(modelParam + "x0") + ", " +
              "r=" + dataHash.getItem(modelParam + "r") + ", " +
              "slope=" + dataHash.getItem(modelParam + "slope") + ", " +
              "Tt=" + dataHash.getItem(modelParam + "Tt") + ", " +
              "noise=" + dataHash.getItem(modelParam + "noise") + ", " +
              "Noise_ntau=" + dataHash.getItem(modelParam + "Noise_ntau") + ", " +
              "Noise_random_stream=" + dataHash.getItem(modelParam + "Noise_random_stream") + ", " +
              "RandomStream_init_seed=" + dataHash.getItem(modelParam + "RandomStream_init_seed") +
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
