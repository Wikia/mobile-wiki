import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['event-wrapper'],
	click: function () {
		this.sendAction();
	}
});
