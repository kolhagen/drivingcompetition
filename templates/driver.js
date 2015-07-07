/**
 * Classes representing the list of drivers.
 */
var DriverList = React.createClass({
	getInitialState: function() {
		return {month: DATE_START.month, year: DATE_START.year, selected: -1};
	},
	onChangeYear: function(year) {
		var update = {year: year};

		if (year == DATE_END.year &&
				this.state.month > DATE_END.month)
			update.month = DATE_END.month;

		if (year == DATE_START.year &&
				this.state.month < DATE_START.month)
			update.month = DATE_START.month;

		this.setState(update);
	},
	onChangeMonth: function(month) {
		this.setState({month: month});
	},
	onDriverClick: function(i, event) {
		this.props.onDriverClick(i, event);
		this.setState({selected: i});
	},
	render: function() {
		// build driver entries
		var driverNodes = this.props.data.map(function (driver, i) {
			var active = (i === this.state.selected) ? " active" : "";

			// pass click handler to parent
			return (
				<Driver key={i} clickHandler={this.onDriverClick.bind(null, i)} data={driver} active={active}/>
			);
		}.bind(this));

		var date = {month: this.state.month, year: this.state.year};

		return (
			<div className="col-md-3">
				<div className="panel panel-info">
					<div className="panel-heading">
						<h3 className="panel-title">Driver</h3>
					</div>
					<div className="panel-body">
						<DateSelect date={date} onChangeYear={this.onChangeYear} onChangeMonth={this.onChangeMonth} />
						<div className="list-group">
							{driverNodes}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var DateSelect = React.createClass({
	render: function() {
		var yearNodes = [];
		for (var year = DATE_START.year; year <= DATE_END.year; year++) {
			yearNodes.push((
				<li key={year}><a href="#" onClick={this.props.onChangeYear.bind(null, year)}>{year}</a></li>
			));
		}

		var minMonths = 1;
		if (this.props.date.year == DATE_START.year)
			minMonths = DATE_START.month;

		var maxMonth = 12;
		if (this.props.date.year == DATE_END.year)
			maxMonth = DATE_END.month;

		var monthNodes = [];
		for (var month = minMonths; month <= maxMonth; month++) {
			monthNodes.push((
				<li key={month}><a href="#" onClick={this.props.onChangeMonth.bind(null, month)}>{MONTHS[month-1]}</a></li>
			));
		}

		var displayMonth = MONTHS[this.props.date.month-1];
		if (this.props.date.month === -1)
			displayMonth = "All";

		return (
			<div>
				<div className="btn-group">
					<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">
						{this.props.date.year} <span className="caret"></span>
					</button>
					<ul className="dropdown-menu">
						{yearNodes}
					</ul>
				</div>

				<div className="btn-group">
					<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">
						{displayMonth} <span className="caret"></span>
					</button>
					<ul className="dropdown-menu">
						{monthNodes}
						<li role="separator" className="divider"></li>
						<li><a href="#" onClick={this.props.onChangeMonth.bind(null, -1)}>All</a></li>
					</ul>
				</div>
			</div>
		);
	}
});

var Driver = React.createClass({
	render: function() {
		var classes = "list-group-item" + this.props.active;

		return (
			<a href="#" className={classes} onClick={this.props.clickHandler}>
				<h4 className="list-group-item-heading">{this.props.data.name}</h4>
				<p className="list-group-item-text">...</p>
			</a>
		);
	}
});
