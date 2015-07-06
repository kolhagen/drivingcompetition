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
	handleClick: function(i, event) {
		this.setState({ selected: data.driver[i] });
	},
	render: function() {
			return (
				<div id="content">
					<DriverList onClick={this.handleClick} data={data.driver} />
					<Details driver={this.state.selected} />
				</div>
			);
		}
});
