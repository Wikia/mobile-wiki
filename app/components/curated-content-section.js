import Component from '@ember/component';

export default Component.extend({
	classNames: ['curated-content-section'],
	classNameBindings: ['shouldBeVisible::hidden']
});
