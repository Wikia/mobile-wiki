/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />

App.ArticleContributionComponent = Em.Component.extend({
	classNames: ['contribution-container'],
	classNameBindings: ['enableUpload::no-photo'],
	templateName: 'components/article-contribution',
	section: null,
	title: null,
	uploadFeatureEnabled: null, //function
	enableUpload: Em.computed('uploadFeatureEnabled', function() {
		return this.get('uploadFeatureEnabled')();
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
		},

		addPhoto: function (): void {
			var photoData = this.$('.file-upload-input')[0].files[0];
			this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
		}
	}
});
