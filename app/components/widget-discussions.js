import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import WidgetDiscussionsModel from '../models/widget-discussions';

const {Component, inject} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['widget-discussions'],
		layoutName: 'components/widget-discussions',
		isLoading: true,
		model: null,

		init() {
			this._super(...arguments);

			this.set('model', WidgetDiscussionsModel.create(getOwner(this).ownerInjection()));
		},

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			this.get('model').find(
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
