import Ember from 'ember';

const {Controller, inject, get, getWithDefault} = Ember;

export default Controller.extend(
	{
		application: inject.controller(),
		article: inject.controller(),

		/**
		 * @returns {void}
		 */
		init() {
			this._super(...arguments);
			this.setProperties({
				mainPageTitle: get(Mercury, 'wiki.mainPageTitle'),
				siteName: getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by Wikia')
			});
		},

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
