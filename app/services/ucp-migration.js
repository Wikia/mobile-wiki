import Service, { inject as service } from '@ember/service';
import localStorageConnector from '@wikia/ember-fandom/utils/local-storage-connector';

export default Service.extend({
  fastboot: service(),
  wdsBannerNotifications: service(),
  wikiVariables: service(),

  ucpMigrationBannerClosedStorageKey: 'ucp-migration-banner-closed',
  storageTrueValue: '1',
  // Keep it for a year, it's more than enough
  localStorageTTL: 60 * 60 * 24 * 365,

  shouldShowUCPMigrationNotification() {
    return this.wikiVariables.ucpMigrationBannerMessage
      && localStorageConnector.getItem(
        this.ucpMigrationBannerClosedStorageKey,
      ) !== this.storageTrueValue;
  },

  showUCPMigrationNotification() {
    this.wdsBannerNotifications.addNotification({
      type: 'warning',
      alreadySafeHtml: this.wikiVariables.ucpMigrationBannerMessage,
      disableAutoHide: true,
      onClose: () => {
        localStorageConnector.setItem(
          this.ucpMigrationBannerClosedStorageKey,
          this.storageTrueValue,
        );
      },
    });
  },

  showNotification() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    if (this.shouldShowUCPMigrationNotification()) {
      this.showUCPMigrationNotification();
    }
  },
});
