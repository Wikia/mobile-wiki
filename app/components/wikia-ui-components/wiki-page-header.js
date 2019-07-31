/**
  * Wiki Page Header reusable component usage:
  *
  * @example
  * {{wikia-ui-components/wiki-page-header isMainPage=true}}
  *
  * @example
  * {{wikia-ui-components/wiki-page-header title=<title>}}
  *
  * @example
  * {{wikia-ui-components/wiki-page-header
  *   title=<title>
  *   subtitle=<subtitle>
  *   heroImage=<hero image url>}}
*/

import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { track, trackActions } from '../../utils/track';

export default Component.extend(
  {
    lightbox: service(),
    wikiVariables: service(),
    wikiUrls: service(),
    classNames: ['wiki-page-header'],
    classNameBindings: ['heroImage:has-hero-image'],
    isMainPage: false,
    siteName: reads('wikiVariables.siteName'),
    mainPageTitle: reads('wikiVariables.mainPageTitle'),
    editUrl: computed('wikiVariables.host', 'title', function() {
      return this.wikiUrls.build({
        host: this.get('wikiVariables.host'),
        forceNoSSLOnServerSide: true,
        path: '/wiki/Special:MobileVisualEditor',
        query: {
          page: this.title,
          useskin: 'oasis',
        },
      });
    }),

    actions: {
      trackClick() {
        track({
          action: trackActions.click,
          category: 'wikiname',
          label: '',
        });
      },

      heroImageClick() {
        this.lightbox.open('media', this.heroImage);

        return false;
      },
    },
  },
);
