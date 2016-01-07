export default Ember.Service.extend({
	sortVisible: false,

	sortBy: Ember.computed('sortTypes.@each.active', function () {
		return this.get('sortTypes').findBy('active', true).name;
	}),

	sortMessageKey: Ember.computed('sortTypes.@each.active', function () {
		return this.get('sortTypes').findBy('active', true).messageKey;
	}),

	sortTypes: [
		Ember.Object.create({
			active: true,
			name: 'trending',
			messageKey: 'main.sort-by-trending'
		}),
		Ember.Object.create({
			active: false,
			name: 'latest',
			messageKey: 'main.sort-by-latest'
		})
	],

	/**
	 * @returns {void}
	 */
	showSortComponent() {
		this.set('sortVisible', true);
	},

	/**
	 * @returns {void}
	 */
	hideSortComponent() {
		this.set('sortVisible', false);
	},

	/**
	 * @returns {void}
	 */
	setSortBy(sortBy) {
		this.set('sortVisible', false);
		this.sortTypes.forEach(function(item) {
			item.set('active', item.get('name') === sortBy);
		});
	}
});
