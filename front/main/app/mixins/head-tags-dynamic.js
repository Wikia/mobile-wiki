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
			// We want to run this afterRender in order to be sure that
			// meta tags in head are updated by setDynamicHeadTags method
			Ember.run.schedule('afterRender', () => {
				Ember.$('[data-server-head-tags-dynamic]').remove();
				headData.set('dynamicServerTagsRemoved', true);
			});
		}
	},

	/**
	 * This function updates dynamic tags defined in templates/head.hbs
	 * This is for head tags which could be changed on different routes
	 *
	 * @param {Object} model, this is model object from route::afterModel() hook,
	 * it should be used ONLY in custom implementation of this function
	 * @param {Object} [data={}], object where you can pass data from custom implementation of this function
	 * @returns {void}
	 */
	setDynamicHeadTags(model, data = {}) {
		const wikiVariables = Ember.get(Mercury, 'wiki'),
			htmlTitle = wikiVariables.htmlTitle,
			headData = {
				documentTitle: htmlTitle.parts[0] + htmlTitle.separator + htmlTitle.parts[1],
				description: data.description,
				canonical: data.canonical,
				next: data.next,
				prev: data.prev,
				appId: Ember.get(wikiVariables, 'smartBanner.appId.ios'),
				robots: wikiVariables.specialRobotPolicy || data.robots || 'index,follow',
				keywords: `${wikiVariables.siteMessage},${wikiVariables.siteName},${wikiVariables.dbName}`,
				appleItunesApp: ''
			};

		if (data.documentTitle) {
			headData.documentTitle = data.documentTitle + htmlTitle.separator + headData.documentTitle;
			headData.keywords += `,${data.documentTitle}`;
		}

		if (headData.appId) {
			headData.appleItunesApp = `app-id=${headData.appId}`;

			if (data.appArgument) {
				headData.appleItunesApp += `, app-argument=${data.appArgument}`;
			}
		}

		this.get('headData').setProperties(headData);
	}
});
