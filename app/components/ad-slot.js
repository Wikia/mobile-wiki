import Component from '@ember/component';
import { computed, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { dasherize } from '@ember/string';
import InViewportMixin from 'ember-in-viewport';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
  RenderComponentMixin,
  InViewportMixin,
  {
    ads: service('ads/ads'),

    classNames: ['ad-slot-wrapper'],
    classNameBindings: ['nameLowerCase', 'noAds'],
    // This component is created dynamically, and this won't work without it
    layoutName: 'components/ad-slot',
    disableManualInsert: false,
    insertOnViewportEnter: false,
    isAboveTheFold: false,
    name: null,
    adEngine3ClassName: 'gpt-ad',
    pageHasFeaturedVideo: false,

    nameLowerCase: computed('name', function () {
      return dasherize((this.name || '').toLowerCase());
    }),

    shouldWaitForUapResponse: computed('pageHasFeaturedVideo', 'isAboveTheFold', 'name', function () {
      return !this.pageHasFeaturedVideo && !this.isAboveTheFold;
    }),

    didInsertElement() {
      this._super(...arguments);

      if (this.disableManualInsert) {
        return;
      }

      setProperties(this, {
        viewportTolerance: {
          top: 200,
          bottom: 200,
          left: 0,
          right: 0,
        },
        intersectionThreshold: 0,
      });

      this.pushSlotToQueue();
    },

    /**
     * @returns {void}
     */
    didEnterViewport() {
      const ads = this.get('ads.module');
      const name = this.name;

      if (this.insertOnViewportEnter) {
        ads.pushSlotToQueue(name);
      } else if (this.shouldWaitForUapResponse) {
        ads.waitForUapResponse(
          () => ads.pushSlotToQueue(this.name),
          () => {},
        );
      }
    },

    /**
     * @private
     */
    pushSlotToQueue() {
      const ads = this.get('ads.module');

      if (this.insertOnViewportEnter) {
        return;
      }

      if (this.shouldWaitForUapResponse) {
        ads.waitForUapResponse(
          () => {},
          () => ads.pushSlotToQueue(this.name),
        );
      } else {
        ads.pushSlotToQueue(this.name);
      }
    },
  },
);
