import Ember from 'ember';
import TextHighlightMixin from '../mixins/text-highlight';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	TextHighlightMixin,
	ViewportMixin,
	{
		classNames: ['article-edit'],

		viewportHeightObserver: Ember.observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: Ember.on('didInsertElement', () => {
			Ember.$('textarea').css('height', Ember.$(window).height() - Ember.$('.sub-head').outerHeight());
		}),

		didInsertElement() {
			const content = this.get('model.content'),
				highlightedText = this.get('highlighted');

			if (highlightedText) {

				let highlightedData = this.getHighlightedTextData(content, highlightedText);

				if (highlightedData) {
					const textarea = document.getElementsByClassName('edit-textarea')[0];

					this.highlightTextInTextarea(textarea, content, highlightedData);
				}
			}
		},

		actions: {
			/**
			 * @returns {void}
			 */
			back() {
				this.sendAction('back');
			},

			/**
			 * @returns {void}
			 */
			publish() {
				this.sendAction('publish');
			},
		},
	}
);
