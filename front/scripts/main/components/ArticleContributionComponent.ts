/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />
/// <reference path="../mixins/LanguagesMixin.ts" />

App.ArticleContributionComponent = Em.Component.extend(App.LanguagesMixin, {
	classNames: ['contribution-container'],
	classNameBindings: ['addPhotoIconVisible::no-photo'],
	layoutName: 'components/article-contribution',
	section: null,
	sectionId: null,
	title: null,
	uploadFeatureEnabled: null,

	actions: {
		/**
		 * Activate section editor
		 * If login is required to edit, redirect to login page
		 *
		 * @returns {void}
		 */
		edit(): void {
			if (this.get('editAllowed')) {
				M.track({
					action: M.trackActions.click,
					category: 'sectioneditor',
					label: 'edit',
					value: this.get('section')
				});
				this.sendAction('edit', this.get('title'), this.get('section'));
			} else {
				this.redirectToLogin('edit-section-no-auth');
			}
		},

		/**
		 * Go to add photo
		 * If login is required to add photo, redirect to login page
		 *
		 * @returns {void}
		 */
		addPhoto(): void {
			if (this.get('addPhotoAllowed')) {
				M.track({
					action: M.trackActions.click,
					category: 'sectioneditor',
					label: 'add-photo',
					value: this.get('section')
				});
				var photoData = this.$('.file-upload-input')[0].files[0];
				this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
			} else {
				this.redirectToLogin('add-photo-no-auth');
			}
		},
	},

	openLocation(href: string) {
		window.location.href = href;
	},

	/**
	 * Redirect the user to login page
	 * @param trackingLabel {string} Label to use for tracking of event
	 */
	redirectToLogin(trackingLabel: string) {
		var href = `/join?redirect=${encodeURIComponent(window.location.href)}`,
			sectionId = this.get('sectionId');

		if (sectionId) {
			href += encodeURIComponent('#' + this.sectionId);
		}
		href += this.getUselangParam();

		M.track({
			action: M.trackActions.click,
			category: 'sectioneditor',
			label: trackingLabel,
			value: this.get('section')
		});

		this.openLocation(href);
	},
});
