import Ember from 'ember';

export default Ember.Mixin.create({
	headData: Ember.inject.service(),
	wikiVariables: Ember.inject.service(),

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
		const htmlTitleSettings = this.get('wikiVariables.htmlTitle'),
			wikiHtmlTitle = htmlTitleSettings.parts.join(htmlTitleSettings.separator),
			headData = {
				htmlTitle: wikiHtmlTitle,
				description: data.description,
				canonical: data.canonical,
				next: data.next,
				prev: data.prev,
				appId: this.get('wikiVariables.smartBanner.appId.ios'),
				robots: this.get('wikiVariables.specialRobotPolicy') || data.robots || 'index,follow',
				keywords: `${this.get('wikiVariables.siteMessage')}` +
				`,${this.get('wikiVariables.siteName')}` +
				`,${this.get('wikiVariables.dbName')}`,
				appleItunesApp: '',
				amphtml: data.amphtml
			};

		if (data.htmlTitle) {
			headData.htmlTitle = data.htmlTitle + htmlTitleSettings.separator + wikiHtmlTitle;
			headData.keywords += `,${data.htmlTitle}`;
		}

		if (model.title) {
			headData.title = model.title;
		}

		if (model.type) {
			headData.type = model.type;
		}

		if (model.details && model.details.thumbnail) {
			headData.pageImage = model.details.thumbnail;
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
