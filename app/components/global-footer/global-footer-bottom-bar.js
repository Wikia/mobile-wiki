import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  runtimeConfig: service(),
  wikiVariables: service(),

  tagName: '',

  actions: {
    fullSiteClicked() {
      this.track('full-site-link');
      window.Cookies.set('useskin', this.getWithDefault('wikiVariables.defaultSkin', 'oasis'), {
        domain: this.runtimeConfig.cookieDomain,
        path: '/',
      });

      window.location.reload();
    },
  },
});
