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
		});
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
		const wikiVariables = this.modelFor('application'),
			htmlTitleSettings = wikiVariables.htmlTitle,
			wikiHtmlTitle = htmlTitleSettings.parts.join(htmlTitleSettings.separator),
			headData = {
				htmlTitle: wikiHtmlTitle,
				description: data.description,
				canonical: data.canonical,
				next: data.next,
				prev: data.prev,
				appId: Ember.get(wikiVariables, 'smartBanner.appId.ios'),
				robots: wikiVariables.specialRobotPolicy || data.robots || 'index,follow',
				keywords: `${wikiVariables.siteMessage},${wikiVariables.siteName},${wikiVariables.dbName}`,
				appleItunesApp: ''
			};

		if (data.htmlTitle) {
			headData.htmlTitle = data.htmlTitle + htmlTitleSettings.separator + wikiHtmlTitle;
			headData.keywords += `,${data.htmlTitle}`;
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
