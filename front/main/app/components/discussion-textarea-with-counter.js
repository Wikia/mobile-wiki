import Ember from 'ember';

export default Ember.Component.extend({
	/**
	 * @private
	 */
	tagName: 'label',

	collapsedPlaceholder: '',
	label: '',
	text: '',
	placeholder: '',

	maxlength: 0,
	/**
	 * @private
	 */
	notAllowedCharactersPattern: /\r?\n|\r/g,
	required: false,
	onInput: null,
	isActive: true,

	isCollapsed: Ember.computed.not('isActive'),

	dynamicPlaceholder: Ember.computed('isCollapsed', 'placeholder', 'collapsedPlaceholder', function () {
		return this.get('isCollapsed') ? this.get('collapsedPlaceholder') : this.get('placeholder');
	}),

	charactersCount: Ember.computed('text', 'maxlength', function () {
		return this.get('maxlength') - this.get('text.length');
	}),

	showCharactersCounter: Ember.computed('isCollapsed', 'maxlength', function () {
		return Boolean(this.get('maxlength')) && !this.get('isCollapsed');
	}),

	showLabel: Ember.computed('isCollapsed', 'label', function () {
		return Boolean(this.get('label')) && !this.get('isCollapsed');
	}),

	actions: {
		onTexareaInputChange() {
			this.set('text',
				this.get('text').replace(this.get('notAllowedCharactersPattern'), ''));
			this.get('onInput')(this.get('text'));
		}
	}
});
