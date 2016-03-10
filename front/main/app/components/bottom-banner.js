import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['bottom-banner'],
	classNameBindings: ['loaded', 'dismissed'],
	dismissed: false,
	loaded: false,
	init() {
		this._super(...arguments);
		this.set('loaded', true);
	}
});
