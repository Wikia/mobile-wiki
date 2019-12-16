import { readOnly } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import Cookies from 'js-cookie';

import { system } from '../utils/browser';
import { AffiliatesFetchError } from '../utils/errors';
import extend from '../utils/extend';

/**
  * @typedef {Object} AffiliateTargeting
  * @property {string[]} campaign
  * @property {string[]} category
  * @property {string[]} unit
  * @property {number[]} query
  * @property {number[]} wikiId
*/
import searchPageTargeting from './affiliate-slots-targeting';

/**
  * @typedef {Object} AffiliateUnit
  * @property {string} campaign
  * @property {string} category
  * @property {string} [isBig]
  * @property {string} image
  * @property {string} heading
  * @property {string} subheading
  * @property {string} link
  * @property {boolean} isExternal
  * @property {number} priority
  * @property {number} preferredIndex
  * @property {boolean} [disableOnSearch=false]
  * @property {boolean} [disableOnPage=false]
  * @property {boolean} [onlyOnAndroid=false]
  * @property {boolean} [onlyOnIOS=false]
  * @property {number[]} [country=[]]
*/
import units from './affiliate-slots-units';

/**
 * @typedef {Object} Targeting
 * @property {string} campaign
 * @property {string} category
 * @property {Object} [tracking={}]
 * @property {number} [score]
 */

/**
 *  Returns `true` if filter is undefined OR if it has the value
 *
 * @param {undefined|string[]} filter
 * @param {string} value
 * @returns {boolean}
 */
const checkFilter = (filter, value) => (
  typeof filter === 'undefined'
    || (Array.isArray(filter) && (filter.length === 0 || filter.indexOf(value) > -1))
);

/**
 *  Returns `true` if `launchOn` is undefined, empty or in the past
 *
 * @param {AffiliateUnit} unit
 * @returns {boolean}
 */
const checkLaunchOn = unit => (
  typeof unit.launchOn === 'undefined'
    || (typeof unit.launchOn === 'string'
      && (unit.launchOn.length === 0 || (Date.parse(unit.launchOn) < Date.now()))
    )
);

/**
 * Check if the unit can be displayed on current system
 *
 * @param {AffiliateUnit} unit
 * @returns {boolean}
 */
const checkMobileSystem = (unit) => {
  // if the unit is only available on ios
  if (unit.onlyOnIOS) {
    return system === 'ios';
  }

  // if the unit is available on android
  if (unit.onlyOnAndroid) {
    return system === 'android';
  }

  // carry on
  return true;
};

const sortPageLevelFirst = (a, b) => {
  if (!a.recommendationLevel || !b.recommendationLevel) {
    return 0;
  }

  return a.recommendationLevel === 'page' ? -1 : 1;
};

/**
 * Convert service response to flat structure
 *
 * @param {Object} response
 * @returns {Targeting[]}
 */
const flattenKnowledgeGraphTargeting = (response) => {
  // convert API to nicer, more useful format
  const targeting = [];

  // convert from tree structure to flat structure for easier comparison later
  response.forEach((campaign) => {
    campaign.categories.forEach((category) => {
      targeting.push({
        campaign: campaign.campaign, // name of the campaign
        category: category.name,
        score: category.score,
        tracking: category.tracking,
        recommendationLevel: category.recommendationLevel,
      });
    });
  });

  // sort by the scores, to get better results first
  targeting.sort((a, b) => b.score - a.score);

  return targeting;
};

const getUserIdValue = (possibleUserId) => {
  if (!possibleUserId) {
    return 'null';
  }

  if (parseInt(possibleUserId, 10) <= 0) {
    return 'null';
  }

  return possibleUserId;
};

const HULU_COMMUNITIES = [
  321995, // american horror story
  1644254, // brokyln 99
  881799, // rick and morty
  200383, // bobs burgers
  951918, // the handmaids tale
  8395, // runaways
  1637241, // futureman
];

