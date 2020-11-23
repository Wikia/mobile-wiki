import Service, { inject as service } from '@ember/service';
import localStorageConnector from '@wikia/ember-fandom/utils/local-storage-connector';

export default Service.extend({
  fastboot: service(),
  wdsBannerNotifications: service(),
  wikiVariables: service(),

  afterMigrationClosedStorageKey: 'wikia-org-migration-after-closed',
  beforeMigrationClosedStorageKey: 'wikia-org-migration-before-closed',
  afterFandomComMigrationClosedStorageKey: 'fandom-com-migration-after-closed',
  beforeFandomComMigrationClosedStorageKey: 'fandom-com-migration-before-closed',
  ucpMigrationBannerIncompleteClosedStorageKey: 'ucp-migration-banner-incomplete-closed',
  ucpMigrationBannerCompleteClosedStorageKey: 'ucp-migration-banner-complete-closed',
  ucpDomainMigrationScheduledMessageKey: 'ucp-migration-banner-fandom-message-scheduled-fandom-wikis',
  ucpDomainMigrationDoneMessageKey: 'ucp-migration-banner-fandom-message-complete',
  storageTrueValue: '1',

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

  shouldShowUCPMigrationCompleteNotification() {
    return this.wikiVariables.ucpMigrationComplete && this.wikiVariables.ucpMigrationBannerMessage
      && localStorageConnector.getItem(
        this.ucpMigrationBannerCompleteClosedStorageKey,
      ) !== this.storageTrueValue;
  },

  shouldShowUCPMigrationIncompleteNotification() {
    return !this.wikiVariables.ucpMigrationComplete && this.wikiVariables.ucpMigrationBannerMessage
      && localStorageConnector.getItem(
        this.ucpMigrationBannerIncompleteClosedStorageKey,
      ) !== this.storageTrueValue;
  },

  shouldShowAfterFandomComMigrationNotification() {
    return this.wikiVariables.fandomComMigrationNotificationAfter
      && localStorageConnector.getItem(
        this.afterFandomComMigrationClosedStorageKey,
      ) !== this.storageTrueValue;
  },

  shouldShowBeforeFandomComMigrationNotification() {
    return this.wikiVariables.fandomComMigrationNotificationBefore
      && localStorageConnector.getItem(
        this.beforeFandomComMigrationClosedStorageKey,
      ) !== this.storageTrueValue;
  },


  shouldShowGamepediaDomainMigrationNotification() {
    return (this.wikiVariables.domainMigrationScheduled
      && localStorageConnector.getItem(
        this.ucpDomainMigrationScheduledMessageKey,
      ) !== this.storageTrueValue) || (this.wikiVariables.domainMigrationDone
      && localStorageConnector.getItem(
        this.ucpDomainMigrationDoneMessageKey,
      ) !== this.storageTrueValue);
  },

  showMigrationNotification(message, storageKey) {
    this.wdsBannerNotifications.addNotification({
      type: 'warning',
      alreadySafeHtml: message,
      disableAutoHide: true,
      onClose: () => {
        localStorageConnector.setItem(
          storageKey,
          this.storageTrueValue,
        );
      },
    });
  },

  showNotification() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    // Fandom.com migration banners
    if (this.shouldShowAfterFandomComMigrationNotification()) {
      this.showMigrationNotification(
        this.wikiVariables.fandomComMigrationNotificationAfter,
        this.afterFandomComMigrationClosedStorageKey,
      );
    } else if (this.shouldShowBeforeFandomComMigrationNotification()) {
      this.showMigrationNotification(
        this.wikiVariables.fandomComMigrationNotificationBefore,
        this.beforeFandomComMigrationClosedStorageKey,
      );
    }

    // Wikia.org migration banners
    if (this.shouldShowAfterMigrationNotification()) {
      this.showMigrationNotification(
        this.wikiVariables.wikiaOrgMigrationNotificationAfter,
        this.afterMigrationClosedStorageKey,
      );
    } else if (this.shouldShowBeforeMigrationNotification()) {
      this.showMigrationNotification(
        this.wikiVariables.wikiaOrgMigrationNotificationBefore,
        this.beforeMigrationClosedStorageKey,
      );
    }

    // UCP migration banners
    if (this.shouldShowUCPMigrationIncompleteNotification()) {
      this.showMigrationNotification(
        this.wikiVariables.ucpMigrationBannerMessage,
        this.ucpMigrationBannerIncompleteClosedStorageKey,
      );
    } else if (this.shouldShowUCPMigrationCompleteNotification()) {
      this.showMigrationNotification(
        this.wikiVariables.ucpMigrationBannerMessage,
        this.ucpMigrationBannerCompleteClosedStorageKey,
      );
    }

    // Gamepedia domain migration
    if (this.shouldShowGamepediaDomainMigrationNotification()) {
      let storageKey = this.ucpDomainMigrationScheduledMessageKey;
      if (this.wikiVariables.domainMigrationDone) {
        storageKey = this.ucpDomainMigrationDoneMessageKey;
      }
      this.showMigrationNotification(
        this.wikiVariables.domainMigrationBannerMessage,
        storageKey,
      );
    }
  },
});
