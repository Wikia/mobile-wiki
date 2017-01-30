import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	classNames: ['category-members-grouped'],
	classNameBindings: ['isLoading'],
	isLoading: false,

	actions: {
		/**
		 * @param {number} direction 1 is next, -1 is previous
		 */
		loadPage(direction) {
			this.set('isLoading', true);

			this.get('loadPage')(direction)
				.catch(() => {
					// TODO handle the error nicely
				})
				.finally(() => {
					this.set('isLoading', false);
				});
		}
	}
});
