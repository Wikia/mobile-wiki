import Ember from 'ember';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import {trackPageView} from 'common/utils/track';
import HeadTagsDynamicMixin from '../../mixins/head-tags-dynamic';
import {track, trackActions} from '../../utils/discussion-tracker';

export default Ember.Route.extend(
	DiscussionLayoutMixin,
	HeadTagsDynamicMixin,
	{
		postDeleteFullScreenOverlay: false,

		/**
		 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
		 * @param {Object} model, this is model object from route::afterModel() hook
		 * @param {Object} [data={}]
		 * @returns {void}
		 */
		setDynamicHeadTags(model, data = {}) {
			const shouldSetDefaultCanonical = data.canonical === undefined;

			data.htmlTitle = 'Discussions';

			if (shouldSetDefaultCanonical) {
				data.canonical = `${Ember.get(Mercury, 'wiki.basePath')}${window.location.pathname}`;
			}

			this._super(model, data);
		},

		trackDiscussionsPageView(params = {}) {
			track(trackActions.PageView, params);
		},

		actions: {
			/**
			 * Transition to Guidelines
			 * @returns {void}
			 */
			gotoGuidelines() {
				this.transitionTo('discussion.guidelines');
			},

			/**
			 * @returns {void}
			 */
			retry() {
				this.refresh();
			},

			/**
			 * @returns {boolean}
			 */
			didTransition() {
				this.controllerFor('application').set('noMargins', true);

				// Standard Mercury pageview tracking
				trackPageView();

				// Separate pageview tracking for Discussions
				this.trackDiscussionsPageView();

				return true;
			},

			/*
			 * When leaving discussion app, remove noMargins flag, so the other (mobile-only)
			 * apps have default margins set and a container added
			 * @param {Ember.Transition} transition
			 * @returns {boolean}
			 */
			willTransition(transition) {
				const isDiscussionRoute = transition.handlerInfos.some((item) => {
					return item.name === 'discussion';
				});

				if (!isDiscussionRoute) {
					// deactivate dark theme after transition outside discussions to avoid
					// a flash of unstyled content
					transition.promise.then(() => {
						this.deactivateTheming();
						this.controllerFor('application').set('noMargins', false);
					});
				}

				return true;
			},

			/**
			 * Handler for a rejected model (or a throw from within model)
			 *
			 * @param {Ember.Object} routeError
			 * @param {Ember.Transition} transition
			 *
			 * @returns {boolean}
			 */
			error(routeError, transition) {
				this.controllerFor('application').set('noMargins', true);

				/* If routeError is a model loading error, let it through to the
					error subroute handlers. If not, rethrow it
				 */
				if (Ember.typeOf(routeError) === 'instance' && routeError.error) {
					routeError.set('error.transition', transition);
				} else {
					throw routeError;
				}

				return true;
			}
		}
	}
);
