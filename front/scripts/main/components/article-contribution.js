import Ember from 'ember';

const ArticleContributionComponent = Ember.Component.extend(LanguagesMixin, {
	classNames: ['contribution-container'],
	classNameBindings: ['uploadFeatureEnabled::no-photo'],
	layoutName: 'components/article-contribution',
	section: null,
	sectionId: null,
	title: null,
	uploadFeatureEnabled: null,

	actions: {
		/**
		 * @returns {void}
		 */
		edit() {
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: this.get('section')
			});
			this.sendAction('edit', this.get('title'), this.get('section'));
		},

		/**
		 * @returns {void}
		 */
		select() {
			let href = `/join?redirect=${encodeURIComponent(window.location.href)}`;

			if (this.get('sectionId')) {
				href += encodeURIComponent(`#${this.sectionId}`);
			}

			href += this.getUselangParam();

			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'add-photo-no-auth',
				value: this.get('section')
			});

			this.openLocation(href);
		},

		/**
		 * @returns {void}
		 */
		addPhoto() {
			const photoData = this.$('.file-upload-input')[0].files[0];

			if (this.get('currentUser.isAuthenticated') !== true) {
				return;
			}

			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'add-photo',
				value: this.get('section')
			});

			this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
		},
	},

	/**
	 * @param {string} href
	 * @returns {void}
	 */
	openLocation(href) {
		window.location.href = href;
	},
});

export default ArticleContributionComponent;
