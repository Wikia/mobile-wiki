/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />

App.ArticleContributionComponent = Em.Component.extend({
	classNames: ['contribution-container'],
	templateName: 'components/article-contribution',
	section: null,
	title: null,
	fileInputId: Em.computed('section', function(): string {
		return 'fileUpload'.concat('-', this.get('section'));
	}),

	actions: {
		edit: function (): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.get('section')
			});
			this.sendAction('edit', this.get('title'), this.get('section'));
		},

		select: function (): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'addPhoto',
				value: this.get('section')
			});
			this.$('.file-upload-input').click();
		},

		addPhoto: function (): void {
			var photoData = this.$('.file-upload-input')[0].files[0];
			this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
		}
	}
});
