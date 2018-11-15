import Component from '@ember/component';
import { computed, setProperties } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { dasherize } from '@ember/string';
import InViewportMixin from 'ember-in-viewport';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
  RenderComponentMixin,
  InViewportMixin,
  {
    ads: service(),

    classNames: ['ad-slot-wrapper'],
    classNameBindings: ['nameLowerCase', 'noAds'],
    // This component is created dynamically, and this won't work without it
    layoutName: 'components/ad-slot',
    disableManualInsert: false,
    isAboveTheFold: false,
    name: null,
    adEngine3ClassName: 'gpt-ad',
    pageHasFeaturedVideo: false,

    noAds: readOnly('ads.noAds'),

    nameLowerCase: computed('name', function () {
      return dasherize(this.name.toLowerCase());
    }),

    shouldWaitForUapResponse: computed('pageHasFeaturedVideo', 'isAboveTheFold', 'name', function () {
      return !this.pageHasFeaturedVideo && !this.isAboveTheFold;
    }),

    didInsertElement() {
      this._super(...arguments);

      const ads = this.get('ads.module');
      const name = this.name;

      if (this.disableManualInsert) {
        return;
      }

      if (this.noAds) {
        return;
      }

      if (this.shouldWaitForUapResponse) {
        ads.waitForUapResponse(
          () => {},
          () => {
            ads.pushSlotToQueue(name);
          },
        );
      } else {
        ads.pushSlotToQueue(name);
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
    },

    willDestroyElement() {
      const name = this.name;

      this.get('ads.module').removeSlot(name);
    },

    /**
   * @returns {void}
   */
    didEnterViewport() {
      const ads = this.get('ads.module');
      const name = this.name;

      if (this.noAds) {
        return;
      }

      if (this.shouldWaitForUapResponse) {
        ads.waitForUapResponse(
          () => {
            ads.pushSlotToQueue(name);
          },
          () => {},
        );
      }
    },
  },
);