export default Service.extend({
  fetch: service(),
  logger: service(),
  geo: service(),
  wikiVariables: service(),
  currentUser: service(),

  currentWikiId: readOnly('wikiVariables.id'),
  currentVertical: readOnly('wikiVariables.vertical'),
  currentCountry: readOnly('geo.country'),
  currentUserId: readOnly('currentUser.userId'),

  _getBigHuluUnit() {
    return this._getAvailableUnits().filter(u => u.isBig && u.category === 'hulu');
  },

  _getPostSearchHuluUnit() {
    return this._getAvailableUnits().find(u => u.category === 'hulu');
  },

  _isHuluOverrideCommunity() {
    return HULU_COMMUNITIES.indexOf(this.currentWikiId) !== -1;
  },

  _updateUnitLink(unit, pageId = 'search') {
    if (!unit || unit.campaign !== 'ddb') {
      return unit;
    }

    const beaconId = Cookies.get('wikia_beacon_id');
    const session = Cookies.get('wikia_session_id');
    const userId = getUserIdValue(this.currentUserId); // make sure we actually send null
    const wikiId = this.currentWikiId;

    // fandom_slot_id will be added later
    const questionMarkOrAmpersan = (unit.link.indexOf('?') > -1) ? '&' : '?';
    const utmTerm = userId ? `${session}_${userId}` : `${session}`;
    const utmParams = `utm_medium=affiliate_link&utm_source=fandom&utm_campaign=${unit.category}&utm_term=${utmTerm}`;
    unit.link = `${unit.link}${questionMarkOrAmpersan}fandom_session_id=${session}&fandom_user_id=${userId}&fandom_campaign_id=${unit.category}&fandom_community_id=${wikiId}&fandom_page_id=${pageId}&fandom_beacon_id=${beaconId}&${utmParams}`;
    unit.utmContent = `utm_content=${wikiId}_${pageId}_${userId}`;
    return unit;
  },

  /**
   * @returns {AffiliateUnit}
   */
  _getAvailableUnits() {
    // get all the units based on name and additional checks
    return units
      // check for mobile-system-specific units
      .filter(checkMobileSystem)
      // filter units by GEO cookie (country)
      .filter(u => checkFilter(u.country, this.currentCountry))
      // filter units by `launchOn` if present
      .filter(checkLaunchOn)
      // sort them according to the priority
      .sort((a, b) => ((a.priority > b.priority) ? 1 : -1));
  },

  /**
   * @param {Targeting[]} targeting
   * @returns {AffiliateUnit}
   */
  _getUnitsWithTargeting(targeting, pageId = 'search') {
    const availableUnits = this._getAvailableUnits();
    const unitsWithTargeting = [];

    const sortedTargeting = targeting.sort(sortPageLevelFirst);

    /**
     * At this point we should have a prioritized list of units and prioritized
     * list of targeting params; we're going to iterate for each targeting
     * in order to build the final list of units
     *
     * NOTE: here we have a nested loop - this is O(n^2), but since
     * both have small values we should be good
     */
    sortedTargeting.forEach((target) => {
      // we're checking all units
      availableUnits.forEach((unit) => {
        if (unit.campaign === target.campaign && unit.category === target.category) {
          const updatedUnit = this._updateUnitLink(unit, pageId);

          // let's add that unit to the list along with its' targeting `tracking` prop
          unitsWithTargeting.push(extend({}, updatedUnit, {
            tracking: target.tracking || {},
          }));
        }
      });
    });

    return unitsWithTargeting;
  },

  /**
   * @param {string} query
   * @returns {Targeting[]}
   */
  _getTargetingOnSearch(query) {
    return searchPageTargeting
      // filter targeting by vertical name
      .filter(t => checkFilter(t.vertical, this.currentVertical))
      // filter targeting by current wiki ID
      .filter(t => checkFilter(t.wikiId, this.currentWikiId))
      // filter targeting for search `query`
      .filter(t => checkFilter(t.query, query));
  },

  /**
   * @param {string} debugString
   * @param {boolean} isBig
   * @returns {AffiliateUnit}
   */
  _getDebugUnit(debugString, isBig, pageId = 'search') {
    const debugArray = debugString.split(',');
    const campaign = debugArray[0];
    const category = debugArray[1];
    const ignoreIsBig = debugArray[2] ? debugArray[2] === 'true' : false;

    if (isBig && ignoreIsBig) {
      return undefined;
    }

    const matchedUnit = units.find(
      unit => unit.campaign === campaign && unit.category === category && !!unit.isBig === isBig,
    );
    return this._updateUnitLink(matchedUnit, pageId);
  },

  /**
   * @param {string} query
   * @returns {AffiliateUnit[]}
   */
  _fetchBigUnitsOnSearch(query) {
    // get the units that fulfill the targeting on search
    const targeting = this._getTargetingOnSearch(query);
    const availableUnits = this._getUnitsWithTargeting(targeting)
      // we only want big units at this point
      .filter(u => !!u.isBig)
      // filter units disabled on search page
      .filter(u => !u.disableOnSearch);

    if (this._isHuluOverrideCommunity()) {
      return [this._getBigHuluUnit()];
    }

    return availableUnits;
  },

  /**
   * @param {string} query
   * @param {string|false} debugAffiliateUnits
   * @returns {Promise}
   */
  fetchUnitsForSearch(query, debugAffiliateUnits = false) {
    return new Promise((resolve) => {
      // special use case for debugging
      if (typeof debugAffiliateUnits === 'string' && debugAffiliateUnits.indexOf(',') > -1) {
        return resolve({
          big: this._getDebugUnit(debugAffiliateUnits, true),
          small: this._getDebugUnit(debugAffiliateUnits, false),
        });
      }

      // check if we have possible units (we can fail early if we don't)
      if (!this._getAvailableUnits()) {
        return resolve({ big: undefined, small: undefined });
      }

      const url = this.fetch.getServiceUrl('knowledge-graph', `/affiliates/${this.currentWikiId}`);

      this.fetch.fetchAndParseResponse(url, {}, AffiliatesFetchError, true)
        .then((response) => {
          const targeting = flattenKnowledgeGraphTargeting(response);

          // get the units that fulfill the campaign and category
          const availableSmallUnits = this._getUnitsWithTargeting(targeting)
            // we only want only small at this point
            .filter(u => !u.isBig)
            // filter units disabled on article page
            .filter(u => !u.disableOnSearch);

          // fetch only the first unit if available
          return resolve({
            big: this._fetchBigUnitsOnSearch(query)[0],
            small: availableSmallUnits[0],
          });
        })
        // not raise anything
        .catch(() => resolve({ big: undefined, small: undefined }));

      return undefined;
    });
  },

  /**
   * @param {string} query
   * @param {string|false} debugAffiliateUnits
   * @returns {Promise}
   */
  fetchUnitsForPage(pageId, debugAffiliateUnits = false) {
    return new Promise((resolve) => {
      // special use case for debugging
      if (typeof debugAffiliateUnits === 'string' && debugAffiliateUnits.indexOf(',') > -1) {
        return resolve({
          big: this._getDebugUnit(debugAffiliateUnits, true, pageId),
          small: this._getDebugUnit(debugAffiliateUnits, false, pageId),
        });
      }

      // check if we have possible units (we can fail early if we don't)
      if (!this._getAvailableUnits()) {
        return resolve({ big: undefined, small: undefined });
      }

      const url = this.fetch.getServiceUrl('knowledge-graph', `/affiliates/${this.currentWikiId}/${pageId}`);

      this.fetch.fetchAndParseResponse(url, {}, AffiliatesFetchError, true)
        .then((response) => {
          const targeting = flattenKnowledgeGraphTargeting(response);

          // get the units that fulfill the campaign and category
          const availableUnits = this._getUnitsWithTargeting(targeting, pageId)
            // filter units disabled on article page
            .filter(u => !u.disableOnPage);

          let selectedBigUnit = availableUnits.filter(u => !!u.isBig === true)[0];
          let selectedSmallUnit = availableUnits.filter(u => !!u.isBig === false)[0];

          if (this._isHuluOverrideCommunity()) {
            selectedBigUnit = this._getBigHuluUnit();
            selectedSmallUnit = this._getPostSearchHuluUnit();
          }

          // fetch only the first unit if available
          return resolve({
            big: selectedBigUnit,
            small: selectedSmallUnit,
          });
        })
        // not raise anything
        .catch(() => resolve({ big: undefined, small: undefined }));

      return undefined;
    });
  },
});
