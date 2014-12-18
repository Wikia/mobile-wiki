/// <reference path="../../main/mixins/TrackClickMixin.ts" />
'use strict';

App.WikiaFooterComponent = Em.Component.extend(App.TrackClickMixin, {
	classNames: ['wikia-footer'],
	tagName: 'footer',
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
			//TODO: take main skin for a wiki
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
	]
});
