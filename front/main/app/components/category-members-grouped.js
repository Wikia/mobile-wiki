import Ember from 'ember';
import AlertNotificationsMixin from '../mixins/alert-notifications';

const {Component, $, run} = Ember;

export default Component.extend(
	AlertNotificationsMixin,
	{
		classNames: ['category-members-grouped'],
		classNameBindings: ['isLoading'],
		isLoading: false,

		actions: {
			/**
			 * @param {number} direction 1 is next, -1 is previous
			 */
			loadPage(direction) {
				this.set('isLoading', true);

				this.get('loadPage')(direction)
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
			}
		}
	}
);
