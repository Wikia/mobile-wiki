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
import { action } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend(
  {
    lightbox: service(),
    wikiVariables: service(),
    classNames: ['wiki-page-header'],
    classNameBindings: ['heroImage:has-hero-image'],
    isMainPage: false,
    siteName: reads('wikiVariables.siteName'),

    @action
    heroImageClick(event) {
      event.preventDefault();
      this.lightbox.open('media', this.heroImage);
    },
  },
);
