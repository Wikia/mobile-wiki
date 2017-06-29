import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import FandomPostsModel from '../models/fandom-posts';
import {track, trackActions} from '../utils/track';

const {Component, getOwner, on, run} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['recirculation-prefooter'],
		isVisible: false,

		didEnterViewport() {
			const fandomPosts = FandomPostsModel.create(getOwner(this).ownerInjection());

			fandomPosts.fetch('recent_popular', 10).then((model) => {
				this.setProperties({
					isVisible: true,
					model
				});
			});

			track({
				action: trackActions.impression,
				category: 'recirculation',
				label: 'footer'
			});
		},

		viewportOptionsOverride: on('willRender', function () {
			const viewportTolerance = 1000;

			this.set('viewportTolerance', {
				top: viewportTolerance,
				bottom: viewportTolerance
			});
		}),

		actions: {
			postClick(post, index) {
				const labelParts = ['footer', `slot-${index + 1}`, post.source, post.isVideo ? 'video' : 'not-video'];

				track({
					action: trackActions.click,
					category: 'recirculation',
					label: labelParts.join('=')
				});

				run.later(() => {
					window.location.assign(post.url);
				}, 200);
			}
		}
	}
);
