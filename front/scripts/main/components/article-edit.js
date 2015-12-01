import App from '../app';
import ViewportMixin from '../mixins/viewport';

export default App.ArticleEditComponent = Ember.Component.extend(
	ViewportMixin,
	{
		classNames: ['article-edit'],

		viewportHeightObserver: Ember.observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: Ember.on('didInsertElement', () => {
			this.$('textarea').css('height', this.$(window).height() - this.$('.sub-head').outerHeight());
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
