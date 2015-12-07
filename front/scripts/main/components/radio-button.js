import App from '../app';

export default App.RadioButtonComponent = Ember.Component.extend({
	tagName: 'input',
	type: 'radio',
	attributeBindings: ['checked', 'name', 'type', 'value'],

	checked: function () {
		return this.get('value') === this.get('groupValue');
	}.property('value', 'groupValue'),

	change: function () {
		this.set('groupValue', this.get('value'));
	}
});
