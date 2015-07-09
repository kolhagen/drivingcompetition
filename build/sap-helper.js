if (!SAP) var SAP = {}

SAP.HELPER = {
	isNumeric: function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	},

	isString: function(n) {
		return (typeof n === "string");
	}
}
