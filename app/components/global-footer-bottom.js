import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';
import { track, trackActions } from '../utils/track';

export default Component.extend({
  runtimeConfig: service(),

  @action
  fullSiteClicked() {
    track({
      action: trackActions.click,
      category: 'footer',
      label: 'full-site-link',
    });

    window.Cookies.set('useskin', this.getWithDefault('wikiVariables.defaultSkin', 'oasis'), {
      domain: this.runtimeConfig.cookieDomain,
      path: '/',
    });

    window.location.reload();
  },
});
