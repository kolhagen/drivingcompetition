var Content = React.createClass({
	getInitialState: function() {
		return {selected: null};
	},
	handleClick: function(i, event) {
		//console.log(event);
		//console.log(data.driver[i]);
		this.setState({selected: data.driver[i]});
	},
	render: function() {
			return (
				<div id="content">
					<DriverList onChange={this.handleClick} data={data.driver} />
					<Details driver={this.state.selected} />
				</div>
			);
		}
});
