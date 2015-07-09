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

			// calculate averages
			SAP.DATA.buildAverages(driver);
		}
	},

	buildAverages: function(driver) {
		for (var year in driver.extra.monthly) {
			if (!driver.extra.monthly.hasOwnProperty(year))
				continue;

			//console.log("### " + driver.name + " " + year);
			var averages = {};
			for (var month in driver.extra.monthly[year]) {
				if (!driver.extra.monthly[year].hasOwnProperty(month))
					continue;

				for (var key in driver.extra.monthly[year][month]) {
					if (!driver.extra.monthly[year][month].hasOwnProperty(key))
						continue;

					SAP.DATA.buildAveragesRecursive(driver.extra.monthly[year][month], averages, key);
				}
			}

			for (var key in averages) {
				if (!averages.hasOwnProperty(key))
					continue;

				SAP.DATA.cleanAveragesRecursive(averages, key);
			}

			//console.log(averages);

			driver.extra.monthly[year].average = averages;
		}
	},

	buildAveragesRecursive: function(data, target, key) {
		if (!target[key])
			target[key] = {};

		// build average over data into target
		if (SAP.HELPER.isNumeric(data[key])) {
			if (!target[key].hasOwnProperty("count") || !target[key].hasOwnProperty("average")) {
				target[key].average = 0.0;
				target[key].count = 0;
			}

			// skip non-available information
			if (data[key] == -1)
				return;

			target[key].average += +data[key];
			target[key].count++;
			return;
		} else if(SAP.HELPER.isString(data[key])) {
			target[key] = data[key];
			return;
		}

		for (var subKey in data[key]) {
			if (!data[key].hasOwnProperty(subKey))
				continue;

			SAP.DATA.buildAveragesRecursive(data[key], target[key], subKey)
		}
	},

	cleanAveragesRecursive: function(averages, key) {
		if (!averages[key] || (typeof averages[key] !== "object"))
			return;

		if (averages[key].hasOwnProperty("average") && averages[key].hasOwnProperty("count")) {
			var avg = averages[key].average / averages[key].count;
			delete averages[key].average;
			delete averages[key].count;
			averages[key] = avg;
			return;
		}

		for (var subKey in averages[key]) {
			if (!averages[key].hasOwnProperty(subKey))
				continue;

			SAP.DATA.cleanAveragesRecursive(averages[key], subKey);
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
