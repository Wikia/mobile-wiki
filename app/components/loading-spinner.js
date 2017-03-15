import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['overlay:loading-overlay'],

	// 'isVisible' is set to false also when 'active' is undefined.
	// This way it is not needed to initialize it in components.
	isVisible: Ember.computed('active', function () {
		return Boolean(this.get('active'));
	}),

	active: false,
	overlay: true,
	radius: 30,
	strokeWidth: 6,

	fullRadius: Ember.computed('radius', function () {
		return this.get('radius') + (this.get('strokeWidth') / 2);
	}),

	fullDiameter: Ember.computed('radius', function () {
		return this.get('radius') * 2 + this.get('strokeWidth');
	}),
});
