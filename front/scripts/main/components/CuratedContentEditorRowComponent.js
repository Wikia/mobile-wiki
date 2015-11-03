App.CuratedContentEditorRowComponent = Em.Component.extend(
	App.CuratedContentThumbnailMixin,
	App.CuratedContentEditorLabelsMixin,
	{
		classNames: ['curated-content-editor-row'],
		imageWidth: 48,

		thumbUrl: Em.computed('model', function() {
			return this.generateThumbUrl(this.get('model.image_url'));
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
