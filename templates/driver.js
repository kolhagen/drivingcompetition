var DriverList = React.createClass({
	render: function() {
		var driverNodes = this.props.data.map(function (driver, i) {
			return (
				<a href="#" onClick={this.props.onChange.bind(null, i)} key={i} >
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
