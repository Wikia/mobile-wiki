export default Ember.Component.extend({
	classNames: ['action'],

	labelClassName: Ember.computed('showLabelOnMobile', function () {
		return this.get('showLabelOnMobile') ? '' : 'mobile-hidden';
	})
});
