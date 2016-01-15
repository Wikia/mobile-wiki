export default Ember.Component.extend({

	hubsLinks: Ember.get(Mercury, 'wiki.navigation.hubsLinks'),
	exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation.exploreWikia.textEscaped'),
	wikiName: Ember.get(Mercury, 'wiki.siteName')
});
