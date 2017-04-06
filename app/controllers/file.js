import Ember from 'ember';

const {Controller, computed, inject} = Ember;

export default Controller.extend(
	{
		application: inject.controller(),
		article: inject.controller(),
		wikiVariables: inject.service(),

		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
		siteName: computed.reads('wikiVariables.siteName'),

		actions: {
			/**
			 * @returns {void}
			 */
			articleRendered() {
				this.get('article').send('articleRendered', ...arguments);
			}
		}
	}
);
