import Ember from 'ember';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import {track, trackActions} from '../utils/track';

const {
	Component,
	$,
	run,
	inject
} = Ember;

export default Component.extend(
	AlertNotificationsMixin,
	{
		i18n: inject.service(),
		logger: inject.service(),
		classNames: ['category-members-grouped'],
		classNameBindings: ['isLoading'],
		isLoading: false,

		actions: {
			/**
			 * @param {number} page
			 * @param {string} label
			 */
			loadPage(page, label) {
				this.set('isLoading', true);

				track({
					action: trackActions.click,
					category: 'category-page',
					label: `load-${label}`
				});

				this.get('loadPage')(page)
					.then(() => {
						const navHeight = $('.site-head').outerHeight() + $('.site-head-fandom-bar').outerHeight(),
							scrollTop = this.$().offset().top - navHeight;

						run.scheduleOnce('afterRender', this, () => {
							$('html, body').animate({scrollTop});
						});
					})
					.catch((error) => {
						this.addAlert({
							message: this.get('i18n').t('category-page.load-error'),
							type: 'alert'
						});

						this.get('logger').error(error);
					})
					.finally(() => {
						this.set('isLoading', false);
					});
			},

			/**
			 * @param {string} category
			 * @param {string} label
			 */
			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		}
	}
);
