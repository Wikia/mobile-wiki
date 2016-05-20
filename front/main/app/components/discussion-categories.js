import Ember from 'ember';
export default Ember.Component.extend({
	collapsed: false,
	tagName: 'fieldset',
	classNames: ['discussion-fieldset'],

	actions: {
		toggle() {
			this.set('collapsed', !this.get('collapsed'));
		}
	}
});
