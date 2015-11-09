App.MainPageController = Em.Controller.extend({
	application: Em.inject.controller(),

	noAds: Em.computed.alias('application.noAds'),

	/**
	 * @returns {void}
	 */
	init() {
		this.setProperties({
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	}
});
