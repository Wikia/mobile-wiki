import { isArray } from '@ember/array';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Thumbnailer from '../modules/thumbnailer';
import { normalizeToUnderscore } from '../utils/string';

export default Component.extend({
  lightbox: service(),
  logger: service(),

  classNames: ['lightbox-media', 'lightbox-content-inner'],
  classNameBindings: ['isGallery'],
  // This is needed for keyDown event to work
  attributeBindings: ['tabindex'],

  tabindex: 0,
  videoPlayer: null,

  gestures: {
    /**
   * @returns {void}
   */
    swipeLeft() {
      if (this.isGallery) {
        this.nextMedia();
      }
    },

    /**
   * @returns {void}
   */
    swipeRight() {
      if (this.isGallery) {
        this.prevMedia();
      }
    },
  },

  setFooter() {},
  setThumbnails() {},
  updateGalleryRef() {},

  /**
  * gets current media or current media from gallery
  */
  currentMedia: computed('model', 'isGallery', 'currentGalleryRef', function () {
    const current = this.model;

    return this.isGallery ? current.items[this.currentGalleryRef] : current;
  }),

  currentGalleryRef: computed('model.galleryRef', {
    get() {
      return this.get('model.galleryRef') || 0;
    },

    set(key, value) {
      const galleryLength = this.galleryLength - 1;

      if (value < 0) {
        value = galleryLength;
      } else if (value > galleryLength) {
        value = 0;
      }

      this.updateGalleryRef(value);

      return value;
    },
  }),

  galleryLength: computed('isGallery', 'model', function () {
    return this.isGallery ? this.model.items.length : -1;
  }),

  /**
  * checks if current displayed media is a gallery
  */
  isGallery: computed('model', function () {
    return isArray(this.model.items);
  }),

  /**
  * checks if current media is a video or image and which lightbox component to render
  */
  lightboxComponent: computed('currentMedia', function () {
    const currentMedia = this.currentMedia;

    return currentMedia && currentMedia.url && currentMedia.type ? `lightbox-${currentMedia.type}` : null;
  }),

  // eslint-disable-next-line ember/no-observers
  currentMediaObserver: observer('currentMedia', function () {
    this.updateState();
  }),

  didInsertElement() {
    this._super(...arguments);

    this.updateState();
    this.updateThumbnails();
  },

  /**
  * @param {Event} event
  * @returns {void}
  */
  keyDown(event) {
    if (this.isGallery) {
      if (event.keyCode === 39) {
        // handle right arrow
        this.nextMedia();
      } else if (event.keyCode === 37) {
        // handle left arrow
        this.prevMedia();
      }
    }

    this._super(event);
  },

  /**
  * @returns {void}
  */
  nextMedia() {
    this.incrementProperty('currentGalleryRef');
  },

  /**
  * @returns {void}
  */
  prevMedia() {
    this.decrementProperty('currentGalleryRef');
  },

  /**
  * @returns {void}
  */
  updateState() {
    this.updateFooter();
    this.lightbox.set('file', normalizeToUnderscore(this.get('currentMedia.title')));
  },

  /**
  * @returns {void}
  */
  updateFooter() {
    const currentMedia = this.currentMedia;
    const footerHead = this.isGallery ? `${(this.currentGalleryRef + 1)}/${this.galleryLength}` : null;
    const footerLink = currentMedia.isLinkedByUser ? currentMedia.href : null;

    if (currentMedia && currentMedia.caption) {
      this.setFooter(htmlSafe(currentMedia.caption), footerHead, footerLink);
    } else {
      this.setFooter(null, footerHead, footerLink);
    }
  },

  updateThumbnails() {
    if (this.isGallery) {
      const thumbnails = this.model.items.map((item, index) => ({
        url: Thumbnailer.getThumbURL(
          item.url,
          { width: 40, height: 40, mode: Thumbnailer.mode.topCrop },
        ),
        ref: index,
        active: index === this.currentGalleryRef,
        isVideo: item.isVideo,
      }));

      this.setThumbnails(thumbnails);
    }
  },
});
