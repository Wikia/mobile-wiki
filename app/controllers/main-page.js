import Ember from 'ember';

const {Controller, computed, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	wikiVariables: inject.service(),

	mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
	siteName: computed.reads('wikiVariables.siteName'),
});
