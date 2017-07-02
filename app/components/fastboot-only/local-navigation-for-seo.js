import Ember from 'ember';

const {
	Component,
	computed,
	inject
} = Ember;

export default Component.extend({
	wikiVariables: inject.service(),
	localLinks: computed.reads('wikiVariables.localNav'),
	test: computed('localLinks', () => {
		// console.log('Test');
	})
});
