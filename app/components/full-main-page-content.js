import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
	classNames: ['full-main-page-content'],
	actions: {
		openSection() {
			this.set('openSection', !this.get('openSection'));
		},
	}
});
