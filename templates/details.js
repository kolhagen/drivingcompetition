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
		var kmhmalus = 0;
		var pedaldmalus = 0;
		var pedalemalus = 0;
		var rpmmalus = 0;

		if (detailscore) {
			score = Math.round(detailscore.score);
			malus = Math.round(detailscore.kmhmalus + detailscore.pedaldmalus + detailscore.pedalemalus + detailscore.rpmmalus);
			kmhmalus = Math.round(detailscore.kmhmalus);
			pedaldmalus = Math.round(detailscore.pedaldmalus);
			pedalemalus = Math.round(detailscore.pedaldmalus);
			rpmmalus = Math.round(detailscore.pedaldmalus);
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
		var totalKm = 100;
		var kmPerYear = 4800;
		var kmPerMonth = 400;
		var avgThrottle = 35;
		var avgGear = 4;
		var avgVelocity = 87;
		var avgRPM = 2500;
		var pedalD = 50;
		var pedalE = 50;

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
								  <dt>Exceeding Speed</dt>
								  <dd>{kmhmalus} %</dd>
								  <dt>Drive-Pedal Position</dt>
								  <dd>{pedaldmalus} %</dd>
								  <dt>Break-Pedal Position</dt>
								  <dd>{pedalemalus} %</dd>
								  <dt>Exceeding RPM</dt>
								  <dd>{rpmmalus} %</dd>
								</dl>
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Summary</div>
							<div className="panel-body">

								<table className="table table-hover">
									<tr>
										<th>Total driven Kilometers</th><td>{totalKm}</td>
									</tr>
									<tr>
										<th>Avg. Kilometers per Year</th><td>{kmPerYear}</td>
									</tr>
									<tr>
										<th>Avg. Kilometers per Month</th><td>{kmPerMonth}</td>
									</tr>
									<tr>
										<th>Avg. Throttle Position</th><td>{avgThrottle}</td>
									</tr>
									<tr>
										<th>Avg. Gear</th><td>{avgGear}</td>
									</tr>
									<tr>
										<th>Avg. velocity</th><td>{avgVelocity} km/h</td>
									</tr>
									<tr>
										<th>Avg. Rotations Per Mintute</th><td>{avgRPM} rpm</td>
									</tr>
									<tr>
										<th>Pedal Postion D</th><td>{pedalD} %</td>
									</tr>
									<tr>
										<th>Pedal Postion E</th><td>{pedalE} %</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
