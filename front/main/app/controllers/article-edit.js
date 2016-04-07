import Ember from 'ember';
import ArticleEditModel from '../models/article-edit';
import {track, trackActions} from 'common/utils/track';
import {normalizeToUnderscore} from 'common/utils/string';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),

	isPublishing: false,

	publishDisabled: Ember.computed('isPublishing', 'model.isDirty', function () {
		return (this.get('isPublishing') === true || this.get('model.isDirty') === false);
	}),

	// FIXME: Cover more errors
	errorCodeMap: {
		autoblockedtext: 'app.edit-publish-error-autoblockedtext',
		blocked: 'app.edit-publish-error-blocked',
		noedit: 'app.edit-publish-error-noedit',
		'noedit-anon': 'app.edit-publish-error-noedit-anon',
		protectedpage: 'app.edit-publish-error-protectedpage'
	},

	/**
	 * @returns {void}
	 */
	handlePublishSuccess() {
		let title = this.get('model.title');

		if (title.indexOf(' ') > -1) {
			title = normalizeToUnderscore(title);
		}

		this.transitionToRoute('wiki-page', title).then(() => {
			this.get('application').addAlert({
				message: i18n.t('app.edit-success', {
					pageTitle: title
				}),
				type: 'success'
			});
			this.set('isPublishing', false);
		});

		track({
			action: trackActions.impression,
			category: 'sectioneditor',
			label: 'success'
		});
	},

	/**
	 * @param {*} error
	 * @returns {void}
	 */
	handlePublishError(error) {
		const appController = this.get('application'),
			errorMsg = this.errorCodeMap[error] || 'app.edit-publish-error';

		appController.addAlert({
			message: i18n.t(errorMsg),
			type: 'alert'
		});

		appController.set('isLoading', false);

		this.set('isPublishing', false);

		track({
			action: trackActions.impression,
			category: 'sectioneditor',
			label: error || 'edit-publish-error'
		});
	},

	actions: {
		/**
		 * @returns {void}
		 */
		publish() {
			this.set('isPublishing', true);
			this.get('application').set('isLoading', true);

			ArticleEditModel.publish(this.get('model')).then(
				this.handlePublishSuccess.bind(this),
				this.handlePublishError.bind(this)
			);

			track({
				action: trackActions.click,
				category: 'sectioneditor',
				label: 'publish'
			});
		},
		/**
		 * @returns {void}
		 */
		back() {
			this.transitionToRoute('wiki-page', this.get('model.title'));
			track({
				action: trackActions.click,
				category: 'sectioneditor',
				label: 'back',
				value: this.get('publishDisabled')
			});
		}
	}
});
