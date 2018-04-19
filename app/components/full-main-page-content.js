import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
	classNames: ['full-main-page-content'],
	openSection: false,
	actions: {
		openSection() {
			this.toggleProperty('openSection');
		},
	}
});
