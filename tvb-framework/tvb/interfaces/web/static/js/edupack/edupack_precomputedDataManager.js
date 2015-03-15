function fwdSpeedToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("conduction_speed").value = param.toString();
  }else
    document.getElementById("conduction_speed").value = param.value;
}

function fwdCouplingToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("coupling_parameters_option_Linear_a").value = param.toString();
  }else
    document.getElementById("coupling_parameters_option_Linear_a").value = param.value;

}

function fwdNoiseToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_nsig").value = param.toString();
  }else
    document.getElementById("integrator_parameters_option_HeunStochastic_noise_parameters_option_Additive_nsig").value = param.value;

}

function fwdK11ToSimulator(param){
  if(typeof(param) == "number"){
      document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K11").value = param.toString();
  }else
      document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K11").value = param.value;
}

function fwdK12ToSimulator(param){
  if(typeof(param) == "number"){
      document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K12").value = param.toString();
  }else
      document.getElementById("model_parameters_option_ReducedSetHindmarshRose_K12").value = param.value;

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
  }else
    document.getElementById("simulation_length").value = param.value;
}

function fwdMonitorsToSimulator(){
  document.getElementById("monitors").value = "SubSample";
  multipleSelect(document.getElementById("monitors"), 'data_monitors');
}

function fwdSubSampleTimeToSimulator(param){
  if(typeof(param) == "number"){
    document.getElementById("monitors_parameters_option_SubSample_period").value = param.toString();
  }else
    document.getElementById("monitors_parameters_option_SubSample_period").value = param.value;

}

