if (!SAP) var SAP = {};

// constants
var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

SAP.SCORE = {
	DATE_START: { year: Number.MAX_VALUE, month: Number.MAX_VALUE },
	DATE_END: 	{ year: Number.MIN_VALUE, month: Number.MIN_VALUE },
	TODAY: 			new Date(),
	TEMP_DATA: 	null,

	init: function() {
		console.log("Initializing SAP Scores...");
		if (!SAP.SCORE.isDataAvailable()) {
			console.error("Could not load SAP score data! Not initialized!");
			return;
		}

		SAP.SCORE.TEMP_DATA = JSON.parse(localStorage.getItem("scores"));
		SAP.SCORE.determineDateBoundaries();
		SAP.SCORE.mergeData();
		SAP.SCORE.trend(SAP.SCORE.DATE_START.year, SAP.SCORE.DATE_START.month);
	},

	isDataAvailable: function() {
		return (localStorage.getItem("scores") !== null);
	},

	determineDateBoundaries: function() {
		for (var car in SAP.SCORE.TEMP_DATA) {
			if (!SAP.SCORE.TEMP_DATA.hasOwnProperty(car))
				continue;

			for (var year in SAP.SCORE.TEMP_DATA[car]) {
				if (!SAP.SCORE.TEMP_DATA[car].hasOwnProperty(year))
					continue;

				if (+year < SAP.SCORE.DATE_START.year)
					SAP.SCORE.DATE_START.year = +year;
				if (+year > SAP.SCORE.DATE_END.year)
					SAP.SCORE.DATE_END.year = +year;
			}

			for (var year in SAP.SCORE.TEMP_DATA[car]) {
				if (!SAP.SCORE.TEMP_DATA[car].hasOwnProperty(year))
					continue;

				for (var month in SAP.SCORE.TEMP_DATA[car][year]) {
					if (!SAP.SCORE.TEMP_DATA[car][year].hasOwnProperty(month))
						continue;

					if (+year == SAP.SCORE.DATE_START.year && +month < SAP.SCORE.DATE_START.month)
						SAP.SCORE.DATE_START.month = +month;
					if (+year == SAP.SCORE.DATE_END.year && +month > SAP.SCORE.DATE_END.month)
						SAP.SCORE.DATE_END.month = +month;
				}
			}
		}
	},

	mergeData: function() {
		for (driver of data.driver) {
			if (!driver.scores)
				driver.scores = {};

			for (var year = SAP.SCORE.DATE_START.year; year <= SAP.SCORE.DATE_END.year; year++) {
				if (!driver.scores[year])
					driver.scores[year] = {};

				var accumulated = 0.0;
				var count = 0;

				for (var month = 1; month <= 12; month++) {
					if (year == SAP.SCORE.DATE_END.year && month > SAP.SCORE.DATE_END.month ||
							year == SAP.SCORE.DATE_START.year && month < SAP.SCORE.DATE_START.month)
						continue;

					if (!driver.scores[year][month])
						driver.scores[year][month] = {};

					if (SAP.SCORE.TEMP_DATA[driver.car] && SAP.SCORE.TEMP_DATA[driver.car][year] && SAP.SCORE.TEMP_DATA[driver.car][year][month]) {
						driver.scores[year][month] = SAP.SCORE.TEMP_DATA[driver.car][year][month];

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
			for (var year = SAP.SCORE.DATE_START.year; year <= SAP.SCORE.DATE_END.year; year++) {
				if (!driver.scores[year])
					driver.scores[year] = {};

				var accumulated = 0.0;
				var count = 0;

				for (var month = 1; month <= 12; month++) {
					if (year == SAP.SCORE.DATE_END.year && month > SAP.SCORE.DATE_END.month ||
							year == SAP.SCORE.DATE_START.year && month < SAP.SCORE.DATE_START.month)
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

		if (year < SAP.SCORE.DATE_START.year || year > SAP.SCORE.DATE_END.year ||
				month !== 'average' && (month < 1 || month > 12 ||
				(year == SAP.SCORE.DATE_START.year && month < SAP.SCORE.DATE_START.month) ||
				(year == SAP.SCORE.DATE_END.year && month > SAP.SCORE.DATE_END.month))) {
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

		if (year < SAP.SCORE.DATE_START.year || year > SAP.SCORE.DATE_END.year ||
				month !== 'average' && (month < 1 || month > 12 ||
				(year == SAP.SCORE.DATE_START.year && month < SAP.SCORE.DATE_START.month) ||
				(year == SAP.SCORE.DATE_END.year && month > SAP.SCORE.DATE_END.month))) {
			console.error('Invalid Timespan!');
			return;
		}

		if (year == SAP.SCORE.DATE_START.year && (
					month === 'average' ||
					month !== 'average' && month == SAP.SCORE.DATE_START.month)) {
			i = 0;
			for (driver of data.driver) {
				driver.trend = 0;
			}

			SAP.SCORE.calculate(year, month);
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

			SAP.SCORE.calculate(previousYear, previousMonth);
			var previousRank = {};
			var i = 0;
			for (driver of data.driver) {
				previousRank[driver.name] = i++;
			}

			SAP.SCORE.calculate(year, month);
			i = 0;
			for (driver of data.driver) {
				driver.trend = (previousRank[driver.name] - i++);
			}
		}
	},

	reset: function() {
		localStorage.removeItem("scores");
	}
}
