/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />
/// <reference path="../mixins/LanguagesMixin.ts" />

App.ArticleContributionComponent = Em.Component.extend(App.LanguagesMixin, {
	classNames: ['contribution-container'],
	classNameBindings: ['uploadFeatureEnabled::no-photo'],
	layoutName: 'components/article-contribution',
	section: null,
	sectionId: null,
	title: null,
	uploadFeatureEnabled: null,

	actions: {
		edit(): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.get('section')
			});
			this.sendAction('edit', this.get('title'), this.get('section'));
		},

		select(): void {
			var href: string;
			href = '/join?redirect=' + encodeURIComponent(window.location.href);
			if (this.sectionId) {
				href += '#' + this.sectionId;
			}
			href += this.getUselangParam();

			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'add-photo-no-auth',
				value: this.get('section')
			});

			window.location.href = href;
		},

		addPhoto(): void {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'add-photo',
				value: this.get('section')
			});
			var photoData = this.$('.file-upload-input')[0].files[0];
			this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
		}
	}
});
