import Ember from 'ember';
import {truncate, shouldUseTruncationHack} from '../utils/truncate';

export default Ember.Component.extend({
	tagName: 'a',
	attributeBindings: ['openGraphHref:href', 'openGraphTitle:title', 'openGraphTarget:target'],
	classNames: ['og-container'],
	classNameBindings: ['noImageCardMobile', 'smallImageCardMobile', 'largeImageCardMobile', 'noImageCardDesktop',
		'smallImageCardDesktop', 'largeImageCardDesktop', 'isLoading'],

	oneLineCharacters: 48,
	twoLinesCharacters: 98,

	desktopMaxImageWidth: 525,
	mobileMaxImageWidth: 325,
	smallMaxImageWidth: 150,

	noImageCardMobile: false,
	smallImageCardMobile: false,
	largeImageCardMobile: false,
	noImageCardDesktop: false,
	smallImageCardDesktop: false,
	largeImageCardDesktop: false,

	init() {
		this.setImageClasses();

		this.setProperties({
			openGraphHref: this.get('openGraphData.url'),
			openGraphTitle: this.get('openGraphData.domain'),
			openGraphTarget: '_blank',
		});

		this._super(...arguments);
	},

	widthObserver: Ember.observer('openGraphData.imageWidth', function () {
		this.setImageClasses();
	}),

	setImageClasses() {
		const imageWidth = this.get('openGraphData.imageWidth');

		this.setProperties({
			noImageCardMobile: imageWidth < 51,
			smallImageCardMobile: imageWidth > 50 && imageWidth < 300,
			largeImageCardMobile: imageWidth >= 300,
			noImageCardDesktop: imageWidth < 101,
			smallImageCardDesktop: imageWidth > 100 && imageWidth < 500,
			largeImageCardDesktop: imageWidth >= 500,
		});
	},

	imageUrl: Ember.computed('openGraphData.imageUrl', function () {
		const imageWidth = this.get('desktopMaxImageWidth'),
			imageHeight = parseInt(imageWidth * 9 / 16, 10);

		if (!this.get('openGraphData.imageUrl')) {
			return '';
		}

		return `${this.get('openGraphData.imageUrl')}/zoom-crop/width/${imageWidth}/height/${imageHeight}`;
	}),

	imageUrlSet: Ember.computed('openGraphData.imageUrl', function () {
		const mobileImageWidth = this.get('largeImageCardMobile') ?
				this.get('mobileMaxImageWidth') :
				this.get('smallMaxImageWidth'),
			mobileImageHeight = parseInt(mobileImageWidth * 9 / 16, 10),
			desktopImageWidth = this.get('largeImageCardDesktop') ?
				this.get('desktopMaxImageWidth') :
				Math.max(mobileImageWidth, this.get('smallMaxImageWidth')),
			desktopImageHeight = parseInt(desktopImageWidth * 9 / 16, 10);

		if (!this.get('openGraphData.imageUrl')) {
			return '';
		}

		return `${this.get('openGraphData.imageUrl')}/zoom-crop/width/${mobileImageWidth}` +
			`/height/${mobileImageHeight} 380w, ` +
			`${this.get('openGraphData.imageUrl')}/zoom-crop/width/${desktopImageWidth}` +
			`/height/${desktopImageHeight} 5000w`;
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

	actions: {
		close() {
			this.get('close')();
		}
	}
});
