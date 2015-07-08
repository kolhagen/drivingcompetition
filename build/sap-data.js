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
		if (!driver.extra || !driver.extra[year] || !driver.extra[year][month])
			return {};

		if (month === 'average')
			return driver.extra[year];

		return driver.extra[year][month];
	}
}
