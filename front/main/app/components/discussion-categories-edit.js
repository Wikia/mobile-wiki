import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import DiscussionCategory from '../models/discussion/domain/category';

export default Ember.Component.extend(
	{
		classNames: ['highlight-overlay-content', 'discussion-categories-edit'],
		maxCategoriesCount: 10,
		isLoading: false,
		wikiId: Ember.get(Mercury, 'wiki.id').toString(),

		addDisabled: Ember.computed('localCategories.length', function () {
			return this.get('localCategories.length') >= this.get('maxCategoriesCount');
		}),

		localCategories: Ember.computed('categories.@each', function () {
			const categories = this.get('categories'),
				localCategories = new Ember.A();

			categories.forEach((category) => {
				localCategories.pushObject(Ember.Object.create(category));
			});

			return localCategories;
		}),

		actions: {
			/**
			 * Add new category
			 *
			 * @returns {void}
			 */
			addCategory() {
				if (!this.get('addDisabled')) {
					this.get('localCategories').pushObject(Ember.Object.create({
						category: DiscussionCategory.create({})
					}));
				}
			},

			/**
			 * Submit category changes and send them to model
			 *
			 * @returns {void}
			 */
			submit() {
				this.set('isLoading', true);
				this.get('updateCategories')(this.get('localCategories'))
					.then(() => {
						this.sendAction('setEditMode', false);
					})
					.finally(() => {
						this.set('isLoading', false);
					});
			}
		}
	}
);
