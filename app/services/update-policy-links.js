import Service, { inject as service } from '@ember/service';
import localStorageConnector from '@wikia/ember-fandom/utils/local-storage-connector';

/**
 * Note: this file is not used anymore, but it is still in the repo when we will need to add a similar notification again.
 */

export default Service.extend({
  fastboot: service(),
  wdsBannerNotifications: service(),

  updatePolicyHtml: 'Please take notice that we have updated our'
    + ' <a href="www.fandom.com/privacy-policy">privacy policy</a>,'
    + ' <a href="www.fandom.com/terms-of-use">terms of use</a> and'
    + ' <a href="www.fandom.com/terms-of-sale">terms of sale</a>'
    + ' to (a) provide greater transparency around the ways we collect,'
    + ' process, and use personal information, and to implement the requirements'
    + ' of the California Consumer Privacy Act (CCPA), and (b) to'
    + ' create a single privacy policy, terms of use and terms of sale'
    + ' across all of our properties. These changes went into effect on January 1, 2020.',
  updatePolicyKey: 'fandom-update-policy-links',
  storageTrueValue: '1',
  // Keep it for a year, it's more than enough
  localStorageTTL: 60 * 60 * 24 * 365,

  shouldShowPolicyNotification() {
    return localStorageConnector.getItem(
      this.updatePolicyKey,
    ) !== this.storageTrueValue;
  },

  showPolicyNotification() {
    this.wdsBannerNotifications.addNotification({
      type: 'message',
      alreadySafeHtml: this.updatePolicyHtml,
      disableAutoHide: true,
      onClose: () => {
        localStorageConnector.setItem(
          this.updatePolicyKey,
          this.storageTrueValue,
        );
      },
    });
  },

  showNotification() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    if (this.shouldShowPolicyNotification()) {
      this.showPolicyNotification();
    }
  },
});
