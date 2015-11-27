import App from '../app';

export default App.LoadingSpinnerComponent = Ember.Component.extend({
	classNameBindings: ['overlay:loading-overlay'],
	isVisible: Ember.computed.alias('active'),

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
