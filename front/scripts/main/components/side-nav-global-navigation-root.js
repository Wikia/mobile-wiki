export default Ember.Component.extend({

	hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
	exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
	wikiName: Ember.get(Mercury, 'wiki.siteName')
});
