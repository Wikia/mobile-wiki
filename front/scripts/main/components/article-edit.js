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
			Ember.$('textarea').css('height', Ember.$(window).height() - Ember.$('.sub-head').outerHeight());
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
