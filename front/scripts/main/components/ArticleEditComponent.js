App.ArticleEditComponent = Em.Component.extend(
	App.ViewportMixin,
	{
		classNames: ['article-edit'],

		viewportHeightObserver: Em.observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: Em.on('didInsertElement', () => {
			Em.$('textarea').css('height', Em.$(window).height() - Em.$('.edit-head').outerHeight());
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
