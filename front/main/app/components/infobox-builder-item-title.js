import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		tagName: 'h2',
		classNames: ['pi-item', 'pi-item-spacing', 'pi-title'],

		value: Ember.computed('item.{infoboxBuilderData.index,data.default}', function () {
			const defaultValue = this.get('item.data.default');

			return defaultValue ?
				defaultValue :
				i18n.t('infobox-builder:main.title-default', {
					ns: 'infobox-builder',
					index: this.get('item.infoboxBuilderData.index')
				});
		})
	}
);
