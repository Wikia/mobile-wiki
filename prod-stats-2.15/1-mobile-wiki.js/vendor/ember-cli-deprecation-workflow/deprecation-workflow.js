window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
	workflow: [
		// @todo XW-1375
		{
			handler: 'silence',
			matchId: 'ember-application.injected-container'
		},
		// @todo this is in the code of ember-in-viewport
		{
			handler: 'silence',
			matchId: 'ember-metal.merge'
		}
	]
};
