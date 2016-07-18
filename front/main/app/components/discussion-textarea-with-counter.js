import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'label',

	label: '',
	text: '',
	placeholder: '',

	maxlength: 0,
	notAllowedCharacters: ['\n', '\r'],
	onInput: null,
	required: false,

	charactersCount: Ember.computed('text', 'maxlength', function () {
		return this.get('maxlength') - this.get('text').length;
	}),

	observeText: Ember.observer('text', function () {
		let text = this.get('text');
		let lastCharacter = text[text.length - 1];
		if (this.get('notAllowedCharacters').contains(lastCharacter)) {
			this.set('text', text.substring(0, text.length - 1));
		}
		this.get('onInput')(this.get('text'));
	}),
});
