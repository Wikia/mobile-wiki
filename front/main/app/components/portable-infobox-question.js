import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portable-infobox-question'],
	classNameBindings: ['collapsed', 'submitted'],
	thankYou: false,
	submitted: Ember.computed('thankYou', function () {
		return this.thankYou;
	})
});
