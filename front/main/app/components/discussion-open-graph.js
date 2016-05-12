import Ember from 'ember';
import truncate from '../utils/truncate';

export default Ember.Component.extend({
	attributeBindings: ['openGraphHref:href', 'openGraphTitle:title'],
	classNames: ['og-container'],
	classNameBindings: ['imageCardMobileNone', 'imageCardMobileSmall', 'imageCardMobileLarge', 'imageCardDesktopNone',
		'imageCardDesktopSmall', 'imageCardDesktopLarge'],

	oneLineCharacters: 48,
	twoLinesCharacters: 98,

	/**
	 * Property used to truncate the post body to 148 chars.
	 * This property is set only in Firefox and in IE, because in other browsers works 'line-clamp' css property.
	 * This is hack for the browsers that do not support 'line-clamp'.
	 */
	shouldUseTruncationHack: (/Firefox|Trident|Edge/).test(navigator.userAgent),

	tagName: Ember.computed('active', function () {
		return this.get('active') ? 'a' : 'div';
	}),

	activePropertyObserver: Ember.observer('active', function () {
		this.setProperties({
			openGraphHref: this.get('active') ? this.get('openGraphData.url') : null,
			openGraphTitle: this.get('active') ? this.get('openGraphData.domain') : null;
		});
	}),

	imageWidthObserver: Ember.observer('openGraphData.imageWidth', function () {
		// we're usually strongly against that kind of caching, because a getter should be used always,
		// but come on, it is 8 calls, and even we have some limits in the matter of principles :)
		const imageWidth = this.get('openGraphData.imageWidth');

		this.setProperties({
			imageCardMobileNone: imageWidth < 51;
			imageCardMobileSmall: imageWidth > 50 && imageWidth < 300;
			imageCardMobileLarge: imageWidth >= 300;
			imageCardDesktopNone: imageWidth < 101;
			imageCardDesktopSmall: imageWidth > 100 && imageWidth < 500;
			imageCardDesktopLarge: imageWidth > 500;
		});
	}),

	siteName: Ember.computed('openGraphData.domain', 'openGraphData.siteName', function () {
		let siteNameToDisplay = this.get('openGraphData.siteName') || this.get('openGraphData.domain');

		if (this.get('shouldUseTruncationHack')) {
			siteNameToDisplay = truncate(siteNameToDisplay, this.get('oneLineCharacters'));
		}

		return siteNameToDisplay;
	}),

	title: Ember.computed('openGraphData.title', function () {
		if (this.get('shouldUseTruncationHack')) {
			return truncate(this.get('openGraphData.title'), this.get('twoLinesCharacters'));
		}

		return this.get('openGraphData.title');
	}),
});
