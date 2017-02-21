import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import WidgetDiscussionsModel from '../models/widget-discussions';

const {Component} = Ember;

export default Component.extend(
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
			this.get('model').find(
				Mercury.wiki.id,
				this.getWithDefault('categoryIds', []),
				this.get('show'),
				this.get('itemCount')
			).then((posts) => {
				this.setProperties({
					posts,
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
