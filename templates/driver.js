/**
 * Classes representing the list of drivers.
 */
var DriverList = React.createClass({
	getInitialState: function() {
		return {month: TODAY.getMonth() - 1, year: TODAY.getFullYear()};
	},
	onChangeYear: function(year) {
		var update = {year: year};

		if (year == TODAY.getFullYear() &&
				this.state.month >= TODAY.getMonth())
			update.month = TODAY.getMonth() - 1;

		this.setState(update);
	},
	onChangeMonth: function(month) {
		this.setState({month: month});
	},
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

		var yearNodes = [];
		for (var year = FIRST_YEAR; year <= TODAY.getFullYear(); year++) {
			yearNodes.push((
				<li key={year}><a tabIndex="-1" href="#" onClick={this.onChangeYear.bind(null, year)}>{year}</a></li>
			));
		}

		var monthNodes = [];
		var maxMonth = 12;
		if (this.state.year == TODAY.getFullYear())
			maxMonth = TODAY.getMonth();

		for (var month = 0; month < maxMonth; month++) {
			monthNodes.push((
				<li key={month}><a tabIndex="-1" href="#" onClick={this.onChangeMonth.bind(null, month)}>{MONTHS[month]}</a></li>
			));
		}

		return (
			<div>
				<div className="btn-toolbar">
					<div className="btn-group">
						<a className="btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">
							{this.state.year}
							<span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							{yearNodes}
						</ul>
					</div>

					<div className="btn-group">
						<a className="btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">
							{MONTHS[this.state.month]}
							<span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							{monthNodes}
						</ul>
					</div>
				</div>
				<div id="driver-list">
					{driverNodes}
				</div>
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


/*

	<ul class="nav nav-pills">
		<li class="dropdown">
			<a href="#" class="dropdown-toggle" data-toggle="dropdown">
				Dropdown
				<span class="caret"></span>
			</a>
			<ul class="dropdown-menu">
				<li><a href="#">Action</a></li>
				<li><a href="#">Another action</a></li>
				<li><a href="#">Something else here</a></li>
				<li role="separator" class="divider"></li>
				<li><a href="#">Separated link</a></li>
			</ul>
		</li>
	</ul>

*/
