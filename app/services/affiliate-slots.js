import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

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
 * Check if the unit can be displayed on current system
 *
 * @param {string} unit
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
      });
    });
  });

  // sort by the scores, to get better results first
  targeting.sort((a, b) => b.score - a.score);

  return targeting;
};

export default Service.extend({
  fetch: service(),
  logger: service(),
  geo: service(),
  wikiVariables: service(),

  currentWikiId: readOnly('wikiVariables.id'),
  currentVertical: readOnly('wikiVariables.vertical'),
  currentCountry: readOnly('geo.country'),

  isLaunched: computed('wikiVariables.affiliateUnitEnabledDate', function () {
    return Date.parse(this.wikiVariables.affiliateUnitEnabledDate) < Date.now();
  }),

  /**
   * @returns {AffiliateUnit}
   */
  _getAvailableUnits() {
    // get all the units based on name and additional checks
    return units
      // check for mobile-system-specific units
      .filter(checkMobileSystem)
      // filter targeting by GEO cookie (country)
      .filter(u => checkFilter(u.country, this.currentCountry))
      // sort them according to the priority
      .sort((a, b) => ((a.priority > b.priority) ? 1 : -1));
  },

  /**
   * @param {Targeting[]} targeting
   * @returns {AffiliateUnit}
   */
  _getUnitsWithTargeting(targeting) {
    const availableUnits = this._getAvailableUnits();
    const unitsWithTargeting = [];

    /**
     * At this point we should have a prioritized list of units and prioritized
     * list of targeting params; we're going to iterate for each targeting
     * in order to build the final list of units
     *
     * NOTE: here we have a nested loop - this is O(n^2), but since
     * both have small values we should be good
     */
    targeting.forEach((target) => {
      // we're checking all units
      availableUnits.forEach((unit) => {
        if (unit.campaign === target.campaign && unit.category === target.category) {
          // let's add that unit to the list along with its' targeting `tracking` prop
          unitsWithTargeting.push(extend({}, unit, {
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

  _getDebugUnit(debugString, isBig) {
    const debugArray = debugString.split(',');
    const campaign = debugArray[0];
    const category = debugArray[1];

    return units.find(
      unit => unit.campaign === campaign && unit.category === category && !!unit.isBig === isBig,
    );
  },

  fetchUnitForSearch(query, isBig = false, debugAffiliateUnits = false) {
    return new Promise((resolve) => {
      if (!this.isLaunched && !debugAffiliateUnits) {
        return resolve(undefined);
      }

      // special use case for debugging
      if (typeof debugAffiliateUnits === 'string' && debugAffiliateUnits.indexOf(',') > -1) {
        return resolve(this._getDebugUnit(debugAffiliateUnits, isBig));
      }

      // check if we have possible units (we can fail early if we don't)
      if (!this._getAvailableUnits()) {
        return resolve(undefined);
      }

      if (isBig) {
        // get the units that fulfill the targeting on search
        const targeting = this._getTargetingOnSearch(query);
        const availableUnits = this._getUnitsWithTargeting(targeting)
          // we only want big units at this point
          .filter(u => !!u.isBig)
          // filter units disabled on search page
          .filter(u => !u.disableOnSearch);

        // fetch only the first unit if available
        return resolve(availableUnits.length > 0 ? availableUnits[0] : undefined);
      }

      const url = this.fetch.getServiceUrl('knowledge-graph', `/affiliates/${this.currentWikiId}`);

      this.fetch.fetchAndParseResponse(url, {}, AffiliatesFetchError)
        .then((response) => {
          const targeting = flattenKnowledgeGraphTargeting(response);

          // get the units that fulfill the campaign and category
          const availableUnits = this._getUnitsWithTargeting(targeting)
            // we only want only small at this point
            .filter(u => !u.isBig)
            // filter units disabled on article page
            .filter(u => !u.disableOnSearch);

          // fetch only the first unit if available
          return resolve(availableUnits.length > 0 ? availableUnits[0] : undefined);
        })
        // not raise anything
        .catch(() => resolve(undefined));

      return undefined;
    });
  },

  fetchUnitForPage(pageId, isBig = false, debugAffiliateUnits = false) {
    return new Promise((resolve) => {
      if (!this.isLaunched && !debugAffiliateUnits) {
        return resolve(undefined);
      }

      // special use case for debugging
      if (typeof debugAffiliateUnits === 'string' && debugAffiliateUnits.indexOf(',') > -1) {
        return resolve(this._getDebugUnit(debugAffiliateUnits, isBig));
      }

      // check if we have possible units (we can fail early if we don't)
      if (!this._getAvailableUnits()) {
        return resolve(undefined);
      }

      const url = this.fetch.getServiceUrl('knowledge-graph', `/affiliates/${this.currentWikiId}/${pageId}`);

      this.fetch.fetchAndParseResponse(url, {}, AffiliatesFetchError)
        .then((response) => {
          const targeting = flattenKnowledgeGraphTargeting(response);

          // get the units that fulfill the campaign and category
          const availableUnits = this._getUnitsWithTargeting(targeting)
            // filter type of ad - isBig can be undefined, let's convert both to boolean
            .filter(u => !!u.isBig === !!isBig)
            // filter units disabled on article page
            .filter(u => !u.disableOnPage);


          // fetch only the first unit if available
          return resolve(availableUnits.length > 0 ? availableUnits[0] : undefined);
        })
        // not raise anything
        .catch(() => resolve(undefined));

      return undefined;
    });
  },
});
