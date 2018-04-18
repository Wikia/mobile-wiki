import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
	classNames: ['full-main-page-content'],
	sectionState: '',
	actions: {
		openSection() {
			if (this.get('sectionState') === '') {
				this.set('sectionState', 'open-section');
			} else {
				this.set('sectionState', '');
			}
		},
	}
});
