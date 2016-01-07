export default Ember.Service.extend({
	sortVisible: false,

	currentSortBy: Ember.computed('sortTypes.@each.active', function () {
		return this.get('sortTypes').findBy('active', true).name;
	}),

	sortMessageKey: Ember.computed('sortTypes.@each.active', function () {
		return this.get('sortTypes').findBy('active', true).messageKey;
	}),

	sortTypes: [
		{
			active: true,
			name: 'trending',
			messageKey: 'main.sort-by-trending'
		},
		{
			active: false,
			name: 'latest',
			messageKey: 'main.sort-by-latest'
		}
	],
});
