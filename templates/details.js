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
			if (lastUser == this.props.driver)
				return;

			lastUser = this.props.driver;

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
		// check if driver has been selected
		if (this.props.driver == null)
			return (
				<div id="details">
					Please select a driver from the list!
				</div>
			)

		return (
			<div id="details">
				DetailsView showing {this.props.driver.name} has car {this.state.car}
			</div>
		);
	}
});
