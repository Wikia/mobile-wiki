import Ember from 'ember';
import nl2br from 'common/utils/nl2br';
import {truncate, shouldUseTruncationHack} from '../utils/truncate';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	autolinkerConfig: {},

	/**
	 * Returns content with links created from urls and converts \n, \rn and \r to <br>
	 * @returns {string}
	 */
	parsedContent: Ember.computed('content', function () {
		let escapedContent = Ember.Handlebars.Utils.escapeExpression(
			this.get('content')
		).trim();

		if (!this.get('truncateContent') && shouldUseTruncationHack()) {
			escapedContent = truncate(escapedContent, 148);
		}

		escapedContent = nl2br(escapedContent);

		return window.Autolinker ? window.Autolinker.link(escapedContent, this.autolinkerConfig) : escapedContent;
	}),

	init() {
		this.autolinkerConfig = {
			email: false,
			phone: false,
			stripPrefix: false,
			twitter: false
		};

		if (!this.get('activateLinks')) {
			this.set('autolinkerConfig.replaceFn', this.wrapInSpan);
		}
		this._super();
	},

	/**
	 * Wraps links in span instead of anchor tag in discussion forum view to open post details instead of anchor href
	 * @param {Object} autolinker instance of class
	 * @param {Object} match which should be wrapped
	 * @returns {string}
	 */
	wrapInSpan(autolinker, match) {
		if (match.getType() === 'url') {
			return `<span class='url'>${match.getUrl()}</span>`;
		}
	}
});
