import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super(...arguments);

		this.tagName = 'span';
		this.classNames = ['on-hover-tooltip'];
		this.attributeBindings = ['style'];
	},

	style: Ember.computed('posX', 'posY', function () {
		return `left: ${this.get('posX') + 20}px; top: ${this.get('posY')}px;`;
	})
});
