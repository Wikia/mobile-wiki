import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	InfoboxBuilderEditItemMixin,
	TrackClickMixin,
	{
		useArticleName: Ember.computed('item.data.defaultValue', {
			get() {
				return Boolean(this.get('item.data.defaultValue'));
			},
			set(key, value) {
				const item = this.get('item');

				this.trackClick('infobox-builder', `edit-item-${item.type}-default-article-name`);
				this.get('editTitleItem')(item, value);
				return value;
			}
		})
	}
);
