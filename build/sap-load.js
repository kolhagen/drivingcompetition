// TODO: Perform API requests and data processing here!

/* some examples
// send API request
var request = "Vehicle('sap.vean::Vehicle_AllModels')/Children?$expand=CurrentTexts,Make/CurrentTexts&$select=CurrentTexts/Name,Make/CurrentTexts/Name";
SAP.API.request(request, function(data) {
	for (car of data.d.results) {
		console.log(car.Make.CurrentTexts.Name + " " + car.CurrentTexts.Name);
	}
});
// send API request (using full url)
var request = "https://xs01ac37c9fd2.hana.ondemand.com/sap/vean/v0.1/odata/Vehicle('sap.vean::Vehicle_AllModels')/Children?$expand=CurrentTexts,Make/CurrentTexts&$select=CurrentTexts/Name,Make/CurrentTexts/Name";
SAP.API.request(request, function(data) {
	var allname;
	for (car of data.d.results) {
		allname += car.Make.CurrentTexts.Name + " " + car.CurrentTexts.Name;
		console.log(car.Make.CurrentTexts.Name + " " + car.CurrentTexts.Name);
	}
	console.log(allname);
}, true);
*/

////
// call the data
////
if (!SAP) var SAP = {};

var allcars = {};
//get trips of each car including the telemetry data of each trip
var apiRequests = 0;
var apiRequestsResponded = 0;

var allscore = {};
var detailinfos = {};

