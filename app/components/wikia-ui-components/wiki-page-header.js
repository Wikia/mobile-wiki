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

import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { track, trackActions } from '../../utils/track';

export default Component.extend(
  {
    lightbox: service(),
    wikiVariables: service(),
    classNames: ['wiki-page-header'],
    classNameBindings: ['heroImage:has-hero-image'],
    isMainPage: false,
    siteName: reads('wikiVariables.siteName'),
    mainPageTitle: reads('wikiVariables.mainPageTitle'),

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
