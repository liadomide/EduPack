/**
 * TheVirtualBrain-Framework Package. This package holds all Data Management, and 
 * Web-UI helpful to run brain-simulations. To use it, you also need do download
 * TheVirtualBrain-Scientific Package (for simulators). See content of the
 * documentation-folder for more details. See also http://www.thevirtualbrain.org
 *
 * (c) 2012-2013, Baycrest Centre for Geriatric Care ("Baycrest")
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License version 2 as published by the Free
 * Software Foundation. This program is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
 * License for more details. You should have received a copy of the GNU General 
 * Public License along with this program; if not, you can download it here
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0
 *
 **/

/**
 * Initializes the legend buffers, the color scheme component, and binds the click event.
 * It does not initialize webgl as that is done in the included left_template_brain_pick.html
 * @param [selectedLocalConnectivity] if absent we are in the local connectivity page step2 and this value is retrieved from the dom
 */
function LCON_viewer_init(minValue, maxValue, selectedLocalConnectivity){
    ColSch_initColorSchemeGUI(minValue, maxValue);

    LEG_initMinMax(minValue, maxValue);
    LEG_generateLegendBuffers();
    BASE_PICK_initLegendInfo(maxValue, minValue);

    $('#GLcanvas').click(function(){
        LCON_displayGradientForThePickedVertex(selectedLocalConnectivity);
    });
}

function LCON_page_init(minValue, maxValue){
    $('#GLcanvas').click(function () {
        BS_displayIndexForThePickedVertex();
    });
    LCON_viewer_init(minValue, maxValue);
    $("select[name='existentEntitiesSelect']").change(function () { BS_loadEntity(); });
    LCONN_disableView('You are already in VIEW mode. If you want to display a different Local Connectivity entity just pick it from the selector menu above the visualizer.');
    LCONN_disableCreate('If you want to create a new Local Connectivity entity, go back to the EDIT page to set a new set of parameters.');
}
/**
 * Displays a gradient on the surface used by the selected local connectivity.
 * @param [selectedLocalConnectivity] the gid of the local connectivity
 */
function LCON_displayGradientForThePickedVertex(selectedLocalConnectivity) {

    if (TRIANGLE_pickedIndex >= 0) {
        if (selectedLocalConnectivity == null){
            selectedLocalConnectivity = $("select[name='existentEntitiesSelect']").val();
        }

        if (selectedLocalConnectivity == null || selectedLocalConnectivity == "None" ||
            selectedLocalConnectivity.trim().length == 0) {
            LCONN_PICK_drawDefaultColorBuffers();
            return;
        }

        var url = '/spatial/localconnectivity/compute_data_for_gradient_view?local_connectivity_gid=';
        url += selectedLocalConnectivity + "&selected_triangle=" + TRIANGLE_pickedIndex;
        doAjaxCall({
            async:false,
            url:url,
            success: LCONN_PICK_updateBrainDrawing
        });
        TRIANGLE_pickedIndex = GL_NOTFOUND;             // disable data retrieval until next triangle pick
    }
}

/**
 * Disable the view button in case we don't have some existing entity loaded
 */
function LCONN_disableView(message) {

	var stepButton = $("#lconn_step_2");
	stepButton[0].onclick = null;
	stepButton.unbind("click");
	stepButton.click(function() { displayMessage(message, 'infoMessage'); return false; });
	stepButton.addClass("action-idle");
}

/**
 * Disable the create button and remove action in case we just loaded an entity.
 */
function LCONN_disableCreate(message) {
	var stepButton = $('#lconn_step_3');
	stepButton[0].onclick = null;
	stepButton.unbind("click");
	stepButton.click(function() { displayMessage(message, 'infoMessage'); return false; });
	stepButton.addClass("action-idle");
}

/**
 * Enable the create button and add the required action to it in case some parameters have changed.
 */
function LCONN_enableCreate() {

	var stepButton = $('#lconn_step_3');
	stepButton[0].onclick = null;
	stepButton.unbind("click");
	stepButton.click(function() { createLocalConnectivity(); return false; });
	stepButton.removeClass("action-idle");
}


/**
 * Collects the data defined for the local connectivity and submit it to the server.
 *
 * @param actionURL the url at which will be submitted the data
 * @param formId Form to be submitted.
 */
function LCONN_submitLocalConnectivityData(actionURL, formId) {
    var parametersForm = document.getElementById(formId);
    parametersForm.method = "POST";
    parametersForm.action = actionURL;
    parametersForm.submit();
}
