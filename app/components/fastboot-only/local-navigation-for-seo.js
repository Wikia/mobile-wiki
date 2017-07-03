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
	flattenLinksArray(linksList) {
		let flatArray = [];
		linksList.forEach(item => {
			if (item.href !== '#') {
				flatArray.push({name: item.text, href: item.href});
			}
			if (item.children) {
				flatArray = flatArray.concat(this.flattenLinksArray(item.children));
			}
		});
		return flatArray;
	},
	model: computed('flattenLinksArray', function () {
		return this.flattenLinksArray(this.get('currentLocalLinks'));
	}),
});
