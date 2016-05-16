import Ember from 'ember';
import {truncate, shouldUseTruncationHack} from '../utils/truncate';

export default Ember.Component.extend({
	tagName: 'a',
	attributeBindings: ['openGraphHref:href', 'openGraphTitle:title', 'openGraphTarget:target'],
	classNames: ['og-container'],
	classNameBindings: ['imageCardMobileNone', 'imageCardMobileSmall', 'imageCardMobileLarge', 'imageCardDesktopNone',
		'imageCardDesktopSmall', 'imageCardDesktopLarge'],

	oneLineCharacters: 48,
	twoLinesCharacters: 98,

	// this is the current maximum width of a post - it is main post width on desktop post detail page
	maxPostWidth: 525,
	// this is 16x9 ratio for the maxPostWidth
	maxPostHeight: Ember.computed('maxPostWidth', function () {
		return parseInt(this.get('maxPostWidth') * 9 / 16, 10);
	}),

	init() {
		// we're usually strongly against that kind of caching, because a getter should be used always,
		// but come on, it is 8 calls, and even we have some limits in the matter of principles :)
		const imageWidth = this.get('openGraphData.imageWidth');

		this.setProperties({
			imageCardMobileNone: imageWidth < 51,
			imageCardMobileSmall: imageWidth > 50 && imageWidth < 300,
			imageCardMobileLarge: imageWidth >= 300,
			imageCardDesktopNone: imageWidth < 101,
			imageCardDesktopSmall: imageWidth > 100 && imageWidth < 500,
			imageCardDesktopLarge: imageWidth >= 500,
			openGraphHref: this.get('openGraphData.url'),
			openGraphTitle: this.get('openGraphData.domain'),
		});

		if (this.get('isListView')) {
			this.set('openGraphTarget', '_blank');
		}

		this._super(...arguments);
	},

	imageUrl: Ember.computed('openGraphData.imageUrl', function () {
		if (!this.get('openGraphData.imageUrl')) {
			return '';
		}

		return `${this.get('openGraphData.imageUrl')}/fixed-aspect-ratio-down/width/${this.get('maxPostWidth')}` +
			`/height/${this.get('maxPostHeight')}`;
	}),

	siteName: Ember.computed('openGraphData.domain', 'openGraphData.siteName', function () {
		let siteNameToDisplay = this.get('openGraphData.siteName') || this.get('openGraphData.domain');

		if (shouldUseTruncationHack()) {
			siteNameToDisplay = truncate(siteNameToDisplay, this.get('oneLineCharacters'));
		}

		return siteNameToDisplay;
	}),

	title: Ember.computed('openGraphData.title', function () {
		if (shouldUseTruncationHack()) {
			return truncate(this.get('openGraphData.title'), this.get('twoLinesCharacters'));
		}

		return this.get('openGraphData.title');
	}),
});
