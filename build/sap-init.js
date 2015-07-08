if (!SAP) var SAP = {};

SAP.INIT = {
	progress: 0.0,
	callback: null,

	update: function(callback) {
		console.log("Updating SAP Data...");

		SAP.INIT.callback = callback;
		SAP.INIT.progress = 0.0;

		$('#modalLoading').modal({
		  backdrop: 'static',
		  keyboard: false
		});

		// TODO: Add real data loading functions
		SAP.INIT.loadPseudoData();
	},

	finish: function() {
		$("#modalLoading").modal("hide");

		if (SAP.INIT.callback)
			SAP.INIT.callback();
	},

	updateProgress: function() {
		$("#modalLoadingProgress").width(SAP.INIT.progress * 100 + "%");
	},

	loadPseudoData: function() {
		SAP.INIT.progress += Math.min(Math.random() / 10.0, 1.0);
		SAP.INIT.updateProgress();

		if (SAP.INIT.progress < 1.0) {
			setTimeout(SAP.INIT.loadPseudoData, Math.random() * 1000);
			return;
		}

		setTimeout(function() {
			SAP.INIT.finish();
		}, 1000);
	},

	reset: function() {
		SAP.SCORE.reset();
		SAP.DATA.reset();
	}
}
