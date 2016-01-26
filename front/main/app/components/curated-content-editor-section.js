import Ember from 'ember';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import CuratedContentEditorSortableItemsMixin from '../mixins/curated-content-editor-sortable-items';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import CuratedContentEditorLabelsMixin from '../mixins/curated-content-editor-labels';
import TrackClickMixin from '../mixins/track-click';
import CuratedContentEditorItemModel from '../models/curated-content-editor-item';

export default Ember.Component.extend(
	AlertNotificationsMixin,
	CuratedContentEditorSortableItemsMixin,
	CuratedContentThumbnailMixin,
	CuratedContentEditorLabelsMixin,
	TrackClickMixin,
	{
		imageWidth: 300,
		thumbUrl: Ember.computed('model', function () {
			return this.generateThumbUrl(this.get('model.image_url'));
		}),
		notEmptyItems: Ember.computed.notEmpty('model.items'),

		actions: {
			/**
			 * @returns {void}
			 */
			addItem() {
				this.trackClick('curated-content-editor', 'section-item-add');
				this.sendAction('addItem');
			},

			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @returns {void}
			 */
			editItem(item) {
				this.trackClick('curated-content-editor', 'section-item-edit');
				this.sendAction('editItem', item);
			},

			/**
			 * @returns {void}
			 */
			editSection() {
				this.trackClick('curated-content-editor', 'section-edit');
				this.sendAction('editSection', this.get('model'));
			},

			/**
			 * @returns {void}
			 */
			goBack() {
				this.trackClick('curated-content-editor', 'section-go-back');
				this.sendAction('goBack');
			},

			/**
			 * @returns {void}
			 */
			done() {
				this.trackClick('curated-content-editor', 'section-done');

				if (this.get('notEmptyItems')) {
					this.validateAndDone();
				} else {
					this.addAlert({
						message: i18n.t('app.curated-content-editor-empty-section-error'),
						type: 'alert'
					});
				}
			}
		},

		/**
		 * @returns {void}
		 */
		validateAndDone() {
			this.set('isLoading', true);

			CuratedContentEditorItemModel.validateServerData(
				this.get('model'), 'validateCuratedContentSectionWithItems'
			).then((data) => {
				let sortableItems;

				if (data.status) {
					sortableItems = this.get('sortableItems');
					// It's done this way because sortableItems property contains not only items but also meta properties
					// which we don't want to pass to model.
					// Slice creates native JS array with only items (without meta properties).
					this.set('model.items', sortableItems.slice(0, sortableItems.length));
					this.sendAction('done', this.get('model'));
				} else if (Ember.isArray(data.errors)) {
					data.errors.forEach((error) => this.processValidationError(error));
				} else {
					this.addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				}
			})
			.catch((err) => {
				Ember.Logger.error(err);
				this.addAlert({
					message: i18n.t('app.curated-content-error-other'),
					type: 'alert'
				});
			})
			.finally(() => {
				this.set('isLoading', false);
			});
		},

		/**
		 * @param {string} errorMessage
		 * @returns {void}
		 */
		processValidationError(errorMessage) {
			if (errorMessage === 'itemsMissing') {
				this.addAlert({
					message: i18n.t('app.curated-content-editor-empty-section-error'),
					type: 'alert'
				});
			} else {
				// if other items occur that means user somehow bypassed validation of one or more items earlier
				this.addAlert({
					message: i18n.t('app.curated-content-editor-general-section-error'),
					type: 'alert'
				});
			}
		}
	}
);
