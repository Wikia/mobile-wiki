import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-buttons'],

	init() {
		this._super(...arguments);
		this.buttons = [
			{
				name: 'row',
				icon: 'row-block'
			},
			{
				name: 'image',
				icon: 'image-block'
			},
			{
				name: 'title',
				icon: 'title-block'
			},
			{
				name: 'section-header',
				icon: 'section-block'
			}
		];
	},
});
