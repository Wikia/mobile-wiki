import Ember from 'ember';
import truncate from '../utils/truncate';

export default Ember.Component.extend({
	classNames: ['og-container'],
	classNameBindings: ['imageCardNoneMobile', 'imageCardNoneDesktop', 'imageCardSmallMobile', 'imageCardSmallDesktop',
		'imageCardLargeMobile', 'imageCardLargeDesktop'],

	tagName: Ember.computed('active', function () {
		return this.get('active') ? 'a' : 'div';
	}),

	attributeBindings: ['openGraphHref:href', 'openGraphTitle:title'],

	openGraphHref: Ember.computed('active', 'openGraphData.url', function () {
		return this.get('active') ? this.get('openGraphData.url') : null;
	}),

	openGraphTitle: Ember.computed('active', 'openGraphData.domain', function () {
		return this.get('active') ? this.get('openGraphData.domain') : null;
	}),

	oneLineCharacters: 48,
	/**
	 * Property used to truncate the post body to 148 chars.
	 * This property is set only in Firefox and in IE, because in other browsers works 'line-clamp' css property.
	 * This is hack for the browsers that do not support 'line-clamp'.
	 */
	shouldUseTruncationHack: (/Firefox|Trident|Edge/).test(navigator.userAgent),
	twoLinesCharacters: 98,

	imageCardNoneMobile: Ember.computed('openGraphData.imageWidth', function () {
		return this.get('openGraphData.imageWidth') < 51;
	}),

	imageCardNoneDesktop: Ember.computed('openGraphData.imageWidth', function () {
		return this.get('openGraphData.imageWidth') < 101;
	}),

	imageCardSmallMobile: Ember.computed('openGraphData.imageWidth', function () {
		return this.get('openGraphData.imageWidth') > 50 && this.get('openGraphData.imageWidth') < 300;
	}),

	imageCardSmallDesktop: Ember.computed('openGraphData.imageWidth', function () {
		return this.get('openGraphData.imageWidth') > 100 && this.get('openGraphData.imageWidth') < 500;
	}),

	imageCardLargeMobile: Ember.computed('openGraphData.imageWidth', function () {
		return this.get('openGraphData.imageWidth') >= 300;
	}),

	imageCardLargeDesktop: Ember.computed('openGraphData.imageWidth', function () {
		return this.get('openGraphData.imageWidth') > 500;
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
