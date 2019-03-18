import Service, { inject as service } from '@ember/service';
import localStorageConnector from '@wikia/ember-fandom/utils/local-storage-connector';

export default Service.extend({
  fastboot: service(),
  wdsBannerNotifications: service(),
  wikiVariables: service(),

  afterMigrationClosedStorageKey: 'wikia-org-migration-after-closed',
  beforeMigrationClosedStorageKey: 'wikia-org-migration-before-closed',
  storageTrueValue: '1',
  // Keep it for a year, it's more than enough
  localStorageTTL: 60 * 60 * 24 * 365,

  shouldShowAfterMigrationNotification() {
    return this.wikiVariables.wikiaOrgMigrationNotificationAfter
      && localStorageConnector.getItem(
        this.afterMigrationClosedStorageKey,
      ) !== this.storageTrueValue;
  },

  shouldShowBeforeMigrationNotification() {
    return this.wikiVariables.wikiaOrgMigrationNotificationBefore
      && localStorageConnector.getItem(
        this.beforeMigrationClosedStorageKey,
      ) !== this.storageTrueValue;
  },

  showAfterMigrationNotification() {
    this.wdsBannerNotifications.addNotification({
      type: 'warning',
      alreadySafeHtml: this.wikiVariables.wikiaOrgMigrationNotificationAfter,
      disableAutoHide: true,
      onClose: () => {
        localStorageConnector.setItem(
          this.afterMigrationClosedStorageKey,
          this.storageTrueValue,
        );
      },
    });
  },

  showBeforeMigrationNotification() {
    this.wdsBannerNotifications.addNotification({
      type: 'warning',
      alreadySafeHtml: this.wikiVariables.wikiaOrgMigrationNotificationBefore,
      disableAutoHide: true,
      onClose: () => {
        localStorageConnector.setItem(
          this.beforeMigrationClosedStorageKey,
          this.storageTrueValue,
        );
      },
    });
  },

  showNotification() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    if (this.shouldShowAfterMigrationNotification()) {
      this.showAfterMigrationNotification();
    } else if (this.shouldShowBeforeMigrationNotification()) {
      this.showBeforeMigrationNotification();
    }
  },
});
