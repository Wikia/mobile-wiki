import Ember from 'ember';

export default Ember.Mixin.create({
	headData: Ember.inject.service(),

	/**
	 * @param {Object} model
	 * @param {Ember.Transition} transition
	 * @returns {void}
	 */
	afterModel(model, transition) {
		this._super(...arguments);

		transition.then(() => {
			this.setDynamicHeadTags(model);
			this.removeDynamicServerTags();
		});
	},

	/**
	 * This function removes all head tags with data-server-head-tags-dynamic attribute to avoid having duplicates.
	 * This function should be removed when fastboot will be introduced.
	 *
	 * @returns {void}
	 */
	removeDynamicServerTags() {
		const headData = this.get('headData');

		if (!headData.get('dynamicServerTagsRemoved')) {
			Ember.$('[data-server-head-tags-dynamic]').remove();
			headData.set('dynamicServerTagsRemoved', true);
		}
	},

	/**
	 * This function updates dynamic tags defined in templates/head.hbs
	 * This is for head tags which could be changed on different routes
	 *
	 * @param {Object} model, this is model object from route::afterModel() hook,
	 * it should be used ONLY in custom implementation of this function
	 * @param {Object} data, object where you can pass data from custom implementation of this function
	 * @returns {void}
	 */
	setDynamicHeadTags(model, data = {}) {
		const wikiVariables = Ember.get(Mercury, 'wiki'),
			displayTitle = data.displayTitle,
			documentTitle = data.documentTitle,
			description = data.description,
			canonical = data.canonical,
			appId = Ember.get(wikiVariables, 'smartBanner.appId.ios'),
			robots = wikiVariables.specialRobotPolicy || data.robots || 'index,follow';

		let keywords = `${wikiVariables.siteMessage},${wikiVariables.siteName},${wikiVariables.dbName}`,
			appleItunesApp = '';

		if (displayTitle) {
			keywords += `,${displayTitle}`;
		}

		if (appId) {
			appleItunesApp = `app-id=${appId}`;

			if (data.appArgument) {
				appleItunesApp += `, app-argument=${data.appArgument}`;
			}
		}

		this.get('headData').setProperties({
			canonical,
			robots,
			keywords,
			appleItunesApp,
			documentTitle,
			description
		});
	}
});
