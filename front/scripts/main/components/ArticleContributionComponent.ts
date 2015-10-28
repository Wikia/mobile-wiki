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
		/**
		 * Called when login is required in order to edit section
		 * @returns {void}
		 */
		loginToEdit() : void {
			this.redirectToLogin('edit-section-no-auth');
		},

		/**
		 * Go to section editor
		 * @returns {void}
		 */
		edit(): void {
			if (this.get('isEditAllowed') !== true) {
				return;
			}

			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.get('section')
			});
			this.sendAction('edit', this.get('title'), this.get('section'));
		},

		/**
		 * Called when login is required in order to edit photo
		 * @returns {void}
		 */
		loginToUploadPhoto(): void {
			this.redirectToLogin('add-photo-no-auth');
		},

		/**
		 * Go to photo upload
		 * @returns {void}
		 */
		addPhoto(): void {
			if (this.get('currentUser.isAuthenticated') !== true) {
				return;
			}

			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'add-photo',
				value: this.get('section')
			});
			var photoData = this.$('.file-upload-input')[0].files[0];
			this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
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
		var href = '/join?redirect=' + encodeURIComponent(window.location.href);
		if (this.get('sectionId')) {
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