SAP.LOAD = {
	load: function() {
		//get the meta information for each car
		var request = "Vehicle?$expand=Model/CurrentTexts,Make/CurrentTexts&$filter=GroupIndicator eq 0&$select=ID,Model/CurrentTexts/Name,Make/CurrentTexts/Name";
		SAP.API.request(request, function(data) {
			for (vehicle of data.d.results) {
					if (!allcars[vehicle.ID])
						allcars[vehicle.ID] = {};

					allcars[vehicle.ID].make = vehicle.Make.CurrentTexts.Name;
					allcars[vehicle.ID].model = vehicle.Model.CurrentTexts.Name;
			}
		});

		var request = "Vehicle?$filter=GroupIndicator eq 0&$select=ID";
		SAP.API.request(request, function(data) {
			for (vehicle of data.d.results) {
				allscore[vehicle.ID] = {};
				detailinfos[vehicle.ID] = {};
				var request = "Vehicle('" + vehicle.ID + "')/TripSegment?$expand=StartLocationInfo,EndLocationInfo&$select=ID,StartPointInTime,EndPointInTime,Property.ID,Observee.ID,Observee,TelemetryData";
				SAP.API.request(request, function(vid, data) {
					for (trip of data.d.results){
						var telemtryrequest = trip.TelemetryData.__deferred.uri;
						apiRequests++;
						SAP.API.request(telemtryrequest, function(vid, trip, data) {
							var year = parseODataDate(trip.EndPointInTime).getFullYear();
							var month = parseODataDate(trip.EndPointInTime).getMonth()+1;
							var kmhmalus = 0;
							var rpmmalus = 0;
							var pedaldmalus = 0;
							var pedalemalus = 0;
							var throttlemalus = 0;

							var kmhmax = 0;
							var rpmmax = 0;
							var pedaldmax = 0;
							var pedalemax = 0;
							var throttlemax = 0;

							var score = 100;
							for(telemetrydata of data.d.results){
								//console.log(telemetrydata['Property.ID'] + "    "+ telemetrydata.NumericValue + "   " + telemetrydata.PointInTime); 								//pro auftauchen
								if(telemetrydata['Property.ID'] === "sap.vean::Vehicle__sap.vean__vehicleSpeed_sap.bc.ar::KilometerPerHour"){
									if(telemetrydata.NumericValue > 130){
										kmhmalus += 1;
									}
									kmhmax +=1;
								}
								if(telemetrydata['Property.ID'] === "sap.vean::Vehicle__sap.vean__engineSpeed_sap.bc.ar::RevolutionsPerMinute"){
									if(telemetrydata.NumericValue > 2500){
										rpmmalus += 1;
									}
									rpmmax+=1;
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionD_sap.bc.ar::Percent"){
									if(telemetrydata.NumericValue > 70){
										pedaldmalus += 1;
									}
									pedaldmax+=1;
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionE_sap.bc.ar::Percent"){
									if(telemetrydata.NumericValue > 70){
										pedalemalus += 1;
									}
									pedalemax+=1;
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__absThrottlePos_sap.bc.ar::Percent"){
									if(telemetrydata.NumericValue >= 85){
										throttlemalus += 1;
									}
									throttlemax += 1;
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__absThrottlePos_sap.bc.ar::Percent"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__commandedThrottle_sap.bc.ar::Percent"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.vean::Vehicle__sap.vean__Gear"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.IntegerValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.vean::Vehicle__sap.vean__vehicleSpeed_sap.bc.ar::KilometerPerHour"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.vean::Vehicle__sap.vean__engineSpeed_sap.bc.ar::RevolutionsPerMinute"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionD_sap.bc.ar::Percent"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionE_sap.bc.ar::Percent"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								if(telemetrydata['Property.ID'] === "sap.vean::Vehicle__sap.vean__mileage_sap.bc.ar::Kilometer"){
									if(!detailinfos[vid][year])
										detailinfos[vid][year] = {};
									if(!detailinfos[vid][year][month])
										detailinfos[vid][year][month] = {};
									if(!detailinfos[vid][year][month][telemetrydata['Property.ID']])
										detailinfos[vid][year][month][telemetrydata['Property.ID']] = [];
									var entry = {};
									entry.value = telemetrydata.NumericValue;
									entry.date = telemetrydata.PointInTime;
									detailinfos[vid][year][month][telemetrydata['Property.ID']].push(entry);
								}
								//alle telemetrydaten eines trips
							}
							//console.log(kmhmalus + " " + rpmmalus + " " + pedaldmalus + " " + pedalemalus);
							//console.log(kmhmax + " " + rpmmax + " " + pedaldmax + " " + pedalemax);

							var kmhp = 0;
							var rpmp = 0;
							var pedaldp = 0;
							var pedalep = 0;
							var throttle = 0;

							var maxcount = Math.max(kmhmax,rpmmax,pedaldmax,pedalemax,throttlemax);
							if(kmhmalus !== 0){
								kmhp =  kmhmalus / maxcount * 100;
								}
							if(rpmmalus !== 0){
								rpmp = rpmmalus / maxcount * 100;
								}
							if(pedaldmalus !== 0){
								pedaldp = pedaldmalus / maxcount * 100;
								}
							if(pedalemalus !== 0){
								pedalep = pedalemalus / maxcount * 100;
								}
							if(throttlemalus !== 0){
								throttle = throttlemalus / maxcount * 100;
								}
							//console.log(score +" " + kmhp + " " + rpmp + " " + pedaldp + " " + pedalep + " " + throttle);
							malus = kmhp + rpmp + pedaldp + pedalep + throttle;
							score = score - malus;

							//var year = parseODataDate(trip.EndPointInTime).getFullYear();
							//var month = parseODataDate(trip.EndPointInTime).getMonth()+1;
							//console.log(score, month, year, vid);
							if(!allscore[vid][year])
								allscore[vid][year] = {};
							if(!allscore[vid][year][month])
								allscore[vid][year][month] = {accumulated: 0.0, malus: 0.0, count: 0, kmhmahlus: 0.0, rpmmalus: 0.0, pedaldmalus: 0.0, pedalemalus: 0.0, throttlemalus: 0.0};
							allscore[vid][year][month].accumulated += score;
							allscore[vid][year][month].kmhmahlus += kmhp;
							allscore[vid][year][month].rpmmalus += rpmp;
							allscore[vid][year][month].pedaldmalus += pedaldp;
							allscore[vid][year][month].pedalemalus += pedalep;
							allscore[vid][year][month].throttlemalus += throttle;
							allscore[vid][year][month].malus += malus;
							allscore[vid][year][month].count++;
							apiRequestsResponded++;
							checkDone();
						}.bind(null, vid, trip),true);
					}
				}.bind(null, vehicle.ID),false);
			}
		},false);
	}
};


/*if (localStorage.getItem("scores") !== null) {
	allscore = JSON.parse(localStorage.getItem("scores"));
} else {*/

//}

