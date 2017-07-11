import Ember from 'ember';

const {Mixin, computed, inject} = Ember;

export default Mixin.create({
	wikiVariables: inject.service(),

	mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
	siteName: computed.reads('wikiVariables.siteName'),
});
