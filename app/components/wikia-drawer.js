import Component from '@ember/component';

export default Component.extend({
	tagName: 'nav',
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed']
});
