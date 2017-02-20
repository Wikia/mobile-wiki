import Ember from 'ember';
import {truncate} from '../utils/truncate';
import nl2br from 'common/utils/nl2br';

const {Component, Handlebars, computed} = Ember;

export default Component.extend(
	{
		classNames: ['post-detail'],
		autolinkerConfig: {},

		init() {
			this.autolinkerConfig = {
				email: false,
				phone: false,
				stripPrefix: false,
				twitter: false,
				replaceFn: this.getReplaceFn()
			};

			this._super();
		},

		openGraphSiteName: computed.or('post.openGraph.domain', 'post.openGraph.siteName'),

		openGraphImageUrl: computed('post.openGraph.imageUrl', function () {
			const imageWidth = 525,
				imageHeight = parseInt(imageWidth * 9 / 16, 10);

			if (!this.get('post.openGraph.imageUrl')) {
				return '';
			}

			return `${this.get('post.openGraph.imageUrl')}/zoom-crop/width/${imageWidth}/height/${imageHeight}`;
		}),

		parsedContent: computed('post.rawContent', function() {
			let escapedContent = Handlebars.Utils.escapeExpression(
				this.get('post.rawContent')
			).trim();

			escapedContent = truncate(escapedContent, 148);
			escapedContent = nl2br(escapedContent);

			return window.Autolinker ? window.Autolinker.link(escapedContent, this.autolinkerConfig) : escapedContent;
		}),

		getReplaceFn() {
			function decodeUriSafely(uri) {
				try {
					return decodeURIComponent(uri);
				} catch (err) {
					return uri;
				}
			}

			/**
			 * Wraps links in span instead of anchor tag in discussion forum view to open post details instead of anchor href.
			 * @param {Autolinker.match.Match} match which should be wrapped
			 * @returns {string}
			 */
			function wrapInSpan(match) {
				if (match.getType() === 'url') {
					return `<span class='url'>${decodeUriSafely(match.getUrl())}</span>`;
				}
				return true;  // Autolinker will perform its normal anchor tag replacement
			}

			return wrapInSpan;
		},
	}
);
