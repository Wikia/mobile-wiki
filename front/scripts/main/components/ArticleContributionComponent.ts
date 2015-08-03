/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />

App.ArticleContributionComponent = Em.Component.extend({
	tagName: 'div',
	classNames: ['contribution-container'],
	templateName: 'components/article-contribution',

    article: null,
    section: null,
    title: null,

	articleContent: Em.computed('article', function (): any {
		return this.get('article');
	}),

	articleContentObserver: Em.observer('articleContent', function (): void {
		// this.rerender();
		Em.run.scheduleOnce('afterRender', this, (): void => {
			this.setupContributionButtons();
		});
	}).on('init'),

	setupContributionButtons: function (): void {
		var $photoIcon = this.$('.upload-photo'),
		    $editIcon = this.$('.edit-section');

		if (this.section === 0) { //need different html for different styling for section 0
			$photoIcon.addClass('zero');
			$editIcon.addClass('zero');
		}
	},

	actions: {
		edit: function (title: string): void {
			//App.VisibilityStateManager.reset(); check if I do not need it anymore
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.section
			});
			this.sendAction('edit', this.title, this.section);
		},

		select: function (): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'addPhoto',
				value: this.section
			});
			this.$('.file-input').click();
		},

		upload: function(): void {
			var photoData = this.$('.file-input')[0].files[0];
			this.sendAction('upload', this.title, this.section, photoData);
		}
	}
});
