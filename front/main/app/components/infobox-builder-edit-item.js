import Ember from 'ember';

export default Ember.Component.extend({
	editPanelOption: Ember.computed('item.type', function () {
		return `infobox-builder-edit-item-${this.get('item.type')}`;
	}),

	header: Ember.computed('item.{data.label,type,value,data.defaultValue,infoboxBuilderData.index}', function () {
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
		default:
			break;
		}

		return header;
	}),

	actions: {
		removeItem() {
			this.get('onDeleteItem')(this.get('item'));
		},
		back() {
			this.get('onBackArrowClick');
		}
	}
});
