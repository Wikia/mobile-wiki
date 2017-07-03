import Ember from 'ember';

const {
	Component,
	computed,
	inject
} = Ember;

export default Component.extend({
	classNames: ['local-navigation-for-seo'],
	wikiVariables: inject.service(),
	localLinks: computed.reads('wikiVariables.localNav'),
	currentLocalLinks: computed.or('currentLocalNav.children', 'localLinks'),
	localItems: computed('currentLocalLinks', function () {
		return this.get('currentLocalLinks').map((item, index) => {
			return {
				type: item.children ? 'nav-menu-root' : 'nav-menu-item',
				href: item.href.replace(/^(\/wiki)?\//i, ''),
				route: 'wiki-page',
				name: item.text,
				index: index + 1,
				trackLabel: `local-nav-open-link-index-${index + 1}`
			};
		}) || [];
	}),
	flatNavigationLinks: computed('currentLocalLinks', function () {
		let deepMap = function (linksList) {
			let flatArray = [];

			linksList.forEach(item => {
				if (item.href !== '#') {
					flatArray.push({name: item.text, href: item.href});
				}
				if (item.children) {
					flatArray = flatArray.concat(deepMap(item.children));
				}
			});

			return flatArray;
		};

		return deepMap(this.get('currentLocalLinks'));
	}),
	localNavigationForSeo: computed('flatNavigationLinks', function () {
		return this.get('flatNavigationLinks');
	}),
});
