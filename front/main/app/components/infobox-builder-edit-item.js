import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		editPanelOption: Ember.computed('item.type', function () {
			return `infobox-builder-edit-item-${this.get('item.type')}`;
		}),

		header: Ember.computed('item.{data,data.label,type,value,data.defaultValue,infoboxBuilderData.index}', function () {
			let header;

			switch (this.get('item.type')) {
				case 'title':
					header = this.get('item.data.defaultValue') ||
							i18n.t('main.title-default', {
								ns: 'infobox-builder',
								index: this.get('item.infoboxBuilderData.index')
							});
					break;
				case 'row':
					header = this.get('item.data.label');
					break;
				case 'image':
					header = i18n.t('main.image-default', {
						ns: 'infobox-builder',
						index: this.get('item.infoboxBuilderData.index')
					});
					break;
				case 'section-header':
					header = this.get('item.data');
					break;
			}

			return header;
		}),

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
