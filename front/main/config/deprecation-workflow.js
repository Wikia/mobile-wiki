window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
	workflow: [
		// @todo XW-1375
		{ handler: "silence", matchId: "ember-application.injected-container" }
	]
};
