import PopOver from 'ember-pop-over/components/pop-over';
import Ember from 'ember';

export default PopOver.extend({
	positionPointer($compass, pointerRect) {
		const $target = Ember.$(Ember.get(this, 'targets')[0].element);

		pointerRect.left = $target.position().left + $target.width() / 2 - 26;
		this._super($compass, pointerRect);
	},
});
