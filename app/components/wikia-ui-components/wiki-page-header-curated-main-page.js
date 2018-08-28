import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { track, trackActions } from '../../utils/track';

export default Component.extend(
  {
    classNames: ['wiki-page-header-curated-main-page'],

    wikiUrls: service(),
    wikiVariables: service(),

    mainPageEditorUrl: computed(function () {
      return this.wikiUrls.build({
        host: this.wikiVariables.host,
        path: '/main/edit'
      });
    }),
    mainPageTitle: reads('wikiVariables.mainPageTitle'),
    siteName: reads('wikiVariables.siteName'),

    actions: {
      trackClick(trackingLabel) {
        track({
          action: trackActions.click,
          category: 'main-page',
          label: trackingLabel,
        });
      },
    },
  },
);
