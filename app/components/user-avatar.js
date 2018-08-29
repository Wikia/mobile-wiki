import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  i18n: service(),
  wikiUrls: service(),
  wikiVariables: service(),

  classNames: ['user-avatar'],
  shouldWrapInHref: true,

  profileName: computed('username', function () {
    const userName = this.username || '';

    return userName.trim();
  }),
  /**
  * Returns link to the post author's user page
  * @returns {string}
  */
  profileUrl: computed('profileName', function () {
    return this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      namespace: 'User',
      title: this.profileName,
    });
  }),
  displayName: computed('profileName', function () {
    return this.anonymous ? this.i18n.t('app.username-anonymous') : this.profileName;
  }),
});
