/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />

App.ArticleContributionComponent = Em.Component.extend({
	classNames: ['contribution-container'],
	classNameBindings: ['uploadFeatureEnabled::no-photo'],
	layoutName: 'components/article-contribution',
	section: null,
	title: null,
	uploadFeatureEnabled: null,

	actions: {
		/**
		 * @returns {undefined}
		 */
		edit(): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.get('section')
			});
			this.sendAction('edit', this.get('title'), this.get('section'));
		},

		/**
		 * @returns {undefined}
		 */
		select(): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'addPhoto',
				value: this.get('section')
			});
		},

		/**
		 * @returns {undefined}
		 */
		addPhoto(): void {
			var photoData = this.$('.file-upload-input')[0].files[0];
			this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
		},
	},
});
