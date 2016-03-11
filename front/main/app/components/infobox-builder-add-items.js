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
		}
	}
);
