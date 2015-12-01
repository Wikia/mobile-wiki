import App from '../app';

/**
 * Handles sending upvote action outside from the component.
 */
export default App.DiscussionParsedContentMixin = Ember.Mixin.create({
	/**
	 * Returns content with links created from urls
	 * @returns {string}
	 */
	parsedContent: Ember.computed(function () {
		const escapedContent = Ember.Handlebars.Utils.escapeExpression(
			this.get('post.rawContent')
		);

		return window.Autolinker ? window.Autolinker.link(escapedContent, {
			stripPrefix: false,
			email: false,
			phone: false,
			twitter: false
		}) : escapedContent;
	})
});
