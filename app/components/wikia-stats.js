import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { track, trackActions } from '../utils/track';

export default Component.extend({
  i18n: service(),
  wikiVariables: service(),

  classNames: ['wikia-stats'],

  items: computed('model', function () {
    return [
      {
        label: this.i18n.t('app.pages-label'),
        value: this.get('model.articles'),
      },
      {
        label: this.i18n.t('app.photos-label'),
        value: this.get('model.images'),
      },
      {
        label: this.i18n.t('app.videos-label'),
        value: this.get('model.videos'),
      },
      {
        label: this.i18n.t('app.discussions-label'),
        url: `${this.get('wikiVariables.scriptPath')}/f`,
        trackingLabel: 'discussions-clicked',
        value: this.get('model.discussions'),
      },
    ];
  }),
  actions: {
    trackClick(trackingLabel) {
      track({
        action: trackActions.click,
        category: 'main-page',
        label: trackingLabel,
      });
    },
  },
});
