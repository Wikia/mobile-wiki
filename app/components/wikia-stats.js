import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { track, trackActions } from '../utils/track';

export default Component.extend({
  i18n: service(),

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
        url: '/d/f',
        trackingLabel: 'discussions-clicked',
        value: this.get('model.discussions'),
      },
    ];
  }),

  @action
  trackClick(trackingLabel) {
    track({
      action: trackActions.click,
      category: 'main-page',
      label: trackingLabel,
    });
  },
});
