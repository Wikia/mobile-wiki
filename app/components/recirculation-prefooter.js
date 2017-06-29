import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import FandomPostsModel from '../models/fandom-posts';

const {Component, getOwner, on} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		didEnterViewport() {
			const fandomPosts = FandomPostsModel.create(getOwner(this).ownerInjection());

			fandomPosts.fetch('recent_popular').then((model) => {
				this.set('model', model);
			});
		},

		viewportOptionsOverride: on('willRender', function () {
			const viewportTolerance = 1000;

			this.set('viewportTolerance', {
				top: viewportTolerance,
				bottom: viewportTolerance
			});
		}),
	}
);
