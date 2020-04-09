import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { all } from 'rsvp';
import { isArray } from '@ember/array';
import fetch from 'fetch';
import config from '../config/environment';
import extend from '../utils/extend';
import { getQueryString } from '../utils/url';
import {
  UserLoadDetailsFetchError,
  UserLoadInfoFetchError,
} from '../utils/errors';

export default EmberObject.extend({
  defaultAvatarSize: 100,
  logger: service(),
  wikiUrls: service(),
  wikiVariables: service(),
  runtimeConfig: service(),
  fetchService: service('fetch'),
  tracing: service(),

  getUserId(accessToken) {
    if (!accessToken) {
      return null;
    }

    const queryString = getQueryString({
      code: accessToken,
    });

    return fetch(`${this.runtimeConfig.heliosInternalUrl}${queryString}`, {
      headers: {
        'X-Wikia-Internal-Request': config.appName,
        'X-Trace-Id': this.tracing.getTraceId(true),
      },
      timeout: config.APP.heliosTimeout,
    }).then((response) => {
      if (response.ok) {
        return response.json().then(data => data.user_id);
      }
      if (response.status === 401) {
        this.logger.info('Token not authorized by Helios');
      } else {
        this.logger.error('Helios connection error: ', response);
      }

      return null;
    }).catch((reason) => {
      if (reason.type === 'request-timeout') {
        this.logger.error('Helios timeout error: ', reason);
      } else {
        this.logger.error('Helios connection error: ', reason);
      }
      return null;
    });
  },

  /**
  * @param {UserModelFindParams} params
  * @returns {RSVP.Promise<UserModel>}
  */
  find(params) {
    const avatarSize = params.avatarSize || this.defaultAvatarSize;
    const userId = params.userId;
    const host = params.host;
    const accessToken = params.accessToken || '';

    return all([
      this.loadDetails(host, userId, avatarSize),
      this.loadUserInfo(host, accessToken, userId),
    ]).then(([userDetails, userInfo]) => {
      const userLanguage = userInfo && userInfo.query.userinfo.options.language;

      let out = {
        avatarPath: null,
        name: null,
        powerUserTypes: null,
        rights: null,
      };

      if (userDetails) {
        out = extend(out, this.sanitizeDetails(userDetails));
      }

      if (userLanguage) {
        out.language = userLanguage;
      }

      if (userInfo) {
        const rights = this.getUserRights(userInfo);

        if (rights) {
          out.rights = rights;
        }
      }

      return out;
    });
  },

  /**
  * @param {string} host
  * @param {number} userId
  * @param {number} avatarSize
  * @returns {RSVP.Promise}
  */
  loadDetails(host, userId, avatarSize) {
    const url = this.wikiUrls.build({
      host,
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'UserApi',
        method: 'getDetails',
        ids: userId,
        size: avatarSize,
      },
    });

    return this.fetchService.fetchFromMediawiki(url, UserLoadDetailsFetchError)
      .then((result) => {
        if (isArray(result.items)) {
          return result.items[0];
        }
        throw new Error(result);
      });
  },

  /**
  * @param {string} host
  * @param {string} accessToken
  * @param {number} userId
  * @returns {RSVP.Promise<QueryUserInfoResponse>}
  */
  loadUserInfo(host, accessToken, userId) {
    const url = this.wikiUrls.build({
      host,
      forceNoSSLOnServerSide: true,
      path: '/api.php',
      query: {
        action: 'query',
        meta: 'userinfo',
        uiprop: 'rights|options',
        format: 'json',
        ids: userId,
      },
    });

    return this.fetchService.fetchFromMediaWikiAuthenticated(url, accessToken,
      UserLoadInfoFetchError);
  },

  /**
  * @param {*} userData
  * @returns {Object}
  */
  sanitizeDetails(userData) {
    return {
      name: userData.name,
      avatarPath: userData.avatar,
      profileUrl: this.wikiUrls.build({
        host: this.get('wikiVariables.host'),
        namespace: 'User',
        title: userData.name,
      }),
      isSubjectToCoppa: !!userData.is_subject_to_coppa,
    };
  },

  /**
  * @param {{query: {userinfo: {rights: array}}}} query
  * @returns {Object}
  */
  getUserRights({ query }) {
    const rights = {};
    const rightsArray = query.userinfo.rights;

    if (isArray(rightsArray)) {
      // TODO - we could use contains instead of making an object out of an array
      rightsArray.forEach((right) => {
        rights[right] = true;
      });

      return rights;
    }

    return undefined;
  },
});
