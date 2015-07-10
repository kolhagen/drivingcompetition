/**
 * Classes representing the details view of a specific driver.
 */
var Details = React.createClass({
	getInitialState: function() {
		return { extra: null, extraSum: null, score: null };
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.driver === null)
			return;

		var extras = SAP.DATA.getExtras(nextProps.driver, nextProps.date.year, nextProps.date.month);
		var score = nextProps.driver.scores[nextProps.date.year][nextProps.date.month];

		var extrasSum = null;
		if (nextProps.date.month === "average")
			extrasSum = SAP.DATA.getExtras(nextProps.driver, nextProps.date.year, "sum");

		this.setState({ extra: extras, extraSum: extrasSum, score: score });
	},
	render: function() {
		// check if driver has been selected
		if (this.props.driver === null)
			return (
				<div className="col-md-8">
					<div className="panel panel-danger">
						<div className="panel-heading">
							<h3 className="panel-title">Details</h3>
						</div>
						<div className="panel-body">
							Please select a driver from the list!
						</div>
					</div>
				</div>
			);

		console.log(this.state.extraSum);

		// TODO: Here you can get the user's data:
		// - this.state.score (refers to the user's score for the selected time
		// span)
		// - this.state.extra (refers to the user's extra data in the selected
		// time span)
		// - this.props.driver (here, every other generic data can be found for
		// the selected driver)
		//console.log(this.state.score);
		//console.log(this.state.extra);
		//console.log(this.props.driver);

		//shortcuts to extra data
		approx = this.state.extra.approx;
		detailscore = this.state.extra.score;
		numberOfTrips = this.state.extra.trips;

		var carImage = "images/"+this.props.driver.car.substring(14)+".png";

		var car = this.state.extra.cars.make + " " + this.state.extra.cars.model;
		var driverquote = this.props.driver.quote;

		/*
		*Detail Veriables
		*/
		var noscore = 100;
		var score = 0;
		var malus = 0;

		var penalties = {};
		penalties.kmhmalus = { label:"Exceeding Speed", value: 0 };
		penalties.pedaldmalus = { label:"Pedal D Position", value: 0 };
		penalties.pedalemalus = { label:"Pedal E Position", value: 0 };
		penalties.rpmmalus = { label:"Exceeding RPM", value: 0 };
		penalties.throttle = { label:"Exceeding Throttle", value: 0 };
		//console.log(detailscore);
		if (detailscore) {
			noscore = 0 ;
			score = detailscore.score.toFixed(2);
			malus = (detailscore.kmhmalus + detailscore.pedaldmalus + detailscore.pedalemalus + detailscore.rpmmalus + detailscore.throttlemalus).toFixed(2);

			//console.log(detailscore.kmhmalus+ " " + detailscore.pedaldmalus+ " "  + detailscore.pedalemalus+ " "  + detailscore.rpmmalus+ " "  + detailscore.throttlemalus)
			penalties.kmhmalus.value = detailscore.kmhmalus.toFixed(2);
			penalties.pedaldmalus.value = detailscore.pedaldmalus.toFixed(2);
			penalties.pedalemalus.value = detailscore.pedalemalus.toFixed(2);
			penalties.rpmmalus.value = detailscore.rpmmalus.toFixed(2);
			penalties.throttle.value = detailscore.throttlemalus.toFixed(2);
		}

		var penaltyNodes = [];
		for (var entry in penalties) {
			if (!penalties.hasOwnProperty(entry))
				continue;
			penaltyNodes.push((
				<dt>{ penalties[entry].label }</dt>
			));

			penaltyNodes.push((
				<dd>{ penalties[entry].value } %</dd>
			));
		}

		
		/*
		 * Block of name Variables as shortcut
		 */
		var throttle = "sap.ctex::sap.vean::Vehicle__sap.ctex__absThrottlePos_sap.bc.ar::Percent";
		var commandedthrottle = "sap.ctex::sap.vean::Vehicle__sap.ctex__commandedThrottle_sap.bc.ar::Percent";
		var posD = "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionD_sap.bc.ar::Percent";
		var posE = "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionE_sap.bc.ar::Percent";
		var rpm = "sap.vean::Vehicle__sap.vean__engineSpeed_sap.bc.ar::RevolutionsPerMinute";
		var kilometer = "sap.vean::Vehicle__sap.vean__mileage_sap.bc.ar::Kilometer";
		var kph = "sap.vean::Vehicle__sap.vean__vehicleSpeed_sap.bc.ar::KilometerPerHour";
		var gear = "sap.vean::Vehicle__sap.vean__Gear"

		/*
		 * Summary Variables
		 */
		var summary = {};
		summary.numberoftrips = { label: "Total number of trips", value: "n/A", unit: "" };
		summary.drivenkm = { label: "Total driven Kilometers this month", value: "n/A", unit: "km" };
		summary.totalkmPerYear = { label: "Total driven Kilometers this year", value: "n/A", unit: "km" };
		summary.totalKm = { label: "Total driven Kilometers (mileage status)", value: "n/A", unit: "km" };
		summary.kmPerYear = { label: "Avg. Kilometers this Year per month", value: "n/A", unit: "km" };		
		summary.kmPerTrip = { label: "Avg. Kilometers per trip", value: "n/A", unit: "km" };
		summary.avgThrottle = { label: "Avg. Throttle Position", value: "n/A", unit: "%" };
		summary.avgcommandedThrottle = { label: "Avg. Commanded Throttle Position", value: "n/A", unit: "%" };
		summary.avgGear = { label: "Avg. Gear", value: "n/A", unit: "" };
		summary.avgVelocity = { label: "Avg. velocity", value: "n/A", unit: " km/h" };
		summary.avgRPM = { label: "Avg. Rotations Per Mintute", value: "n/A", unit: "rpm" };
		summary.pedalD = { label: "Pedal Postion D", value: "n/A", unit: "%" };
		summary.pedalE = { label: "Pedal Postion E", value: "n/A", unit: "%" };

		

		if(numberOfTrips){
			summary.numberoftrips.value = numberOfTrips.numberOfTrips;
		}
		if(this.props.date.month === "average"){
			console.log(this.props.driver.extra.monthly[this.props.date.year].sum.trips.numberOfTrips);
			summary.numberoftrips.value = this.props.driver.extra.monthly[this.props.date.year].sum.trips.numberOfTrips;
		}

		if (approx) {
			if(approx[kilometer]){
				console.log(approx[kilometer]);				
				if(typeof approx[kilometer].value2 == "string"){
					summary.drivenkm.value = Math.round(approx[kilometer].value1);
					summary.totalKm.value = approx[kilometer].value2;
					summary.kmPerTrip.value = Math.round(Math.round(approx[kilometer].value1) / numberOfTrips.numberOfTrips);
				}else{
					summary.kmPerYear.value = Math.round(approx[kilometer].value1);
					summary.totalkmPerYear.value = this.props.driver.extra.monthly[this.props.date.year].sum.approx[kilometer].value1
					summary.kmPerTrip.value = Math.round(Math.round(approx[kilometer].value1) / numberOfTrips.numberOfTrips);
							//letzer tachostand des jahres
							if(this.props.date.month === "average"){
								var lastMonth = 12;
								if (this.props.date.year === SAP.SCORE.DATE_END.year)
									lastMonth = SAP.SCORE.DATE_END.month;
								summary.totalKm.value = Math.round(this.props.driver.extra.monthly[this.props.date.year][lastMonth].approx[kilometer].value2);
							}
				}
				
			}
			if(approx[throttle])
				summary.avgThrottle.value = approx[throttle].value1.toFixed(2);
			if(approx[commandedthrottle])
				summary.avgcommandedThrottle.value = approx[commandedthrottle].value1.toFixed(2);
			if(approx[gear] && approx[gear].value1 !== 0)
				summary.avgGear.value = approx[gear].value1.toFixed(2);
			if(approx[kph])
				summary.avgVelocity.value = approx[kph].value1.toFixed(2);
			if(approx[rpm])
				summary.avgRPM.value = approx[rpm].value1.toFixed(2);
			if(approx[posD])
				summary.pedalD.value = approx[posD].value1.toFixed(2);
			if(approx[posE])
				summary.pedalE.value = approx[posE].value1.toFixed(2);
		}

		var summaryNodes = Object.keys(summary).map(function(key, i) {
			var entry = summary[key];

			return (
				<tr>
					<th>{ entry.label }</th><td>{ entry.value } { entry.unit }</td>
				</tr>
			)
		});

		return (
			<div className="col-md-8">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title">Details</h3>
					</div>
					<div className="panel-body">

						<div className="media">
							<div className="media-left">
								<img className="media-object img-thumbnail" style={{ width: "128px", height: "128px" }} src={carImage} />
							</div>
							<div className="media-body">
								<h3 className="media-heading">{ this.props.driver.name }</h3>
								<div className="media-body">
									<p>Drives a { car }</p>
									<div className="alert alert-warning quote">
										<div style={{ float: "left" }}>&raquo;</div><div style={{ float: "right" }}>&laquo;</div><div style={{ textAlign: "center" }}>{driverquote}</div>
										<div className="clear"></div>
									</div>
								</div>
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Scoring</div>
							<div className="panel-body">
								<div className="progress">
									<div className="progress-bar progress-bar-info" role="progressbar" style={{width: noscore + "%" }}>
		 								n/A
									</div>
									<div className="progress-bar progress-bar-success" role="progressbar" style={{ minWidth: "1em", width: score + "%" }}>
										{ score }%
									</div>
									<div className="progress-bar progress-bar-danger" role="progressbar" style={{ minWidth: "1em", width: malus + "%" }}>
										{ malus }%
									</div>
								</div>

								<h4>Penalties:</h4>
								<dl className="dl-horizontal">
									{ penaltyNodes }
								</dl>
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Summary</div>
							<div className="panel-body">

								<table className="table table-hover">
								 { summaryNodes }
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
