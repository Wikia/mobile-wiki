import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['infobox-builder-sidebar-header'],
		title: Ember.computed(
			'item.{data,data.label,type,value,data.defaultValue,infoboxBuilderData.index}',
			function () {
				const type = this.get('item.type');

				return type ?
					i18n.t(`main.add-${this.get('item.type')}`, {
						ns: 'infobox-builder'
					}) :
					i18n.t('main.sidebar-header', {
						ns: 'infobox-builder'
					});
			}
		),

		showActionButtons: Ember.computed.bool('item'),

		actions: {
			removeItem() {
				const item = this.get('item');

				this.trackClick('infobox-builder', `delete-item-${item.type}`);
				this.get('onDeleteItem')(item);
			},
			back() {
				const item = this.get('item');

				this.trackClick('infobox-builder', `navigate-back-from-edit-panel-${item.type}`);
				this.get('onBackArrowClick')(null);
			}
		}
	}
);
