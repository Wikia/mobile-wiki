import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import { track, trackActions } from '../utils/track';

export default Component.extend(
  {
    wikiVariables: service(),
    geo: service(),

    tagName: '',

    url: oneWay('wikiVariables.watchShowURL'),
    buttonLabel: oneWay('wikiVariables.watchShowButtonLabel'),

    isVisible: computed('url', function () {
      return this.url && this.buttonLabel && this.geo.country === 'US';
    }),

    didInsertElement() {
      this._super(...arguments);

      track({
        action: trackActions.impression,
        category: 'article',
        label: 'watch-hulu',
      });
    },

    trackClick() {
      track({
        action: trackActions.click,
        category: 'article',
        label: 'watch-hulu',
      });
    },
  },
);
