import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { computed, observer } from '@ember/object';
import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import RespondsToResize from 'ember-responds-to/mixins/responds-to-resize';
import ImageLoader from '../mixins/image-loader';

export default Component.extend(
  RespondsToResize,
  ImageLoader,
  {
    classNames: ['lightbox-image', 'lightbox-content-inner'],
    maxZoom: 5,
    newX: 0,
    newY: 0,
    lastX: 0,
    lastY: 0,
    lastScale: 1,
    scale: 1,

    loadingError: false,

    gestures: {
      /**
    * @returns {boolean}
    */
      swipeLeft() {
        return !this.isZoomed;
      },

      /**
    * @returns {boolean}
    */
      swipeRight() {
        return !this.isZoomed;
      },

      /**
    * @param {HammerInput} event
    * @returns {void}
    */
      pan(event) {
        const scale = this.scale;

        this.setProperties({
          limitedNewX: this.lastX + event.deltaX / scale,
          limitedNewY: this.lastY + event.deltaY / scale,
        });

        this.notifyPropertyChange('style');
      },

      /**
    * @returns {void}
    */
      panEnd() {
        this.setProperties({
          lastX: this.newX,
          lastY: this.newY,
        });
      },

      /**
    * @param {HammerInput} event
    * @returns {void}
    */
      doubleTap(event) {
        // Allow tap-to-zoom everywhere on non-galleries and in the center area for galleries
        if (
          !this.isZoomed
     && (!this.isGallery || this.getScreenArea(event) === this.screenAreas.center)
        ) {
          const scale = 3;

          this.setProperties({
            limitedScale: scale,
            lastScale: scale,
          });
        } else {
          this.resetZoom();
        }

        this.notifyPropertyChange('style');
      },

      /**
    * @param {HammerInput} event
    * @returns {void}
    */
      pinchMove(event) {
        const scale = this.scale;

        this.setProperties({
          limitedScale: this.lastScale * event.scale,
          limitedNewX: this.lastX + event.deltaX / scale,
          limitedNewY: this.lastY + event.deltaY / scale,
        });

        this.notifyPropertyChange('style');
      },

      /**
    * @param {HammerInput} event
    * @returns {void}
    */
      pinchEnd(event) {
        this.set('lastScale', this.lastScale * event.scale);
      },
    },

    isZoomed: gt('scale', 1),

    /**
   * This is performance critical place,
   * we will update property 'manually' by calling notifyPropertyChange
   */
    style: computed(function () {
      const scale = this.scale.toFixed(2);
      const x = this.newX.toFixed(2);
      const y = this.newY.toFixed(2);
      const transform = `transform: scale(${scale}) translate3d(${x}px,${y}px,0);`;

      return htmlSafe(`-webkit-${transform}${transform}`);
    }),

    viewportSize: computed(function () {
      return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      };
    }),

    /**
   * calculates current scale for zooming
   */
    limitedScale: computed('scale', {
      get() {
        return this.scale;
      },

      set(key, value) {
        let scale = 1;

        if (value >= 1) {
          scale = Math.min(this.maxZoom, value);
        }

        this.set('scale', scale);

        return value;
      },
    }),

    /**
   * property that holds current image
   */
    image: computed(function () {
      return this.element.querySelector('.current');
    }),

    imageWidth: computed('image', 'scale', function () {
      const image = this.image;

      let imageWidth = 0;

      if (image) {
        imageWidth = image.offsetWidth * this.scale;
      }

      return imageWidth;
    }),

    imageHeight: computed('image', 'scale', function () {
      const image = this.image;

      let imageHeight = 0;

      if (image) {
        imageHeight = image.offsetHeight * this.scale;
      }

      return imageHeight;
    }),

    /**
   * used to set X boundaries for panning image in media lightbox
   */
    maxX: computed('viewportSize', 'imageWidth', 'scale', function () {
      return Math.abs(this.get('viewportSize.width') - this.imageWidth) / 2 / this.scale;
    }),

    /**
   * used to set Y boundaries for panning image in media lightbox
   */
    maxY: computed('viewportSize', 'imageHeight', 'scale', function () {
      return Math.abs(this.viewportSize.height - this.imageHeight) / 2 / this.scale;
    }),

    /**
   * calculates X for panning with respect to maxX
   */
    limitedNewX: computed('newX', 'viewportSize', 'imageWidth', {
      get() {
        return this.newX;
      },

      set(key, value) {
        let newX = 0;

        if (this.imageWidth > this.get('viewportSize.width')) {
          newX = this.limit(value, this.maxX);
        }

        this.set('newX', newX);

        return value;
      },
    }),

    /**
   * calculates Y for panning with respect to maxY
   */
    limitedNewY: computed('newY', 'viewportSize', 'imageHeight', {
      get() {
        return this.newY;
      },

      set(key, value) {
        let newY = 0;

        if (this.imageHeight > this.get('viewportSize.height')) {
          newY = this.limit(value, this.maxY);
        }

        this.set('newY', newY);

        return value;
      },
    }),

    // eslint-disable-next-line ember/no-observers
    urlObserver: observer('model.url', function () {
      this.loadUrl();
    }),

    init() {
      this._super(...arguments);

      // Easy to port if we find a way to use enum here
      this.screenAreas = {
        left: 0,
        center: 1,
        right: 2,
      };
    },

    /**
   * @returns {void}
   */
    didInsertElement() {
      this._super(...arguments);

      const hammerInstance = this._hammerInstance;

      hammerInstance.get('pinch').set({
        enable: true,
      });

      hammerInstance.get('pan').set({
        direction: Hammer.DIRECTION_ALL,
      });

      scheduleOnce('afterRender', this, this.loadUrl);
    },

    resize() {
      this.notifyPropertyChange('viewportSize');
      this.notifyPropertyChange('imageWidth');
      this.notifyPropertyChange('imageHeight');
    },

    /**
   * @returns {void}
   */
    loadUrl() {
      const url = this.get('model.url');

      this.setProperties({
        imageSrc: `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg'
       viewBox='-12 -12 48 48' fill='%23fff' width='${this.get('model.width')}'
       height='${this.get('model.height')}'%3e%3cg fill-rule='evenodd'%3e%3cpath
       d='M3 4h18v8.737l-3.83-3.191a.916.916 0 0 0-1.282.108l-4.924 5.744-3.891-3.114a.92.92 0 0
       0-1.146 0L3 14.626V4zm19-2H2a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V3a1 1 0 0 0-1-
       1z'/%3e%3cpath d='M9 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2'/%3e%3c/g%3e%3c/svg%3e`,
        isLoading: true,
      });

      if (url) {
        this.load(url).then((imageSrc) => {
          this.update(imageSrc);
        }).catch(() => {
          this.update('', true);
        });
      }

      this.resetZoom();
    },

    /**
   * Handle click and prevent bubbling
   * if the image is zoomed
   *
   * @returns {boolean}
   */
    click() {
      return !this.isZoomed;
    },

    /**
   * returns limited value for given max ie.
   * value = 5, max = 6, return 5
   * value = 6, max = 3, return 3
   * value = -5, max = -6, return -5
   * value = -6, max = -3, return -3
   *
   * @param {number} value
   * @param {number} max
   * @returns {number}
   */
    limit(value, max) {
      if (value < 0) {
        return Math.max(value, -max);
      }
      return Math.min(value, max);
    },

    /**
   * @returns {void}
   */
    resetZoom() {
      this.setProperties({
        scale: 1,
        lastScale: 1,
        newX: 0,
        newY: 0,
        lastX: 0,
        lastY: 0,
      });
    },

    /**
   * Updates img with its src or displays error
   *
   * @param {string} imageSrc
   * @param {boolean} [loadingError=false]
   * @returns {void}
   */
    update(imageSrc, loadingError = false) {
      if (!this.isDestroyed) {
        this.setProperties({
          imageSrc,
          isLoading: false,
          loadingError,
        });
      }
    },

    /**
   * Checks on which area on the screen an event took place
   *
   * @param {HammerInput} event
   * @returns {number}
   */
    getScreenArea(event) {
      const viewportWidth = this.get('viewportSize.width');
      const x = event.center.x;
      const thirdPartOfScreen = viewportWidth / 3;

      if (x < thirdPartOfScreen) {
        return this.screenAreas.left;
      }
      if (x > viewportWidth - thirdPartOfScreen) {
        return this.screenAreas.right;
      }
      return this.screenAreas.center;
    },
  },
);
