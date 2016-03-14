import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['infobox-builder-sidebar-header'],
		title: Ember.computed('item.{data,data.label,type,value,data.defaultValue,infoboxBuilderData.index}', function () {
			let title;

			switch (this.get('item.type')) {
				case 'title':
					title = this.get('item.data.defaultValue') ||
						i18n.t('main.title-default', {
							ns: 'infobox-builder',
							index: this.get('item.infoboxBuilderData.index')
						});
					break;
				case 'row':
					title = this.get('item.data.label');
					break;
				case 'image':
					title = i18n.t('main.image-default', {
						ns: 'infobox-builder',
						index: this.get('item.infoboxBuilderData.index')
					});
					break;
				case 'section-header':
					title = this.get('item.data');
					break;
				default:
					title = i18n.t('main.sidebar-header', {
						ns: 'infobox-builder'
					});
					break;
			}

			return title;
		}),

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
