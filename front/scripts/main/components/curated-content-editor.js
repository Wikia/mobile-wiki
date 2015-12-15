import App from '../app';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import TrackClickMixin from '../mixins/track-click';
import CuratedContentEditorModel from '../models/curated-content-editor';

export default App.CuratedContentEditorComponent = Ember.Component.extend(
	AlertNotificationsMixin,
	TrackClickMixin,
	{
		classNames: ['curated-content-editor'],

		/**
		 * When user enters curated content editor we want to clear all notifications that might be still there
		 * after previous edit. For example:
		 * 1. user enters editor and taps publish - alert about successful page appears
		 * 2. user gets redirected to main page and taps edit main page link
		 * - alerts need to be reset because some of them might have not timed out
		 *
		 * @returns {void}
		 */
		didInsertElement() {
			this.clearNotifications();
		},

		actions: {
			/**
			 * @param {string} block
			 * @returns {void}
			 */
			addBlockItem(block) {
				this.sendAction('addBlockItem', block);
			},

			/**
			 * @returns {void}
			 */
			addSection() {
				this.sendAction('addSection');
			},

			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @param {string} block
			 * @returns {void}
			 */
			editBlockItem(item, block) {
				this.sendAction('editBlockItem', item, block);
			},

			/**
			 * @returns {void}
			 */
			openMainPage() {
				this.sendAction('openMainPage');
			},

			/**
			 * @param {CuratedContentEditorItemModel} section
			 * @returns {void}
			 */
			openSection(section) {
				this.sendAction('openSection', section);
			},

			/**
			 * @returns {void}
			 */
			save() {
				this.trackClick('curated-content-editor', 'save');
				this.validateAndSave();
			}
		},

		/**
		 * @returns {void}
		 */
		validateAndSave() {
			this.set('isLoading', true);

			CuratedContentEditorModel.save(this.get('model'))
				.then((data) => {
					if (data.status) {
						this.addAlert({
							message: i18n.t('app.curated-content-editor-changes-saved'),
							type: 'info'
						});

						this.sendAction('openMainPage', true);
					} else if (data.error) {
						this.addAlert({
							message: i18n.t('app.curated-content-editor-error-inside-items-message'),
							type: 'alert'
						});
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.catch((err) => {
					if (err.status === 403) {
						this.addAlert({
							message: i18n.t('app.curated-content-editor-error-no-save-permissions'),
							type: 'warning'
						});
					} else {
						Ember.Logger.error(err);
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.finally(() => {
					this.set('isLoading', false);
				});
		},
	}
);
