import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import {track, trackActions} from '../utils/track';
import scrollToTop from '../utils/scroll-to-top';

export default Component.extend(
	AlertNotificationsMixin,
	{
		i18n: service(),
		logger: service(),
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
						run.scheduleOnce('afterRender', this, () => {
							scrollToTop(this.element);
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
			 * @param {Event} event
			 */
			trackClick(category, label, event) {
				if (event.target.matches('a')) {
					track({
						action: trackActions.click,
						category,
						label
					});
				}
			}
		}
	}
);
