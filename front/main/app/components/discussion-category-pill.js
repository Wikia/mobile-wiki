export default Ember.Component.extend({
	category: null,
	classNames: ['category-pill'],
	classNameBindings: ['hover:active-element-background-color'],
	hover: false,
	tagName: 'a',

	click() {
		this.sendAction('onCategoryPicked', this.get('category'));
	},

	mouseEnter() {
		this.set('hover', true);
	},

	mouseLeave() {
		this.set('hover', false);
	},
});
