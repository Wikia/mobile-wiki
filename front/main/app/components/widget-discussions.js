import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import WidgetDiscussionsModel from '../models/widget-discussion';

export default Ember.Component.extend(
	InViewportMixin,
	{
		classNames: ['widget-discussions'],

		isLoading: true,

		model: null,

		didInsertElement() {
			this._super(...arguments);
			this.set('model', WidgetDiscussionsModel.create());
		},

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			const categoryIds = this.getWithDefault('categoryIds', []);

			this.get('model').find(
				Mercury.wiki.id,
				categoryIds,
				this.get('show'),
				this.get('itemCount')
			).then((posts) => {
				this.setProperties({
					posts: posts,
					isLoading: false,
				});
			});
		},

		actions: {
			upvote(post) {
				this.get('model').upvote(post);
			},
		}
	}
);
