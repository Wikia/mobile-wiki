import { alias, not } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';

import scrollIntoView from '../utils/scroll-into-view';

export default Component.extend({
	classNames: ['lightbox-thumbnails-container'],

	didRender() {
		this._super(...arguments);

		this.element.querySelectorAll('.lightbox-thumbnail-active').forEach((item) => {
			item.classList.remove('lightbox-thumbnail-active');
		});

		const activeThumbnail = this.element.querySelector(`[data-ref="${this.get('activeThumbnailRef')}"]`);
		if (activeThumbnail) {
			activeThumbnail.classList.add('lightbox-thumbnail-active');
			scrollIntoView(activeThumbnail, { block: 'end', inline: 'nearest', behavior: 'smooth' });
		}
	}
});
