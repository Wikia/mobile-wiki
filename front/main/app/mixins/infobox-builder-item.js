import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Mixin.create(
	TrackClickMixin,
	{
		classNameBindings: ['active'],
		active: Ember.computed('model', 'activeItem', function () {
			return this.get('model') === this.get('activeItem');
		}),

		click() {
			this.trackClick('infobox-builder', `click-element-${this.get('model.type')}`);
			this.get('setEditItem')(this.get('model'));
		},

		mouseMove(event) {
			this.get('onMouseEnter')(event.clientX, event.clientY);
		},

		mouseLeave() {
			this.get('onMouseLeave')();
		}
	}
);
