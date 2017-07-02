import Ember from 'ember';
import config from '../../config/environment';

const {
	Component,
	computed,
	inject
} = Ember;

export default Component.extend({
	tagName: '',
	layoutName: 'components/fastboot-only/body-bottom',
	noExternals: computed.bool('queryParams.noexternals'),
	wikiVariables: inject.service(),
	localLinks: computed.reads('wikiVariables.localNav'),
	currentLocalLinks: computed.or('currentLocalNav.children', 'localLinks'),
	inContextTranslationsEnabled: config.inContextTranslationsEnabled,
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
	localNavigationForSeo: computed('localItems', function () {
		let flatLinks = (linksArray) => {
			let arrayToReturn = [];
			// First level
			linksArray.map((item, index) => {
				// Second level
				item.children.map((item, index) => {
					if (item.children) {
						// Third level
						item.children.map((item, index) => {
							arrayToReturn.push({name: item.text, href: item.href});
						});
					}
					arrayToReturn.push({name: item.text, href: item.href});
				});
				arrayToReturn.push({name: item.text, href: item.href});
			});
			return arrayToReturn;
		};

		flatLinks(this.get('currentLocalLinks')).map((item) => {
			console.log(`<a href="${item.href}">${item.name}</a>`);
			return `<a href="${item.href}">${item.name}</a>`;
		}).reverse();
	})
});
