import Ember from 'ember';

export default Ember.Mixin.create({
	headData: Ember.inject.service(),

	afterModel(model) {
		this._super(...arguments);
		this.setStaticHeadTags();
		this.setDynamicHeadTags(model);
		this.removeServerTags();
	},

	/**
	 * This function removes all head tags with data-hapi-leftovers attribute to avoid having duplicates.
	 * This function should be removed when fastboot will be introduced.
	 *
	 * @returns {void}
	 */
	removeServerTags() {
		if (!this.controllerFor('application').get('serverTagsRemoved')) {
			Ember.$('head *[data-hapi-leftovers]').remove();
			this.controllerFor('application').set('serverTagsRemoved', true);
		}
	},

	/**
	 * This function sets static head tags defined in templates/head.hbs
	 * This is for head tags which are set only once
	 *
	 * @returns {void}
	 */
	setStaticHeadTags() {
		const wikiVariables = Ember.get(Mercury, 'wiki'),
			verticalColors = {
				comics: '#ff5400',
				games: '#94d11f',
				books: '#ff7f26',
				movies: '#09d3bf',
				lifestyle: '#ffd000',
				music: '#c819ad',
				tv: '#00b7e0'
			};

		this.get('headData').setProperties({
			favicon: wikiVariables.favicon,
			themeColor: verticalColors[wikiVariables.vertical],
			gaUrl: M.prop('gaUrl'),
			qualarooScript: M.prop('qualarooScript'),
			optimizelyScript: M.prop('optimizelyScript')
		});
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
			appId = wikiVariables.smartBanner.appId.ios,
			robots = wikiVariables.specialRobotPolicy || data.robots || 'index,follow';

		let keywords = `${wikiVariables.siteMessage},${wikiVariables.siteName},${wikiVariables.dbName}`,
			appleItunesApp = `app-id=${appId}`;

		if (displayTitle) {
			keywords += `,${displayTitle}`;
		}

		if (pageUrl) {
			appleItunesApp += `, app-argument=${canonical}`;
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
