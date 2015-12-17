/** This is a wrapper for ajax calls
 * @param {object} options
 * @returns {Ember.RSVP.Promise}
 */
export default function (options) {
	const defaults = {
			contentType: 'aplication/json',
			dataType: 'json',
			method: 'GET',
			xhrFields: {
				withCredentials: true
			}
		},
		settings = Ember.$.extend({}, defaults, options);

	return new Ember.RSVP.Promise((resolve) => {
		settings.success = function (data) {
			options.success(data);
			resolve(this);
		};
		settings.error = function (err) {
			options.error(err);
			resolve(this);
		};
		Ember.$.ajax(settings);
	});
}
