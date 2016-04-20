import Ember from 'ember';

export default Ember.Mixin.create({
	headData: Ember.inject.service(),

	/**
	 * @param {Object} model
	 * @returns {void}
	 */
	afterModel(model) {
		this._super(...arguments);

		this.setDynamicHeadTags(model);
		this.removeDynamicServerTags();
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
			pageUrl = data.url || '',
			displayTitle = data.displayTitle || '',
			documentTitle = data.documentTitle || '',
			description = data.description || '',
			canonical = wikiVariables.basePath + pageUrl,
			appId = wikiVariables.smartBanner && wikiVariables.smartBanner.appId ? wikiVariables.smartBanner.appId.ios : '',
			robots = wikiVariables.specialRobotPolicy || data.robots || 'index,follow';

		let keywords = `${wikiVariables.siteMessage},${wikiVariables.siteName},${wikiVariables.dbName}`,
			appleItunesApp = '';

		if (displayTitle) {
			keywords += `,${displayTitle}`;
		}

		if (appId) {
			appleItunesApp = `app-id=${appId}`;

			if (pageUrl) {
				appleItunesApp += `, app-argument=${canonical}`;
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
