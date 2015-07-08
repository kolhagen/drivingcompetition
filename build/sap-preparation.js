// fill driver w/ random score data
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var DATE_START = {year: Number.MAX_VALUE, month: Number.MAX_VALUE};
var DATE_END = {year: Number.MIN_VALUE, month: Number.MIN_VALUE};
var TEMP_DATA = null;

var SAP = {
	init: function() {
		if (localStorage.getItem("scores") !== null) {
			TEMP_DATA = JSON.parse(localStorage.getItem("scores"));
			SAP.determineDateBoundaries();
			SAP.mergeData();
			SAP.trend(DATE_START.year, DATE_START.month);
		} else {
			// TODO: show error that data has not been loaded yet
			DATE_START = {year: 2013, month: 8};
			DATE_END = {year: 2015, month: 4};
		}
	},

	determineDateBoundaries: function() {
		for (var car in TEMP_DATA) {
			if (!TEMP_DATA.hasOwnProperty(car))
				continue;

			for (var year in TEMP_DATA[car]) {
				if (!TEMP_DATA[car].hasOwnProperty(year))
					continue;

				if (+year < DATE_START.year)
					DATE_START.year = +year;
				if (+year > DATE_END.year)
					DATE_END.year = +year;
			}

			for (var year in TEMP_DATA[car]) {
				if (!TEMP_DATA[car].hasOwnProperty(year))
					continue;

				for (var month in TEMP_DATA[car][year]) {
					if (!TEMP_DATA[car][year].hasOwnProperty(month))
						continue;

					if (+year == DATE_START.year && +month < DATE_START.month)
						DATE_START.month = +month;
					if (+year == DATE_END.year && +month > DATE_END.month)
						DATE_END.month = +month;
				}
			}
		}
	},

	mergeData: function() {
		for (driver of data.driver) {
			for (var year = DATE_START.year; year <= DATE_END.year; year++) {
				if (!driver.scores[year])
					driver.scores[year] = {};

				var accumulated = 0.0;
				var count = 0;

				for (var month = 1; month <= 12; month++) {
					if (year == DATE_END.year && month > DATE_END.month ||
							year == DATE_START.year && month < DATE_START.month)
						continue;

					if (!driver.scores[year][month])
						driver.scores[year][month] = {};

					if (TEMP_DATA[driver.car] && TEMP_DATA[driver.car][year] && TEMP_DATA[driver.car][year][month]) {
						driver.scores[year][month] = TEMP_DATA[driver.car][year][month];

						accumulated += driver.scores[year][month];
						count++;
					} else {
						driver.scores[year][month] = -1;
					}
				}

				driver.scores[year].average = (accumulated / count);
			}
		}
	},

	fillRandomScoreData: function() {
		for (driver of data.driver) {
			for (var year = DATE_START.year; year <= DATE_END.year; year++) {
				if (!driver.scores[year])
					driver.scores[year] = {};

				var accumulated = 0.0;
				var count = 0;

				for (var month = 1; month <= 12; month++) {
					if (year == DATE_END.year && month > DATE_END.month ||
							year == DATE_START.year && month < DATE_START.month)
						continue;

					if (!driver.scores[year][month])
						driver.scores[year][month] = {};

					if (Math.random() >= 0.2) {
						driver.scores[year][month] = Math.random() * 8.0 + 2.0;

						accumulated += driver.scores[year][month];
						count++;
					} else {
						driver.scores[year][month] = -1;
					}
				}

				driver.scores[year].average = (accumulated / count);
			}
		}
	},

	// calculate ranking based on score
	calculate: function(year, month) {
		if (typeof month === 'undefined')
			month = 'average';

		if (year < DATE_START.year || year > DATE_END.year ||
				month !== 'average' && (month < 1 || month > 12 ||
				(year == DATE_START.year && month < DATE_START.month) ||
				(year == DATE_END.year && month > DATE_END.month))) {
			console.error('Invalid Timespan!');
			return;
		}

		data.driver.sort(function (driver1, driver2) {
			if (driver1.scores[year][month] === -1 && driver2.scores[year][month] === -1)
				return 0;

			if (driver1.scores[year][month] === -1)
				return driver2.scores[year][month];

			if (driver2.scores[year][month] === -1)
				return -driver1.scores[year][month];

			return driver2.scores[year][month] - driver1.scores[year][month];
		});
	},

	// calculate trend in rank compared to previous timespan
	trend: function(year, month) {
		if (typeof month === 'undefined')
			month = 'average';

		if (year < DATE_START.year || year > DATE_END.year ||
				month !== 'average' && (month < 1 || month > 12 ||
				(year == DATE_START.year && month < DATE_START.month) ||
				(year == DATE_END.year && month > DATE_END.month))) {
			console.error('Invalid Timespan!');
			return;
		}

		if (year == DATE_START.year && (
					month === 'average' ||
					month !== 'average' && month == DATE_START.month)) {
			i = 0;
			for (driver of data.driver) {
				driver.trend = 0;
			}

			SAP.calculate(year, month);
		} else {
			var previousMonth;
			var previousYear;
			if (month !== 'average') {
				previousMonth = month - 1;
				previousYear = year;
				if (previousMonth == 0) {
					previousMonth = 12;
					previousYear = year - 1;
				}
			} else {
				previousMonth = month;
				previousYear = year - 1;
			}

			SAP.calculate(previousYear, previousMonth);
			var previousRank = {};
			var i = 0;
			for (driver of data.driver) {
				previousRank[driver.name] = i++;
			}

			SAP.calculate(year, month);
			i = 0;
			for (driver of data.driver) {
				driver.trend = (previousRank[driver.name] - i++);
			}
		}
	}
}

SAP.init();
