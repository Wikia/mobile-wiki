import nl2br from '../../mercury/utils/nl2br';
import truncate from '../utils/truncate';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	autolinkerConfig: {
		email: false,
		phone: false,
		stripPrefix: false,
		twitter: false
	},

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

		if (!this.get('isDetailsView')) {
			this.autolinkerConfig.replaceFn = this.wrapInSpan;
		}
		return window.Autolinker ? window.Autolinker.link(escapedContent, this.autolinkerConfig) : escapedContent;
	}),

	/**
	 * Wraps links in span instead of anchor tag in discussion forum view
	 * @param {object} autolinker instance of class
	 * @param {object} match which should be wrapped
	 * @returns {string}
	 */
	wrapInSpan(autolinker, match) {
		if (match.getType() === 'url') {
			return `<span class='url'>${match.getUrl()}</span>`;
		}
	}
});
