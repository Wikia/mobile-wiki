export default Ember.Component.extend({
	navigationStructure: Ember.get(Mercury, 'wiki.navigation.explore'),

	links: Ember.computed('navigationStructure', function () {
		return this.get('navigationStructure').children;
	})
});
