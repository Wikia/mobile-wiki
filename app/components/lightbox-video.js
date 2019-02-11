import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import RespondsToResize from 'ember-responds-to/mixins/responds-to-resize';
import VideoLoader from '../modules/video-loader';

/**
  * Component that is used inside ligthbox-media component
  * to handle displaying video
*/
export default Component.extend(
  RespondsToResize,
  {
    ads: service('ads/ads'),

    classNames: ['lightbox-video', 'lightbox-content-inner'],
    classNameBindings: ['provider'],
    wrapperClass: '.video-player-wrapper',

    /**
      * @returns string
    */
    provider: computed('videoLoader', function () {
      const videoLoader = this.videoLoader;

      return `video-provider-${videoLoader.getProviderName()}`;
    }),

    /**
      * @returns VideoLoader
    */
    videoLoader: computed('model.embed', 'ads.noAds', function () {
      return new VideoLoader(this.get('model.embed'), this.get('ads.noAds'));
    }),

    /**
      * @returns {void}
    */
    didRender() {
      this._super(...arguments);

      this.insertVideoPlayerHtml();
      this.initVideoPlayer();
    },

    /**
     * Unbind all click events
     *
     * @returns {void}
    */
    willDestroyElement() {
      this.element.querySelector(this.wrapperClass).removeEventListener('click', this.preventDefault);
    },

    /**
     * Used to instantiate a video player
     *
     * @returns {void}
    */
    initVideoPlayer() {
      const videoLoader = this.videoLoader;

      /**
        * This loads and creates a player
      */
      videoLoader.loadPlayerClass();

      // Stop bubbling it up to the lightbox
      this.element.querySelector(this.wrapperClass).addEventListener('click', this.preventDefault);
    },

    preventDefault() {
      return false;
    },

    resize() {
      if (this.videoLoader) {
        this.videoLoader.onResize();
      }
    },

    /**
     * Since we don't use Ember to inject video HTML
     *
     * Video code does interact with the DOM and brakes binding for Ember templates
     * therefore whenever video changes in lightbox
     * Ember would not know what to update
     *
     * because of that we have to manage it manually
     *
     * @returns {void}
     */
    insertVideoPlayerHtml() {
      this.element.querySelector(this.wrapperClass).innerHTML = this.get('model.embed.html');
    },
  },
);
