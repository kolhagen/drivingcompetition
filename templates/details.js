/**
 * Classes representing the details view of a specific driver.
 */
function CarSubString (driverProps){

}
var Details = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.driver === null)
			return;

		var extras = SAP.DATA.getExtras(nextProps.driver, this.props.date.year, this.props.date.month);
		var score = nextProps.driver.scores[this.props.date.year][this.props.date.month];
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
		//console.log(this.state.score);
		console.log(this.state.extra);
		//console.log(this.props.driver);

		//shortcuts to extra data
		var approx = this.state.extra.approx;
		car = this.state.extra.cars;
		detailscore = this.state.extra.score;
		numberOfTrips = this.state.extra.score;

		var carImage = "images/"+this.props.driver.car.substring(14)+".png";

		var detailmessage = "Details for: " + this.props.driver.name;
		var vehiclemessage = "Vehicle: " + car.make + " " + car.model;
		var driverquote = this.props.driver.quote;

		if(!detailscore){
			score = 0;
		}else{
		var score = detailscore.score;
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
		var totalKm = "Total driven Kilometers: ";
		var kmPerYear = "Avg. Kilometers per Month: " +4800;
		var kmPerMonth = "Avg. Kilometers per Month: " +400;
		var avgThrottle = 35;
		var avgThrottleStyle = {};
		avgThrottleStyle.width=avgThrottle+"%";
		var avgGear = "Avg Gear: "+ 4;
		var avgVelocity = "Avg velocity: "+87+ "km/h";
		var avgRPM = "Avg Rotations Per Mintute: "+2500+"rpm";
		var pedalD = "Pedal Postion D: "+50+"%";
		var pedalE = "Pedal Postion E: "+50+"%";

		return (
			<div className="col-md-8">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title">Details</h3>
					</div>
					<div className="panel-body">

						<div className="media">
							<div className="media-left">
								<img className="media-object" style={{ width: "128px", height: "128px" }} src={carImage} />
							</div>
							<div className="media-body">
								<h4 className="media-heading">Media heading</h4>
								{ detailmessage }
								<div className="media-body">
								{ vehiclemessage }
									<blockquote className="blockquote-reverse">
									{driverquote}
									</blockquote>
								</div>
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Scoring</div>
							<div className="panel-body">
								<div className="progress">
									<div className="progress-bar progress-bar-warning" role="progressbar" style={{ minWidth: "2em", width: { score }}}>
										{ score } %
									</div>
								</div>
								<div className="progress">
									<div className="progress-bar progress-bar-danger" role="progressbar" style={{ minWidth: "2em", width: "72%" }}>
										72%
									</div>
								</div>
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Summary</div>
							<div className="panel-body">
							<p>{totalKm}</p>
							<p>{kmPerYear}</p>
							<p>{kmPerMonth}</p>
							<p>Avg. Throttle Position:</p>
							<div className="progress">
							<div className="progress-bar" role="progressbar" style={avgThrottleStyle}>
								{avgThrottle}%
							</div>
						</div>
							<p>{avgGear}</p>
							<p>{avgVelocity}</p>
							<p>{avgRPM}</p>
							<p>{pedalD}</p>
							<p>{pedalE}</p>
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
});
