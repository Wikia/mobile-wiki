import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly, or} from '@ember/object/computed';
import {inject as service} from '@ember/service';

export default Component.extend({
	wikiVariables: service(),

	classNames: ['local-navigation-for-seo'],
	localLinks: readOnly('wikiVariables.localNav'),
	currentLocalLinks: or('currentLocalNav.children', 'localLinks'),

	model: computed('currentLocalLinks', function () {
		return this.flattenLinksArray(this.get('currentLocalLinks'));
	}),

	flattenLinksArray(linksList = []) {
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
});
