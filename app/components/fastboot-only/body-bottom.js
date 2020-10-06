import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  runtimeConfig: service(),
  wikiUrls: service(),
  currentUser: service(),
  fastboot: service(),
  tracking: service(),
  simpleStore: service(),
  wikiVariables: service(),
  tagName: '',
  layoutName: 'components/fastboot-only/body-bottom',

  data: computed(function () {
    const cookieDomain = this.runtimeConfig.cookieDomain;
    const currentUser = this.currentUser;
    // We have to anonymize user id before sending it to Google
    // It's faster to do the hashing server side and pass to the front-end, ready to use
    const gaUserIdHash = currentUser.getGaUserIdHash();
    const userId = currentUser.userId;
    const noExternals = this.runtimeConfig.noExternals;
    const tracking = this.get('tracking.config');
    const isAuthenticated = currentUser.get('isAuthenticated');
    const wikiaEnv = this.runtimeConfig.wikiaEnv;
    const simpleStore = this.simpleStore.getProperties(
      'trackingDimensions',
      'articleId',
      'namespace',
      'isMainPage',
    );
    const wikiVariables = this.wikiVariables.getProperties(
      'cacheBuster',
      'cdnRootUrl',
      'dbName',
      'id',
      'language',
      'qualarooUrl',
      'isTestWiki',
      'scriptPath',
    );

    return JSON.stringify(Object.assign({
      cookieDomain,
      gaUserIdHash,
      userId,
      noExternals,
      tracking,
      isAuthenticated,
      wikiaEnv,
      wikiVariables,
    }, simpleStore));
  }),

  asyncScriptsPath: computed(function () {
    const langPath = this.get('wikiUrls.langPath');
    const path = '/load.php?modules=abtesting,abtest&only=scripts';

    return langPath ? `${langPath}${path}` : path;
  }),
});
