import Ember from 'ember';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';

export default Ember.Component.extend(
	InfoboxBuilderSidebarOptionsMixin,
	{
		classNames: ['infobox-builder-buttons'],

		init() {
			this._super(...arguments);
			this.buttons = [
				{
					name: 'title',
					icon: 'title-block'
				},
				{
					name: 'image',
					icon: 'image-block'
				},
				{
					name: 'row',
					icon: 'row-block'
				},
				{
					name: 'section-header',
					icon: 'section-block'
				}
			];
		}
	}
);
