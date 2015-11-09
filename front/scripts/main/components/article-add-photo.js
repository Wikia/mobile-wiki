import Ember from 'ember';

const ArticleAddPhotoComponent = Ember.Component.extend({
	actions: {
		/**
		 * @returns {void}
		 */
		back() {
			this.sendAction('back');
			this.track('back');
		},

		/**
		 * @returns {void}
		 */
		upload() {
			this.sendAction('upload');
			this.track('upload');
		},
	},

	/**
	 * @param {string} label
	 * @returns {void}
	 */
	track(label) {
		M.track({
			action: M.trackActions.click,
			category: 'sectionaddphoto',
			label
		});
	},
});

export default ArticleAddPhotoComponent;
