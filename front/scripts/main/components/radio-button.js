import App from '../app';

export default App.RadioButtonComponent = Ember.Component.extend({
	tagName: 'input',
	type: 'radio',
	attributeBindings: ['checked', 'name', 'type', 'value'],

	checked: Ember.computed('value', 'groupValue', function () {
		return this.get('value') === this.get('groupValue');
	}),

	change: () => this.set('groupValue', this.get('value'))
});
