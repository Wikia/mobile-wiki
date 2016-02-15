import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['infobox-builder-sidebar'],

	buttons: [
		{
			name: 'row',
			icon: 'row-block'
		},
		{
			name: 'title',
			icon: 'title-block'
		},
		{
			name: 'image',
			icon: 'image-block'
		}
		// this infobox item will be added as part of DAT-3711
		// https://wikia-inc.atlassian.net/browse/DAT-3711
		// {
		//	name: 'section-header',
		//	icon: 'section-block'
		// }
	]
});
