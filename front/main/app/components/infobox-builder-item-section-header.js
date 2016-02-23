import Ember from 'ember';
import InfoboxBuilderItemMixin from '../mixins/infobox-builder-item';

export default Ember.Component.extend(
	InfoboxBuilderItemMixin, {
		init() {
			this._super(...arguments);
			this.tagName = 'h3';
			this.classNames = ['pi-item', 'pi-header', 'pi-secondary-font', 'pi-item-spacing',
				'pi-secondary-background'];

		},
		header: Ember.computed.oneWay('item.data')
	}
);
