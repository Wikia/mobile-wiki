import nl2br from '../../mercury/utils/nl2br';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({

	/**
	 * Tells the template to show only the first 148 chars from the post body, and adds '...' at the end if the post
	 * originally was longer than 148 characters.
	 * This property is set only in Firefox and in IE, because in other browsers works 'line-clamp' css property.
	 * This is hack for the browsers that do not support 'line-clamp'.
	 */
	contentTruncationLength: null,

	/**
	 * Returns content with links created from urls and converts \n, \rn and \r to <br>
	 * @returns {string}
	 */
	parsedContent: Ember.computed(function () {
		let escapedContent = Ember.Handlebars.Utils.escapeExpression(
			this.get('post.rawContent')
		).trim();

		if (!this.get('isDetailsView') && !this.get('contentTruncationLength') &&
			/Firefox|Trident|Edge/.test(navigator.userAgent)) {
			this.set('contentTruncationLength', 148);
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
