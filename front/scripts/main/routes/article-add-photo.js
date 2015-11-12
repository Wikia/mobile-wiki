import Ember from 'ember';
import FullPageMixin from '../mixins/full-page';
import {track, trackActions} from '../../mercury/utils/track.js';

const ArticleAddPhotoRoute = Ember.Route.extend(FullPageMixin, {
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('article-add-photo', {
			controller: 'articleAddPhoto'
		});
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		error() {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.addphoto-load-error'),
				type: 'alert'
			});

			track({
				action: trackActions.impression,
				category: 'sectionaddphoto',
				label: 'addphoto-load-error'
			});

			return true;
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			window.scrollTo(0, 0);

			track({
				action: trackActions.impression,
				category: 'sectionaddphoto',
				label: 'addphoto-loaded'
			});

			return true;
		}
	}
});

export default ArticleAddPhotoRoute;
