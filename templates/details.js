/**
 * Classes representing the details view of a specific driver.
 */

// remember last user seen, to prevent from repetitively trying to update content
var lastUser = null;

var Details = React.createClass({
	getInitialState: function() {
		return {car: "..."};
	},
	/**
	 * Called, when content/data of this component has changed.
	 */
	componentDidUpdate: function() {
			// TODO: Kind of hacky, better method?
			if (lastUser === this.props.driver)
				return;

			lastUser = this.props.driver;

			this.setState({car: "..."});

			// build filter for selecting user's cars
			var filter = "";
			for (car of this.props.driver.cars) {
				filter += "ID eq '" + car + "' or ";
			}
			filter = filter.substr(0, filter.length - 4);

			// send API request
			var request = "Vehicle('sap.vean::Vehicle_AllModels')/Children?$expand=CurrentTexts,Make/CurrentTexts&$filter=" + filter + "&$select=CurrentTexts/Name,Make/CurrentTexts/Name";
			apiRequest(request, function(data) {
				// concatenate car manufacturers and models
				var cars = "";
				for (car of data.d.results) {
					cars += car.Make.CurrentTexts.Name + " " + car.CurrentTexts.Name + ", ";
				}
				cars = cars.substr(0, cars.length - 2);

				// update state
				this.setState({car: cars});
			}.bind(this));
	},
	render: function() {
		var message = "Please select a driver from the list!";

		// check if driver has been selected
		if (this.props.driver !== null)
			message = "DetailsView showing " + this.props.driver.name + " has car " + this.state.car;

		return (
			<div className="col-md-9">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title">Details</h3>
					</div>
					<div className="panel-body">

						<div className="media">
							<div className="media-left">
								<img className="media-object" style={{width: "128px", height: "128px"}} src="..." />
							</div>
							<div className="media-body">
								<h4 className="media-heading">Media heading</h4>
								{message}
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Some Progress Bars</div>
							<div className="panel-body">
								<div className="progress">
									<div className="progress-bar progress-bar-warning" role="progressbar" style={{"min-width": "2em", width: "50%"}}>
										50%
									</div>
								</div>
								<div className="progress">
									<div className="progress-bar progress-bar-danger" role="progressbar" style={{"min-width": "2em", width: "72%"}}>
										72%
									</div>
								</div>
							</div>
						</div>

						<div className="panel panel-default">
							<div className="panel-heading">Other Data</div>
							<div className="panel-body">
								...
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
});
