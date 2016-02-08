import Ember from 'ember';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import CuratedContentEditorLabelsMixin from '../mixins/curated-content-editor-labels';

export default Ember.Component.extend(
	CuratedContentThumbnailMixin,
	CuratedContentEditorLabelsMixin,
	{
		classNames: ['curated-content-editor-row'],
		classNameBindings: ['fixedHeight'],
		fixedHeight: true,
		imageWidth: 48,

		thumbUrl: Ember.computed('model', function () {
			return this.generateThumbUrl(this.get('model.image_url'));
		}),

		title: Ember.computed('model', function () {
			return this.get('model.label') || i18n.t('app.curated-content-editor-enter-wikia-description');
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			edit() {
				const model = this.get('model');

				if (model.node_type === 'section') {
					this.sendAction('openSection', model);
				} else {
					this.sendAction('editItem', model);
				}
			},

			/**
			 * @param {number} offset
			 * @returns {void}
			 */
			moveBy(offset) {
				this.sendAction('moveBy', offset, this.get('model'));
			}
		}
	}
);