var finalscore = {};
var detailscore = {};
function calculateScore(scoreTable){
for(vehicle in scoreTable){
	if(!finalscore[vehicle])
		finalscore[vehicle] = {};
	if(!detailscore[vehicle])
		detailscore[vehicle] = {};
	for(year in scoreTable[vehicle]){
		if(!finalscore[vehicle][year])
			finalscore[vehicle][year] = {};
		if(!detailscore[vehicle][year])
			detailscore[vehicle][year] = {};
		for(month in scoreTable[vehicle][year]){
			if(!finalscore[vehicle][year][month])
				finalscore[vehicle][year][month] = 0.0;
			if(!detailscore[vehicle][year][month])
				detailscore[vehicle][year][month] = {score: 0.0, malus: 0.0, kmhmalus: 0.0, rpmmalus: 0.0, pedaldmalus: 0.0, pedalemalus: 0.0, throttlemalus: 0.0};
			finalscore[vehicle][year][month] = scoreTable[vehicle][year][month].accumulated / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].score =  scoreTable[vehicle][year][month].accumulated / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].malus =  scoreTable[vehicle][year][month].malus / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].kmhmalus =  scoreTable[vehicle][year][month].kmhmahlus / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].rpmmalus =  scoreTable[vehicle][year][month].rpmmalus / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].pedaldmalus =  scoreTable[vehicle][year][month].pedaldmalus / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].pedalemalus =  scoreTable[vehicle][year][month].pedalemalus / scoreTable[vehicle][year][month].count;
			detailscore[vehicle][year][month].throttlemalus = scoreTable[vehicle][year][month].throttlemalus / scoreTable[vehicle][year][month].count;
		}
	}
}
}

var numberOfTrips = {};
function getNumberOfTrips(scoreTable){
	for(vehicle in scoreTable){
		if(!numberOfTrips[vehicle])
			numberOfTrips[vehicle] = {};
		for(year in scoreTable[vehicle]){
			if(!numberOfTrips[vehicle][year])
				numberOfTrips[vehicle][year] = {};
			for(month in scoreTable[vehicle][year]){
				if(!numberOfTrips[vehicle][year][month])
					numberOfTrips[vehicle][year][month] = {numberOfTrips: 0};
				numberOfTrips[vehicle][year][month].numberOfTrips =  scoreTable[vehicle][year][month].count;
			}
		}
	}
}

var approximatetoMonthRawData = {};
function getapproximatetoMonthRawData(detailTable){
	for(vehicle in detailTable){
		if(!approximatetoMonthRawData[vehicle])
			approximatetoMonthRawData[vehicle] = {};
		for(year in detailTable[vehicle]){
			if(!approximatetoMonthRawData[vehicle][year])
				approximatetoMonthRawData[vehicle][year] = {};
			for(month in detailTable[vehicle][year]){
				if(!approximatetoMonthRawData[vehicle][year][month])
					approximatetoMonthRawData[vehicle][year][month] = {};
				for(telemtrydata in detailTable[vehicle][year][month]){
					//console.log(detailTable[vehicle][year][month][telemtrydata]);
					if(!approximatetoMonthRawData[vehicle][year][month][telemtrydata]){
						approximatetoMonthRawData[vehicle][year][month][telemtrydata] = {first: 0.0, firstdate: 0.0, last: 0.0, lastdate: 0.0, accumulated: 0.0, count: 0};
						}
					var firstsavedate = 0.0;
					var lastsavedate = 0.0;
					for(element of detailTable[vehicle][year][month][telemtrydata]){

						//initial
						if(approximatetoMonthRawData[vehicle][year][month][telemtrydata].firstdate === 0.0){
							firstsavedate = parseODataDate(element.date);
							lastsavedate = parseODataDate(element.date);
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].first = element.value;
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].firstdate = parseODataDate(element.date);
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].last = element.value;
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].lastdate = parseODataDate(element.date);
						}
						if(lastsavedate<parseODataDate(element.date)){
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].last = element.value;
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].lastdate = parseODataDate(element.date);
							lastsavedate = parseODataDate(element.date);

						}
						if(firstsavedate>parseODataDate(element.date)){
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].first = element.value;
							approximatetoMonthRawData[vehicle][year][month][telemtrydata].firstdate = parseODataDate(element.date);
							firstsavedate = parseODataDate(element.date);
						}
						approximatetoMonthRawData[vehicle][year][month][telemtrydata].accumulated +=+ element.value;
						approximatetoMonthRawData[vehicle][year][month][telemtrydata].count++;
					}
				}

			}
		}
	}
}

