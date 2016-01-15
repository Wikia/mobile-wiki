export default Ember.Component.extend({

	hubsLinks: Ember.get(Mercury, 'wiki.navigation.hubsLinks'),
	exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation.explore.textEscaped'),
	wikiName: Ember.get(Mercury, 'wiki.siteName')
});
