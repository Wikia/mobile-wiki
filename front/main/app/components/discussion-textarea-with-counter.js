import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'label',

	label: '',
	text: '',
	placeholder: '',

	maxlength: 0,
	notAllowedCharactersPattern: /\r?\n|\r/g,
	onInput: null,
	required: false,

	charactersCount: Ember.computed('text', 'maxlength', function () {
		return this.get('maxlength') - this.get('text.length');
	}),

	observeText: Ember.observer('text', function () {
		this.set('text',
			this.get('text').replace(this.get('notAllowedCharactersPattern'), ""));
		this.get('onInput')(this.get('text'));
	}),
});
