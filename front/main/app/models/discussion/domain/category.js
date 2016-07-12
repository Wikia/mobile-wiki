import Ember from 'ember';

const DiscussionCategory = Ember.Object.extend({
	description: null,
	displayOrder: null,
	id: null,
	name: null,
	selected: false,
});

DiscussionCategory.reopenClass({
	/**
	 * Creates a permissions dict from API's permissions array
	 *
	 * @param {object} categoryData
	 *
	 * @returns {Ember.Object}
	 */
	create(categoryData) {
		const category = {
			description: categoryData.description,
			displayOrder: categoryData.displayOrder,
			id: categoryData.id,
			name: categoryData.name,
			selected: false,
		};

		return this._super(category);
	}
});

export default DiscussionCategory;
