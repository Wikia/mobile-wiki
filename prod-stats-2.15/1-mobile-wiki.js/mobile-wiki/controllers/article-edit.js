define('mobile-wiki/controllers/article-edit', ['exports', 'mobile-wiki/utils/track', 'mobile-wiki/utils/string'], function (exports, _track, _string) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller,
	    inject = Ember.inject,
	    computed = Ember.computed;
	exports.default = Controller.extend({
		application: inject.controller(),
		i18n: inject.service(),
		wikiVariables: inject.service(),

		isPublishing: false,

		publishDisabled: computed('isPublishing', 'model.isDirty', function () {
			return this.get('isPublishing') === true || this.get('model.isDirty') === false;
		}),

		// FIXME: Cover more errors
		errorCodeMap: {
			autoblockedtext: 'edit.publish-error-autoblockedtext',
			blocked: 'edit.publish-error-blocked',
			noedit: 'edit.publish-error-noedit',
			'noedit-anon': 'edit.publish-error-noedit-anon',
			protectedpage: 'edit.publish-error-protectedpage'
		},

		/**
   * @returns {void}
   */
		handlePublishSuccess: function handlePublishSuccess() {
			var _this = this;

			var title = this.get('model.title');

			if (title.indexOf(' ') > -1) {
				title = (0, _string.normalizeToUnderscore)(title);
			}

			this.transitionToRoute('wiki-page', title).then(function () {
				_this.get('application').addAlert({
					message: _this.get('i18n').t('edit.success', {
						pageTitle: title
					}),
					type: 'success'
				});
				_this.set('isPublishing', false);
			});

			(0, _track.track)({
				action: _track.trackActions.impression,
				category: 'sectioneditor',
				label: 'success'
			});
		},


		/**
   * @param {*} error
   * @returns {void}
   */
		handlePublishError: function handlePublishError(error) {
			var appController = this.get('application'),
			    errorMsg = this.errorCodeMap[error] || 'edit.publish-error';

			appController.addAlert({
				message: this.get('i18n').t(errorMsg),
				type: 'alert'
			});

			appController.set('isLoading', false);

			this.set('isPublishing', false);

			(0, _track.track)({
				action: _track.trackActions.impression,
				category: 'sectioneditor',
				label: error || 'edit-publish-error'
			});
		},


		actions: {
			/**
    * @returns {void}
    */
			publish: function publish() {
				this.set('isPublishing', true);
				this.get('application').set('isLoading', true);

				this.get('model').publish().then(this.handlePublishSuccess.bind(this), this.handlePublishError.bind(this));

				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'sectioneditor',
					label: 'publish'
				});
			},

			/**
    * @returns {void}
    */
			back: function back() {
				this.transitionToRoute('wiki-page', this.get('model.title'));
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'sectioneditor',
					label: 'back',
					value: this.get('publishDisabled')
				});
			}
		}
	});
});