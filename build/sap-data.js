if (!SAP) var SAP = {};

SAP.DATA = {
	init: function() {
		console.log("Initializing SAP Data...");
		if (!SAP.DATA.isDataAvailable()) {
			console.error("Could not load SAP user data! Not initialized!");
			return;
		}

		var data = JSON.parse(localStorage.getItem("data"));
		SAP.DATA.mergeData(data);
	},

	isDataAvailable: function() {
		return (localStorage.getItem("data") !== null);
	},

	mergeData: function(extra) {
		for (driver of data.driver) {
			if (!driver.extra)
				driver.extra = {};

			if (!extra[driver.car])
				continue;

			driver.extra = extra[driver.car];
		}
	},

	getExtras: function(driver, year, month) {
		if (!driver.extra || !driver.extra.static || !driver.extra.monthly)
		 	return {};

		if (!driver.extra.monthly[year] || !driver.extra.monthly[year][month])
			return driver.extra.static;

		var extras = driver.extra.monthly[year][month];

		for (var entry in driver.extra.static) {
			if (!driver.extra.static.hasOwnProperty(entry))
				continue;

			extras[entry] = driver.extra.static[entry];
		}

		return extras;
	},

	reset: function() {
		localStorage.removeItem("data");
	}
}
