import Ember from 'ember';

/**
 * Wrapper for inline elements inside block elements and other components
 * to track only clicks on real element's area
 *
 * For example:
 * We want to track clicks only on "Text" inside block element
 *
 * <div>Text</div>
 *
 * so <div>{{#track-click action=actionName}}Text{{/track-click}}
 *
 * will produce, where "track-click" class has "inline-block" value
 *
 * <div><div class="track-click">Text</div></div>
 */
export default Ember.Component.extend({
	classNames: ['track-click'],
	click() {
		this.sendAction();
	}
});
