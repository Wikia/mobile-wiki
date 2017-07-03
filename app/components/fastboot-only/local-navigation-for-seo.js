import Ember from 'ember';

const {
	Component,
	computed,
	inject
} = Ember;

export default Component.extend({
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
		let linksArray = this.get('currentLocalLinks');
		let flatArray = [];

		linksArray.map((item, index) => { // First level
			item.children.map((item, index) => { // Second level
				if (item.children) {
					item.children.map((item, index) => { // Third level
						if (item.href !== '#') {
							flatArray.push({name: item.text, href: item.href});
						}
					});
				}
				if (item.href !== '#') {
					flatArray.push({name: item.text, href: item.href});
				}
			});
			if (item.href !== '#') {
				flatArray.push({name: item.text, href: item.href});
			}
		});
		return flatArray;
	}),
	localNavigationForSeo: computed('flatNavigationLinks', function () {
		return this.get('flatNavigationLinks');
		// let navigationForSeo = this.get('flatNavigationLinks');
		// return navigationForSeo.map((item) => {
		// 	return `<a href="${item.href}">${item.name}</a>`;
		// });
	}),
});
