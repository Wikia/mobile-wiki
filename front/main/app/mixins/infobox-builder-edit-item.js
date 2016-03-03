import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Mixin.create(
	TrackClickMixin,
	{
		isHelpVisible: false,
		classNames: ['sidebar-content-padding'],

		trackBuilderClick(element) {
			this.trackClick('infobox-builder', `edit-item-${this.get('item.type')}-${element}`);
		},

		actions: {
			showHelp() {
				this.trackClick('infobox-builder', `show-help-tooltip-${this.get('item.type')}`);
				this.set('isHelpVisible', true);
			}
		}
	}
);
