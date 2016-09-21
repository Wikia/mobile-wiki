import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__link'],

	trackClick: Ember.K,

	click() {
		this.get('trackClick')(this.get('model.title.key'));
	}
});
