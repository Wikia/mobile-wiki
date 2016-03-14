import Ember from 'ember';
import CuratedContentModel from '../models/curated-content';

export default Ember.Component.extend({
	classNames: ['curated-content', 'mw-content'],

	actions: {
		/**
		 * @returns {void}
		 */
		loadMore() {
			this.set('isLoading', true);

			CuratedContentModel.loadMore(this.get('model'))
				.catch((reason) => {
					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-load-more-items'),
						type: 'error'
					});
					Ember.Logger.error(reason);
				})
				.finally(() => {
					this.set('isLoading', false);
				});
		},

		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openCuratedContentItem(item) {
			this.sendAction('openCuratedContentItem', item);
		}
	}
});
