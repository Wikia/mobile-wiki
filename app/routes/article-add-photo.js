import Ember from 'ember';
import FullPageMixin from '../mixins/full-page';
import {track, trackActions} from '../utils/track';

export default Ember.Route.extend(FullPageMixin, {
	i18n: Ember.inject.service(),
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
				message: this.get('i18n').t('app.addphoto-load-error'),
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
