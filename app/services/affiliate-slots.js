import {
  readOnly,
} from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import { system } from '../utils/browser';
import { AffiiatesFetchError } from '../utils/errors';
import extend from '../utils/extend';

/**
  * @typedef {Object} AffiliateTargeting
  * @property {string[]} campaign
  * @property {string[]} category
  * @property {string[]} unit
  * @property {number} [wikiId=[]]
  * @property {number} [query=[]]
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
  * @property {number} [country=[]]
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
 * Distinct filter for arrays
 *
 * @param {*} value
 * @param {number} index
 * @param {Array} self
 * @returns {boolean}
 */
const distinct = (value, index, self) => (self.indexOf(value) === index);

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

export default Service.extend({
  fetch: service(),
  geo: service(),
  logger: service(),
  wikiVariables: service(),

  currentWikiId: readOnly('wikiVariables.id'),
  currentVertical: readOnly('wikiVariables.vertical'),
  currentCountry: readOnly('geo.country'),

  /**
   * @returns {AffiliateUnit}
   */
  _getAvailableUnits() {
    // get all the units based on name and additional checks
    return units
      // check for mobile-system-specific units
      .filter(u => checkMobileSystem(u))
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
    const units = [];

    // at this point we should have a prioritized list of units and prioritized list of targting params
    // we're going to iterate for each targeting in order to build the final list of units
    targeting.forEach(t => {
      // we're checing all units
      availableUnits.forEach(u => {
        // if we have a match, then let's add that unit to the list along with its' targeting `tracking` prop
        if (u.campaign === t.campaign && u.category === t.category) {
          units.push(extend({}, unit, {
            tracking: t.tracking || {},
          });
        }
      });
    });

    return units;
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

  fetchUnitForSearch(query, isBig = false) {
    return new Promise((resolve, reject) => {
      // check if we have possible units (we can fail early if we don't)
      if (!this._getAvailableUnits()) {
        resolve(undefined);
      }

      // get the units that fulfill the targeting on search
      const units = _getUnitsForCampaigns(this._getTargetingOnSearch(query))
        // filter type of ad
        .filter(u => !!u.isBig === !!isBig)
        // filter units disabled on search page
        .filter(u => !u.disableOnSearch)
      
      // fetch only the first unit if available
      const unit = units.length > 0 ? units[0] : undefined

      resolve(unit);
    });
  },

  fetchUnitForPage(id, isBig = false) {
    return new Promise((resolve, reject) => {
      // check if we have possible units (we can fail early if we don't)
      if (!this._getAvailableUnits()) {
        resolve(undefined);
      }
      
      const url = this.fetch.getServiceUrl('taxonomy', `/affiliates/${this.currentWikiId}/${id}`);

      this.fetch.fetchAndParseResponse(url, {}, AffiiatesFetchError)
        .then((response) => {
          // convert API to nicer, more useful format
          const targeting = [];

          response.forEach(e => {
            e.categories.forEach(c => {
              targeting.push({
                campaign: e.campaign,
                category: c.name,
                score: c.score,
                tracking: c.tracking,
              });
            });
          });

          targeting.sort((a, b) => b.score - a.score);

          // get the units that fulfill the campaign and category
          const units = _getUnitsForCampaigns(targeting)
            // filter type of ad
            .filter(u => !!u.isBig === !!isBig)
            // filter units disabled on article page
            .filter(u => !u.disableOnPage)

          // fetch only the first unit if available
          const unit = units.length > 0 ? units[0] : undefined

          resolve(unit);
        })
        .catch((error) => {
          this.logger.error(error.message);

          reject(error);
        });
    });
  },
});
