/**
 * Class representing main view (wrapper for list of drivers and details)
 */
var Content = React.createClass({
	getInitialState: function() {
		return { selected: null };
	},
	/**
	* Called, when a specific driver is clicked in list.
	*/
	onDriverClick: function(i, event) {
		this.setState({ selected: data.driver[i] });
	},
	render: function() {
			return (
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1>Driving Competition</h1>
						</div>
					</div>
					<div className="row">
						<DriverList onDriverClick={this.onDriverClick} data={data.driver} />
						<Details driver={this.state.selected} />
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="panel panel-default">
							  <div className="panel-body">
									SAP Seminar [Max Kolhagen, Young-Hwan Kim, Markus Braun]
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
});