var approximatetoMonth = {};
function getapproximatetoMonth(detailTable){
	for(vehicle in detailTable){
		if(!approximatetoMonth[vehicle])
			approximatetoMonth[vehicle] = {};
		for(year in detailTable[vehicle]){
			if(!approximatetoMonth[vehicle][year])
				approximatetoMonth[vehicle][year] = {};
			for(month in detailTable[vehicle][year]){
				if(!approximatetoMonth[vehicle][year][month])
					approximatetoMonth[vehicle][year][month] = {};
				for(telemtrydata in detailTable[vehicle][year][month]){
					if(!approximatetoMonth[vehicle][year][month][telemtrydata])
						approximatetoMonth[vehicle][year][month][telemtrydata] = {propertyID: 0.0, value1: 0.0, value2: 0.0};
												//first: 0.0, firstdate: 0.0, last: 0.0, lastdate: 0.0, accumulated: 0.0, count: 0
					element =  detailTable[vehicle][year][month][telemtrydata];
					if(telemtrydata === "sap.ctex::sap.vean::Vehicle__sap.ctex__absThrottlePos_sap.bc.ar::Percent"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1 ;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1 ;
					}
					if(telemtrydata === "sap.ctex::sap.vean::Vehicle__sap.ctex__commandedThrottle_sap.bc.ar::Percent"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
					}
					if(telemtrydata === "sap.vean::Vehicle__sap.vean__Gear"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
					}
					if(telemtrydata === "sap.vean::Vehicle__sap.vean__vehicleSpeed_sap.bc.ar::KilometerPerHour"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
					}
					if(telemtrydata === "sap.vean::Vehicle__sap.vean__engineSpeed_sap.bc.ar::RevolutionsPerMinute"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
					}
					if(telemtrydata === "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionD_sap.bc.ar::Percent"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
					}
					if(telemtrydata === "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionE_sap.bc.ar::Percent"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						if(element.accumulated === 0.0 || element.count === 0.0)
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
						else
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.accumulated / element.count;
						approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
					}
					if(telemtrydata === "sap.vean::Vehicle__sap.vean__mileage_sap.bc.ar::Kilometer"){
						approximatetoMonth[vehicle][year][month][telemtrydata].propertyID = telemtrydata;
						console.log(element.last);
						console.log(element.first);
							if(element.last === 0.0 || element.first === 0.0){
							approximatetoMonth[vehicle][year][month][telemtrydata].value1 = -1;
							approximatetoMonth[vehicle][year][month][telemtrydata].value2 = -1;
							}else{
								var sum = element.last - element.first;
								if(sum < 0){
								approximatetoMonth[vehicle][year][month][telemtrydata].value1 = 0;
								approximatetoMonth[vehicle][year][month][telemtrydata].value2 = 0;
								}else{
								approximatetoMonth[vehicle][year][month][telemtrydata].value1 = element.last - element.first;
								approximatetoMonth[vehicle][year][month][telemtrydata].value2 = element.last;
								}
						}
					}
				}
			}
		}
	}
}

function mergeData(target, values, name) {
for (var car in values) {
	if (!values.hasOwnProperty(car))
		continue;

	if (!target[car])
		target[car] = {};

	if (!target[car].monthly)
		target[car].monthly = {};

	for (var year in values[car]) {
		if (!values[car].hasOwnProperty(year))
			continue;

		if (!target[car].monthly[year])
			target[car].monthly[year] = {};

		// check if not a year property
	/*	if (/^[a-zA-Z]/.test(year)) {
			target[car][name] = values[car];
			continue;
		}*/

		for (var month in values[car][year]) {
			if (!values[car][year].hasOwnProperty(month))
				continue;

			if (!target[car].monthly[year][month])
				target[car].monthly[year][month] = {};

			target[car].monthly[year][month][name] = values[car][year][month];
		}
	}
}

return target;
}

function mergeStaticData(target, values, name) {
for (var car in values) {
	if (!values.hasOwnProperty(car))
		continue;

	if (!target[car])
		target[car] = {};

	if (!target[car].static)
		target[car].static = {};

	target[car].static[name] = values[car];
}

return target;
}

/*function mergeData(target, values, name) {
for (var car in values) {
	if (!values.hasOwnProperty(car))
		continue;

	if (!target[car])
		target[car] = {};

	target[car][name] = values[car];
}

return target;
}*/

function checkDone() {
	SAP.INIT.progress = 1.0 * apiRequestsResponded / apiRequests;
	SAP.INIT.updateProgress();

if (apiRequests > apiRequestsResponded)
	return;
// TODO: Save results to ./data/warehouse.json (@Max)
calculateScore(allscore);
getNumberOfTrips(allscore);
getapproximatetoMonthRawData(detailinfos);
getapproximatetoMonth(approximatetoMonthRawData);

localStorage.setItem('scores', JSON.stringify(finalscore));

var extras = {};
extras = mergeData(extras, detailscore, "score");
extras = mergeData(extras, numberOfTrips, "trips");
extras = mergeData(extras, approximatetoMonth, "approx");

extras = mergeStaticData(extras, allcars, "cars");

// TODO: calculate monthly, yearly averages!

localStorage.setItem('data', JSON.stringify(extras));

SAP.INIT.finish();
}

function parseODataDate(rawDate) {
const timestampInMillis = rawDate.replace(/^\/Date\((\d+)\)\//, "$1");
return new Date(parseInt(timestampInMillis, 10));
}
