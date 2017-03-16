import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import WidgetDiscussionsModel from '../models/widget-discussions';

const {Component, inject} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		wikiVariables: inject.service(),

		classNames: ['widget-discussions'],
		layoutName: 'components/widget-discussions',
		isLoading: true,
		model: null,

		init() {
			this._super(...arguments);

			this.set('model', WidgetDiscussionsModel.create());
		},

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			this.get('model').find(
				this.get('wikiVariables.id'),
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
