import Component from '@ember/component';
import {getOwner} from '@ember/application';
import InViewportMixin from 'ember-in-viewport';
import WidgetDiscussionsModel from '../models/widget-discussions';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(InViewportMixin, RenderComponentMixin, {
	classNames: ['widget-discussions'],
	layoutName: 'components/widget-discussions',
	isLoading: true,
	model: null,

	init() {
		this._super(...arguments);

		this.set('model', WidgetDiscussionsModel.create(getOwner(this).ownerInjection()));
	},

	actions: {
		upvote(post) {
			this.get('model').upvote(post);
		},
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
	}
});
