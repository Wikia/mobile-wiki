import Ember from 'ember';

const {Controller, computed, inject} = Ember;

export default Controller.extend({
	wikiVariables: inject.service(),
	mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),

	siteName: computed('wikiVariables', function () {
		return this.get('wikiVariables.siteName') || 'Fandom powered by Wikia';
	})
});
