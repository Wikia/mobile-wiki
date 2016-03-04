import PopOver from 'ember-pop-over/components/pop-over';
import Ember from 'ember';

export default PopOver.extend({
	positionPointer($compass, pointerRect) {
		const $target = Ember.$(Ember.get(this, 'targets')[0].element),
			// shift is padding-left and half of pointer width
			// TODO calculate shift properly
			shift = 26;

		pointerRect.left = $target.position().left + $target.width() / 2 - shift;
		this._super($compass, pointerRect);
	},
	documentClick(evt) {
		this._super(evt);
		Ember.set(this, 'disabled', true);
	}
});
