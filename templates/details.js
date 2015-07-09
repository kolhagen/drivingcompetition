/**
 * Classes representing the details view of a specific driver.
 */
var Details = React.createClass({
	getInitialState: function() {
		return { extra: null, score: null };
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.driver === null)
			return;

		var extras = SAP.DATA.getExtras(nextProps.driver, nextProps.date.year, nextProps.date.month);
		var score = nextProps.driver.scores[nextProps.date.year][nextProps.date.month];
		this.setState({ extra: extras, score: score });
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

		// TODO: Here you can get the user's data:
		// - this.state.score (refers to the user's score for the selected time
		// span)
		// - this.state.extra (refers to the user's extra data in the selected
		// time span)
		// - this.props.driver (here, every other generic data can be found for
		// the selected driver)
		console.log(this.state.score);
		console.log(this.state.extra);
		console.log(this.props.driver);

		//shortcuts to extra data
		var approx = this.state.extra.approx;
		detailscore = this.state.extra.score;
		numberOfTrips = this.state.extra.score;

		var carImage = "images/"+this.props.driver.car.substring(14)+".png";

		var car = this.state.extra.cars.make + " " + this.state.extra.cars.model;
		var driverquote = this.props.driver.quote;


		var score = 100;
		var malus = 0;

		var penalties = {};
		penalties.kmhmalus = { label:"Exceeding Speed", value: 0 };
		penalties.pedaldmalus = { label:"Drive-Pedal Position", value: 0 };
		penalties.pedalemalus = { label:"Break-Pedal Position", value: 0 };
		penalties.rpmmalus = { label:"Exceeding RPM", value: 0 };

		if (detailscore) {
			score = Math.round(detailscore.score);
			malus = Math.round(detailscore.kmhmalus + detailscore.pedaldmalus + detailscore.pedalemalus + detailscore.rpmmalus);
			penalties.kmhmalus.value = Math.round(detailscore.kmhmalus);
			penalties.pedaldmalus.value = Math.round(detailscore.pedaldmalus);
			penalties.pedalemalus.value = Math.round(detailscore.pedaldmalus);
			penalties.rpmmalus.value = Math.round(detailscore.pedaldmalus);
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
		var posD = "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionD_sap.bc.ar::Percent";
		var posE = "sap.ctex::sap.vean::Vehicle__sap.ctex__pedalPositionE_sap.bc.ar::Percent";
		var rpm = "sap.vean::Vehicle__sap.vean__engineSpeed_sap.bc.ar::RevolutionsPerMinute";
		var kilometer = "sap.vean::Vehicle__sap.vean__mileage_sap.bc.ar::Kilometer";
		var kph = "sap.vean::Vehicle__sap.vean__vehicleSpeed_sap.bc.ar::KilometerPerHour";

		/*
		 * Summary Variables
		 */
		var summary = {};
		summary.totalKm = { label: "Total driven Kilometers", value: 100, unit: "km" };
		summary.kmPerYear = { label: "Avg. Kilometers per Year", value: 4800, unit: "km" };
		summary.kmPerMonth = { label: "Avg. Kilometers per Month", value: 400, unit: "km" };
		summary.avgThrottle = { label: "Avg. Throttle Position", value: 35, unit: "%" };
		summary.avgGear = { label: "Avg. Gear", value: 4, unit: "%" };
		summary.avgVelocity = { label: "Avg. velocity", value: 87, unit: " km/h" };
		summary.avgRPM = { label: "Avg. Rotations Per Mintute", value: 2500, unit: "rpm" };
		summary.pedalD = { label: "Pedal Postion D", value: 50, unit: "%" };
		summary.pedalE = { label: "Pedal Postion E", value: 50, unit: "%" };

		var summaryNodes = Object.keys(summary).map(function(key, i) {
			var entry = summary[key];

			return (
				<tr>
					<th>{ entry.label }</th><td>{ entry.value } { entry.unit }</td>
				</tr>
			)
		});
		console.log(summaryNodes);

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
