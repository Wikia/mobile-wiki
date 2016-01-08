import nl2br from '../../mercury/utils/nl2br';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({

	/**
	 * Returns only the first 148 chars from the given string, and adds '...' at the end if the string originally was
	 * longer than 148 characters.
	 * This function is needed only in Firefox and in IE, cos in other browsers we are using 'line-clamp' css property.
	 * This is hack for the browsers that do not support 'line-clamp', so the settings and the function itself are here.
	 * @param content
	 * @returns {string}
	 */
	contentTruncation: function (content) {
		const maxContentChars = 148,
			ellipsis = "&hellip;";

		if (content.length > maxContentChars) {
			content = content.slice(0, maxContentChars - 1) + ellipsis;
		}

		return content;
	},


	/**
	 * Returns content with links created from urls and converts \n, \rn and \r to <br>
	 * @returns {string}
	 */
	parsedContent: Ember.computed(function () {
		let escapedContent = Ember.Handlebars.Utils.escapeExpression(
			this.get('post.rawContent')
		).trim();

		if (!this.isDetailsView && /Firefox|Trident|Edge/.test(navigator.userAgent)) {
			escapedContent = this.contentTruncation(escapedContent);
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
