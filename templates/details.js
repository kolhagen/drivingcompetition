var lastUser = null;

var Details = React.createClass({
	getInitialState: function() {
		return {car: "..."};
	},
	componentDidUpdate: function() {
			// TODO: Kind of hacky, better method?
			if (lastUser == this.props.driver)
				return;

			lastUser = this.props.driver;

			// single car
			// "Vehicle('" + this.props.driver.cars[0] + "')?$expand=CurrentTexts&$select=CurrentTexts/Name"

			var filter = "";
			for (car of this.props.driver.cars) {
				filter += "ID eq '" + car + "' or ";
			}
			filter = filter.substr(0, filter.length - 4);

			var request = "Vehicle('sap.vean::Vehicle_AllModels')/Children?$expand=CurrentTexts,Make/CurrentTexts&$filter=" + filter + "&$select=CurrentTexts/Name,Make/CurrentTexts/Name";
			apiRequest(request, function(data) {
				// console.log(data);
				var cars = "";
				for (car of data.d.results) {
					cars += car.Make.CurrentTexts.Name + " " + car.CurrentTexts.Name + ", ";
				}
				cars = cars.substr(0, cars.length - 2);

				this.setState({car: cars});
			}.bind(this));
	},
	render: function() {
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
