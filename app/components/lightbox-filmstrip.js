import Component from '@ember/component';
import { throttle } from '@ember/runloop';

import scrollIntoView from '../utils/scroll-into-view';

const displayedThumbnailsBatchSize = 60;
const thumbnailSize = 54;
const appendBuffer = 200;

export default Component.extend({
	classNames: ['lightbox-thumbnails-container'],

	displayedThumbnails: null,

	didInsertElement() {
		this._super(...arguments);

		if (!this.displayedThumbnails) {
			this.set('displayedThumbnails', this.thumbnails.splice(0, displayedThumbnailsBatchSize));
		}

		this.onScroll = this.onScroll.bind(this);
		this.element.addEventListener('scroll', this.onScroll);
	},

	didRender() {
		this._super(...arguments);

		this.updateActiveThumbnail();
	},

	updateActiveThumbnail() {
		this.element.querySelectorAll('.lightbox-thumbnail-active').forEach((item) => {
			item.classList.remove('lightbox-thumbnail-active');
		});

		const activeThumbnail = this.element.querySelector(`[data-ref="${this.activeThumbnailRef}"]`);

		if (activeThumbnail) {
			activeThumbnail.classList.add('lightbox-thumbnail-active');
			scrollIntoView(activeThumbnail, { block: 'end', inline: 'nearest', behavior: 'smooth' });
		}
	},

	onScroll() {
		throttle(this, this.appendThumbnailsIfNeeded, 200);
	},

	appendThumbnailsIfNeeded() {
		const appendTreshold = thumbnailSize * this.displayedThumbnails.length - window.innerWidth - appendBuffer;

		if (this.element.scrollLeft > appendTreshold) {
			const newBatch = this.thumbnails.splice(0, displayedThumbnailsBatchSize);

			this.displayedThumbnails.pushObjects(newBatch);
			if (this.thumbnails.length === 0) {
				this.element.removeEventListener('scroll', this.onScroll);
			}
		}
	},

});
