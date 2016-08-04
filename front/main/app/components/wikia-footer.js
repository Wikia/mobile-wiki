import Ember from 'ember';
import {getDomain} from '../utils/domain';
import {track, trackActions} from '../../common/utils/track';

export default Ember.Component.extend({
	classNames: ['wikia-footer'],
	tagName: 'footer',

	// Keep this in sync with /server/app/views/_partials/wikia-footer.hbs
	links: [
		{
			href: '//gameshub.wikia.com/wiki/Games_Hub',
			text: 'hub-games'
		},
		{
			href: '//movieshub.wikia.com/wiki/Movies_Hub',
			text: 'hub-movies'
		},
		{
			href: '//tvhub.wikia.com/wiki/TV_Hub',
			text: 'hub-tv'
		},
		{
			href: '//comicshub.wikia.com/wiki/Comics_Hub',
			text: 'hub-comics'
		},
		{
			href: '//musichub.wikia.com/wiki/Music_Hub',
			text: 'hub-music'
		},
		{
			href: '//bookshub.wikia.com/wiki/Books_Hub',
			text: 'hub-books'
		},
		{
			href: '//lifestylehub.wikia.com/wiki/Lifestyle_Hub',
			text: 'hub-lifestyle'
		},
		{
			href: '?useskin=oasis',
			text: 'footer-link-full-site',
			className: 'spaced'
		},
		{
			href: '//www.wikia.com/Licensing',
			text: 'footer-link-licensing'
		},
		{
			href: '//www.wikia.com/Privacy_Policy',
			text: 'footer-link-privacy-policy'
		},
		{
			href: '//www.wikia.com/Special:Contact',
			text: 'footer-link-feedback'
		}
	],

	actions: {
		/**
		 * @param {string} text
		 * @param {string} href
		 * @returns {void}
		 */
		handleFooterLinkClick(text, href) {
			track({
				action: trackActions.click,
				label: text,
				category: 'footer'
			});

			if (this.checkLinkForOasisSkinOverwrite(href)) {
				Ember.$.cookie('useskin', 'oasis', {path: '/', domain: getDomain()});
			}

			Ember.run.later(() => {
				window.location = href;
			}, 100);
		}
	},

	/**
	 * checks link for oasis skin overwrite
	 * @param {string} href
	 * @returns {boolean}
	 */
	checkLinkForOasisSkinOverwrite(href) {
		return href.indexOf('useskin=oasis') !== -1;
	}
});
