import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__link'],

	click: function() {
		this.sendAction('trackClick', this.get('model.title.key'));
	}
});
