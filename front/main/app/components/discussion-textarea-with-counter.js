import Ember from 'ember';

export default Ember.Component.extend({
	/**
	 * @private
	 */
	tagName: 'label',

	label: '',
	text: '',
	placeholder: '',

	maxlength: 0,
	/**
	 * @private
	 */
	notAllowedCharactersPattern: /\r?\n|\r/g,
	onInput: null,
	required: false,

	charactersCount: Ember.computed('text', 'maxlength', function () {
		return this.get('maxlength') - this.get('text.length');
	}),

	actions: {
		onTexareaInputChange: function() {
			this.set('text',
				this.get('text').replace(this.get('notAllowedCharactersPattern'), ""));
			this.get('onInput')(this.get('text'));
		}
	}
});
