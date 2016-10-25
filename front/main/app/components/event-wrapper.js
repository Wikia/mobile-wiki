import Ember from 'ember';

/**
 * Wrapper for inline elements inside block elements and other components
 * to track only clicks on real element's area
 *
 * For example:
 * Text node inside block element
 *
 * <div>Text</div>
 *
 * will be wrapped into
 *
 * <div><div class="event-wrapper">Text</div></div>
 */
export default Ember.Component.extend({
	classNames: ['event-wrapper'],
	click: function () {
		this.sendAction();
	}
});
