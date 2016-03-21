import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Mixin.create(
	TrackClickMixin,
	{
		classNameBindings: ['active', 'inGroup'],
		active: Ember.computed('model', 'activeItem', function () {
			return this.get('model') === this.get('activeItem');
		}),

		inGroup: Ember.computed('model', 'groupItems', function() {
			return this.get('groupItems').indexOf(this.get('model')) > -1;
		}),

		mouseMove(event) {
			this.get('onMouseEnter')(event.clientX, event.clientY);
		},

		mouseLeave() {
			this.get('onMouseLeave')();
		}
	}
);
