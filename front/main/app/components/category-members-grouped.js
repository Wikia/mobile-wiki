import Ember from 'ember';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import {track, trackActions} from 'common/utils/track';

const {Component, $, run} = Ember;

export default Component.extend(
	AlertNotificationsMixin,
	{
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
					.catch(() => {
						this.addAlert({
							message: i18n.t('app.category-page-load-error'),
							type: 'alert'
						});
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
