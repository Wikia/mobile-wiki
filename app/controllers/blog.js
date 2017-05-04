import Ember from 'ember';

const {Controller, computed, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	article: inject.controller(),
	wikiVariables: inject.service(),

	commentsPage: computed.alias('application.commentsPage'),
	mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
	siteName: computed.reads('wikiVariables.siteName'),

	actions: {
		articleRendered() {
			this.get('article').send('articleRendered', ...arguments);
		}
	}
});
