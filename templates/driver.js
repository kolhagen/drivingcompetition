/**
 * Classes representing the list of drivers.
 */
var DriverList = React.createClass({
	render: function() {
		// build driver entries
		var driverNodes = this.props.data.map(function (driver, i) {
			// pass click handler to parent
			return (
				<a href="#" onClick={this.props.onClick.bind(null, i)} key={i} >
					<Driver data={driver} />
				</a>
			);
		}.bind(this));

		return (
			<div id="driver-list">
				{driverNodes}
			</div>
		);
	}
});

var Driver = React.createClass({
	render: function() {
		return (
			<div className="driver">
				Name: {this.props.data.name}
			</div>
		);
	}
});
