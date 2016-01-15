import nl2br from '../../mercury/utils/nl2br';

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
	 * Returns content with links created from urls and converts \n, \rn and \r to <br>
	 * @returns {string}
	 */
	parsedContent: Ember.computed(function () {
		let escapedContent = Ember.Handlebars.Utils.escapeExpression(
			this.get('post.rawContent')
		).trim();

		escapedContent = nl2br(escapedContent);

		if (!this.get('isDetailsView')) {
			this.autolinkerConfig.replaceFn = (autolinker, match) => {
				if (match.getType() === 'url') {
					return `<span class='link'>${match.getUrl()}</span>`;
				}
			};
		}
		return window.Autolinker ? window.Autolinker.link(escapedContent, this.autolinkerConfig) : escapedContent;
	})
});
