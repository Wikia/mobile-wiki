
import ViewportMixin from '../mixins/viewport';

const ArticleEditComponent = Ember.Component.extend(
	ViewportMixin,
	{
		classNames: ['article-edit'],

		viewportHeightObserver: Ember.observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: Ember.on('didInsertElement', () => {
			Ember.$('textarea').css('height', Ember.$(window).height() - Ember.$('.edit-head').outerHeight());
		}),

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

export default ArticleEditComponent;
