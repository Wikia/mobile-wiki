export default Ember.Component.extend({
	navigationStructure: Mercury.wiki.explore,

	links: Ember.computed('navigationStructure', function () {
		return this.get('navigationStructure').children;
	})
});
