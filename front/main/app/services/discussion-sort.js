export default Ember.Service.extend({
	onlyReported: false,
	sortVisible: false,

	defaultSort: 'latest',

	sortBy: Ember.computed('sortTypes.@each.active', function () {
		return this.get('sortTypes').findBy('active', true).name;
	}),

	sortMessageKey: Ember.computed('sortTypes.@each.active', function () {
		return this.get('sortTypes').findBy('active', true).messageKey;
	}),

	sortTypes: [
		Ember.Object.create({
			active: false,
			name: 'latest',
			messageKey: 'main.sort-by-latest'
		}),
		Ember.Object.create({
			active: true,
			name: 'trending',
			messageKey: 'main.sort-by-trending'
		})
	],

	/**
	 * @param {string} sortBy
	 * @returns {void}
	 */
	setSortBy(sortBy) {
		this.sortTypes.forEach((item) => {
			item.set('active', item.get('name') === sortBy);
		});
	},

	/**
	 * @param {boolean} onlyReported
	 * @returns {void}
	 */
	setOnlyReported(onlyReported) {
		if (onlyReported !== this.get('onlyReported')) {
			this.set('onlyReported', onlyReported);
		}
	}
});
