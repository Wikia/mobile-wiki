import Ember from 'ember';
import nl2br from 'common/utils/nl2br';
import truncate from '../utils/truncate';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({

	/**
	 * Property used to truncate the post body to 148 chars.
	 * This property is set only in Firefox and in IE, because in other browsers works 'line-clamp' css property.
	 * This is hack for the browsers that do not support 'line-clamp'.
	 */
	shouldUseTruncationHack: (/Firefox|Trident|Edge/).test(navigator.userAgent),

	/**
	 * Returns content with links created from urls and converts \n, \rn and \r to <br>
	 * @returns {string}
	 */
	parsedContent: Ember.computed(function () {
		let escapedContent = Ember.Handlebars.Utils.escapeExpression(
			this.get('post.rawContent')
		).trim();

		if (!this.get('isDetailsView') && this.get('shouldUseTruncationHack')) {
			escapedContent = truncate(escapedContent, 148);
		}

		escapedContent = nl2br(escapedContent);

		return window.Autolinker ? window.Autolinker.link(escapedContent, {
			stripPrefix: false,
			email: false,
			phone: false,
			twitter: false
		}) : escapedContent;
	})
});
