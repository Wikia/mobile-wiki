import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['bottom-banner'],
	classNameBindings: ['loaded', 'dismissed'],
	dismissed: false,
	loaded: false,

	setCookie(cookieName, expires) {
		Ember.$.cookie(cookieName, 1, {
			domain: getDomain(),
			expires,
			path: '/'
		});
	}
});
