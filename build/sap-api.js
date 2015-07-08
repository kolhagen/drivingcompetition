var SAP; if (!SAP) SAP = {};

SAP.API = {
	// Constants
	API_URL: 		"https://xs01ac37c9fd2.hana.ondemand.com/sap/vean/v0.1/odata/",
	PROXY: 			"http://localhost:8080/",
	USE_PROXY: 	true,
	AUTH: 			"S09MSEFHRU46PmxqMzVFT3pGSmgn",

	/**
	 * Performs a API request on the SAP HANA backend.
	 */
	request: function(request, callback, useFullUrl) {
		var url = request;
		var parChar = "&";
		if (url.indexOf("?") === -1)
			parChar = "?"

		// prepend API url if useFullUrl is not set or set to false
		if (typeof useFullUrl === 'undefined' || !useFullUrl)
			url = SAP.API.API_URL + url;

		// check for proxy
		if (SAP.API.USE_PROXY)
			url = SAP.API.PROXY + url;

		$.ajax({
			type: 			"GET",
			dataType: 	"json",
			cache: 			true,
			url: 				url + parChar + "$format=json",
			success: 		callback,
			error: 			function(xhr, status, error) {
										// TODO: show error message
										alert(status + " ### " + error);
									},
			beforeSend: function (xhr, settings) {
										xhr.setRequestHeader("Authorization", "Basic " + SAP.API.AUTH);
									}
		});
	}
}
