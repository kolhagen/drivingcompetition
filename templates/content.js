/**
 * Class representing main view (wrapper for list of drivers and details)
 */
var Content = React.createClass({
	getInitialState: function() {
		return { selected: null, date: null };
	},
	/**
	* Called, when a specific driver is clicked in list.
	*/
	onDriverClick: function(i, event) {
		this.setState({ selected: data.driver[i] });
	},
	onDateChanged: function(date) {
		this.setState({ date: date });
	},
	render: function() {
			return (
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="well header">
								<img src="images/sap.png" />
								Driving Competition
							</div>
						</div>
					</div>
					<div className="row">
						<DriverList onDriverClick={ this.onDriverClick } onDateChanged={ this.onDateChanged } data={ data.driver } />
						<Details driver={ this.state.selected } date={ this.state.date } />
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="panel panel-default footer">
								<div className="panel-body">
									<b>Big Data &amp; Analytical Applications</b> Max Kolhagen, Young-Hwan Kim, Markus Braun
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
});
