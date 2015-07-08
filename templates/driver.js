/**
 * Classes representing the list of drivers.
 */
var DriverList = React.createClass({
	getInitialState: function() {
		var state = { month: SAP.SCORE.DATE_START.month, year: SAP.SCORE.DATE_START.year, selected: -1 };

		// sync w/ parent
		this.props.onDateChanged({ year: state.year, month: state.month });

		return state;
	},
	onChangeYear: function(year) {
		var update = { year: year, month: this.state.month };

		if(this.state.month !== -1) {
			if (year == SAP.SCORE.DATE_END.year &&
					this.state.month > SAP.SCORE.DATE_END.month)
				update.month = SAP.SCORE.DATE_END.month;

			if (year == SAP.SCORE.DATE_START.year &&
					this.state.month < SAP.SCORE.DATE_START.month)
				update.month = SAP.SCORE.DATE_START.month;
		}

		this.updateRanking(update.year, update.month);
	},
	onChangeMonth: function(month) {
		this.updateRanking(this.state.year, month);
	},
	updateRanking: function(year, month) {
		m = (month !== -1) ? month : "average";

		if (this.state.selected !== -1)
			var selectedName = this.props.data[this.state.selected].name;

		var newSelectIndex = -1;

		SAP.SCORE.trend(year, m);

		if (this.state.selected !== -1) {
			var i = 0;
			for (var driver of this.props.data) {
				i++;
				if (driver.name !== selectedName)
					continue;

				newSelectIndex = i - 1;
			}
		}

		this.setState({ year: year, month: month, selected: newSelectIndex });
		this.props.onDateChanged({ year: year, month: month });
	},
	onDriverClick: function(i, event) {
		this.props.onDriverClick(i, event);
		this.setState({selected: i});
	},
	render: function() {
		// build driver entries
		var driverNodes = this.props.data.map(function (driver, i) {
			var data = {};
			data.driver = driver;
			data.active = (i === this.state.selected) ? " active" : "";
			data.rank = (i + 1);
			data.score = driver.scores[this.state.year][this.state.month];

			// pass click handler to parent
			return (
				<Driver key={ i } clickHandler={ this.onDriverClick.bind(null, i) } data={ data }/>
			);
		}.bind(this));

		var date = { month: this.state.month, year: this.state.year };

		return (
			<div className="col-md-4">
				<div className="panel panel-info">
					<div className="panel-heading">
						<h3 className="panel-title">Driver</h3>
					</div>
					<div className="panel-body">
						<DateSelect date={ date } onChangeYear={ this.onChangeYear } onChangeMonth={ this.onChangeMonth } />
						<div className="list-group">
							{ driverNodes }
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
		for (var year = SAP.SCORE.DATE_START.year; year <= SAP.SCORE.DATE_END.year; year++) {
			yearNodes.push((
				<li key={ year }><a href="#" onClick={ this.props.onChangeYear.bind(null, year) }>{ year }</a></li>
			));
		}

		var minMonths = 1;
		if (this.props.date.year == SAP.SCORE.DATE_START.year)
			minMonths = SAP.SCORE.DATE_START.month;

		var maxMonth = 12;
		if (this.props.date.year == SAP.SCORE.DATE_END.year)
			maxMonth = SAP.SCORE.DATE_END.month;

		var monthNodes = [];
		for (var month = minMonths; month <= maxMonth; month++) {
			monthNodes.push((
				<li key={ month }><a href="#" onClick={ this.props.onChangeMonth.bind(null, month) }>{ MONTHS[month-1] }</a></li>
			));
		}

		var displayMonth = MONTHS[this.props.date.month-1];
		if (this.props.date.month === -1)
			displayMonth = "All";

		return (
			<div id="driver-list-date" className="well well-sm">
				<div className="btn-group" style={{ marginRight: "10px" }}>
					<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">
						{ displayMonth } <span className="caret"></span>
					</button>
					<ul className="dropdown-menu">
						{ monthNodes }
						<li role="separator" className="divider"></li>
						<li><a href="#" onClick={ this.props.onChangeMonth.bind(null, -1) }>All</a></li>
					</ul>
				</div>

				<div className="btn-group">
					<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">
						{ this.props.date.year } <span className="caret"></span>
					</button>
					<ul className="dropdown-menu">
						{ yearNodes }
					</ul>
				</div>

				<div className="clear"></div>
			</div>
		);
	}
});

var Driver = React.createClass({
	render: function() {
		var picture = this.props.data.driver.picture ? this.props.data.driver.picture : "images/avatar.png";

		var rootClasses = "list-group-item" + this.props.data.active;
		var ribbonClasses = "driver-ribbon";

		var ribbons = [ " gold-bg", " silver-bg", " bronze-bg", "", "", "" ];
		// var ribbons = [ " green-bg", "", "", "", " orange-bg", " red-bg" ];
		ribbonClasses += ribbons[this.props.data.rank - 1];

		var trend = "";
		if (this.props.data.driver.trend > 0)
			trend = "glyphicon glyphicon-arrow-up green";
		else if (this.props.data.driver.trend < 0)
				trend = "glyphicon glyphicon-arrow-down red";

		var score = "";
		if (this.props.data.score !== -1)
			score = Math.round(this.props.data.score) + " %";

		return (
			<a href="#" className={ rootClasses } onClick={ this.props.clickHandler }>
				<div className="media">
				  <div className="media-left">
				    <img className="media-object" src={picture} style={{ width: "48px", height: "48px" }} />
				  </div>
				  <div className="media-body">
				    <h4 className="media-heading"><b>{ this.props.data.rank }.</b> { this.props.data.driver.name }</h4>
				    { this.props.data.driver.department }
				  </div>
				</div>
				<div className={ ribbonClasses }></div>
				<div className="driver-score">{ score }</div>
				<div className="driver-trend"><span className={ trend }></span></div>
			</a>
		);
	}
});
