import Ember from 'ember';

/**
 * Wrapper for AJAX calls
 *
 * @param {object} options
 *
 * @returns {Ember.RSVP.Promise}
 */
export default function (options) {
	const defaults = {
			contentType: 'application/json',
			dataType: 'json',
			method: 'GET',
			xhrFields: {
				withCredentials: true
			}
		},
		settings = Ember.$.extend({}, defaults, options);

	return new Ember.RSVP.Promise((resolve) => {
		settings.success = function (data) {
			if (typeof options.success === 'function') {
				options.success(data);
			}
			this.apiResponseData = data;
			resolve(this);
		};

		settings.error = function (err) {
			if (typeof options.error === 'function') {
				options.error(err);
			}

			/** Resolve instead of reject until we implement error substates
			 *  To handle errors we use custom method in discussionBase model
			 */
			resolve(this);
		};

		Ember.$.ajax(settings);
	});
}
