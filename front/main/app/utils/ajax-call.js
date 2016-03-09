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
			this.apiResponseData = data;
			options.success(data);
			resolve(this);
		};

		settings.error = function (err) {
			options.error(err);
			// ToDo reject the promise and use error substates (SOC-2093)
			resolve(this);
		};

		Ember.$.ajax(settings);
	});
}
