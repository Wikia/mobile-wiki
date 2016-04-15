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

	return new Ember.RSVP.Promise((resolve, reject) => {
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

			reject(this);
		};

		Ember.$.ajax(settings);
	});
}
