import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly, or} from '@ember/object/computed';
import {inject as service} from '@ember/service';

export default Component.extend({
	classNames: ['local-navigation-for-seo'],
	wikiVariables: service(),
	localLinks: readOnly('wikiVariables.localNav'),
	currentLocalLinks: or('currentLocalNav.children', 'localLinks'),
	flattenLinksArray(linksList) {
		let flatArray = [];
		linksList.forEach((item) => {
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
