import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['infobox-builder-sidebar-header'],
		title: Ember.computed( 'type', function () {
				const type = this.get('type');

				return type ?
					// possible message keys: add-title, add-image, add-row, add-section-header
					i18n.t(`main.add-${type}`, { ns: 'infobox-builder' }) :
					i18n.t('main.sidebar-header', { ns: 'infobox-builder' });
			}
		),

		showActionButtons: Ember.computed.bool('type'),

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
