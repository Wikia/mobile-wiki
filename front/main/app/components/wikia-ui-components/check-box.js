import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'label',
	classNames: ['check-box'],
	attributeBindings: ['htmlFor:for'],
	htmlFor: Ember.computed.oneWay('inputId')
});
