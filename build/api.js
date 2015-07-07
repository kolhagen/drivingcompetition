// Constants
var API 			= "https://xs01ac37c9fd2.hana.ondemand.com/sap/vean/v0.1/odata/";
var PROXY 		= "http://localhost:8080/";
var USE_PROXY = true;
var AUTH 			= "S09MSEFHRU46PmxqMzVFT3pGSmgn";

/**
 * Performs a API request on the SAP HANA backend.
 */
function apiRequest(request, callback, useFullUrl) {
	var url = request;

	// prepend API url if useFullUrl is not set or set to false
	if (typeof useFullUrl === 'undefined' || !useFullUrl)
		url = API + url;

	// check for proxy
	if (USE_PROXY)
		url = PROXY + url;

	$.ajax({
		type: 			"GET",
		dataType: 	"json",
		cache: 			true,
		url: 				url + "&$format=json",
		success: 		callback,
		error: 			function(xhr, status, error) {
									// TODO: show error message
									alert(status + " ### " + error);
								},
		beforeSend: function (xhr, settings) {
									xhr.setRequestHeader ("Authorization", "Basic " + AUTH);
								}
	});
}
