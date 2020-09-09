import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { all, hashSettled, resolve } from 'rsvp';
import { getOwner } from '@ember/application';
import UserModel from './user';
import NavigationModel from './navigation';
import WikiVariablesModel from './wiki-variables';
import TrackingDimensionsModel from './tracking-dimensions';

export default EmberObject.extend({
  currentUser: service(),
  fastboot: service(),
  logger: service(),
  simpleStore: service(),

  fetch(title, uselangParam) {
    const currentUser = this.currentUser;
    const fastboot = this.fastboot;
    const shoebox = fastboot.get('shoebox');

    if (fastboot.get('isFastBoot')) {
      const protocol = fastboot.get('request.headers').get('fastly-ssl')
        ? 'https'
        : fastboot.get('request.protocol').replace(':', '');
      const host = fastboot.get('request.host');
      const accessToken = fastboot.get('request.cookies.access_token');
      const ownerInjection = getOwner(this).ownerInjection();
      const enableShopLinkReview = fastboot.get('request.queryParams.enableShopLinkReview')

      return all([
        WikiVariablesModel.create(ownerInjection).load(protocol, host, accessToken),
        UserModel.create(ownerInjection).getUserId(accessToken),
      ]).then(([wikiVariables, userId]) => {
        shoebox.put('userId', userId);

        const promises = {
          navigation: NavigationModel.create(ownerInjection).fetchAll(
            host,
            wikiVariables.id,
            uselangParam || wikiVariables.language.content,
            enableShopLinkReview,
          ),
        };

        if (!wikiVariables.isClosed && !wikiVariables.isEmptyDomainWithLanguageWikis) {
          promises.currentUser = currentUser.initializeUserData(userId, host);
          promises.trackingDimensions = TrackingDimensionsModel.create(ownerInjection).load(
            !userId,
            host,
            title,
          );
        }

        return hashSettled(promises)
          .then(({ navigation, trackingDimensions }) => {
            // We only want to fail application if we don't have the navigation data
            if (navigation.state === 'rejected') {
              throw navigation.reason;
            }

            const applicationData = {
              navigation: navigation.value,
              wikiVariables,
            };

            shoebox.put('applicationData', applicationData);

            if (trackingDimensions && trackingDimensions.state === 'fulfilled' && trackingDimensions.value.dimensions) {
              this.simpleStore.set('trackingDimensions', trackingDimensions.value.dimensions);
            }

            return applicationData;
          });
      });
    }

    currentUser.initializeUserData(shoebox.retrieve('userId'));
    return resolve(shoebox.retrieve('applicationData'));
  },
});
