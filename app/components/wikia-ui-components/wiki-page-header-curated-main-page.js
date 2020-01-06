import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { track, trackActions } from '../../utils/track';

export default Component.extend(
  {
    wikiUrls: service(),
    wikiVariables: service(),

    classNames: ['wiki-page-header-curated-main-page'],

    mainPageTitle: reads('wikiVariables.mainPageTitle'),
    siteName: reads('wikiVariables.siteName'),

    mainPageEditorUrl: computed(function () {
      return this.wikiUrls.build({
        host: this.wikiVariables.host,
        path: '/main/edit',
      });
    }),

    @action
    trackClick(trackingLabel) {
      track({
        action: trackActions.click,
        category: 'main-page',
        label: trackingLabel,
      });
    },
  },
);
