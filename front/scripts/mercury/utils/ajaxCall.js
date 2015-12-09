/** This is a wrapper for ajax calls
 * @param {object} options
 * @returns {Ember.RSVP.Promise}
 */
export default function(options) {
	const defaults = {
			dataType: 'json',
			method: 'GET',
			xhrFields: {
				withCredentials: true
			}
		},
		settings = Ember.$.extend({}, defaults, options);
	return new Ember.RSVP.Promise((resolve, reject) => {
		Ember.$.ajax(settings);
	});
}
