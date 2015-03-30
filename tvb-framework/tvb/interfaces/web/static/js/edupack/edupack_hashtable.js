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