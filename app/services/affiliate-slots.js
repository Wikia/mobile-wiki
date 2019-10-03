import {
  readOnly,
} from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import { system } from '../utils/browser';

/**
  * @typedef {Object} AffiliateTargeting
  * @property {string} [comment]
  * @property {string[]} unit
  * @property {number} [wikiId=[]]
  * @property {number} [country=[]]
  * @property {number|false} [page=[]]
  * @property {number|false} [query=[]]
  * @property {number} [vertical=[]]
*/
import targeting from './affiliate-slots-targeting';

/**
  * @typedef {Object} AffiliateUnit
  * @property {string} name
  * @property {string} [isBig]
  * @property {string} image
  * @property {string} heading
  * @property {string} subheading
  * @property {string} link
  * @property {boolean} isExternal
  * @property {number} priority
  * @property {boolean} [disableOnSearch=false]
  * @property {boolean} [disableOnPage=false]
  * @property {boolean} [onlyOnAndroid=false]
  * @property {boolean} [onlyOnIOS=false]
*/
import units from './affiliate-slots-units';

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
  wikiVariables: service(),
  geo: service(),

  currentWikiId: readOnly('wikiVariables.id'),
  currentVertical: readOnly('wikiVariables.vertical'),
  currentCountry: readOnly('geo.country'),

  /**
   * Get one unit that can be displayed on search page with given `query`
   *
   * @param {string} query
   * @returns {AffiliateUnit|undefined}
   */
  getUnitOnSearch(query) {
    const allUnits = this.getAllUnitsOnSearch(query);

    return allUnits.length > 0 ? allUnits[0] : undefined;
  },

  /**
   * Get all units that can be displayed on search page with given `query`
   *
   * @param {string} query
   * @returns {AffiliateUnit[]}
   */
  getAllUnitsOnSearch(query) {
    return this.getAllUnits([
      t => !t.disableOnSearch,
      t => checkFilter(t.query, query),
    ]);
  },

  /**
   * Get one unit that can be displayed on current wiki with given `title`
   *
   * @param {string} title
   * @returns {AffiliateUnit|undefined}
   */
  getUnitOnPage(title) {
    const allUnits = this.getAllUnitsOnPage(title);

    return allUnits.length > 0 ? allUnits[0] : undefined;
  },

  /**
   * Get all units that can be displayed on current wiki with given `title`
   *
   * @param {string} title
   * @returns {AffiliateUnit[]}
   */
  getAllUnitsOnPage(title) {
    return this.getAllUnits([
      t => !t.disableOnPage,
      t => checkFilter(t.page, title),
    ]);
  },

  /**
   * Get all units that can be displayed on current wiki
   *
   * @param {Function[]} filter functions for targeting
   * @returns {AffiliateUnit[]}
   */
  getAllUnits(filters = []) {
    let activeTargeting = targeting
      // filter targeting by GEO cookie (country)
      .filter(t => checkFilter(t.country, this.currentCountry))
      // filter targeting by vertical name
      .filter(t => checkFilter(t.vertical, this.currentVertical))
      // filter targeting by current wiki ID
      .filter(t => checkFilter(t.wikiId, this.currentWikiId));

    // apply additional criteria
    filters.forEach((f) => {
      activeTargeting = activeTargeting.filter(f);
    });

    // extract unit names from available targeting
    const availableUnitNames = activeTargeting
      // grab only names of allowed units
      .map(t => t.unit)
      // flatten the array
      .reduce((prev, curr) => prev.concat(curr))
      // make the list unique
      .filter(distinct);

    // get all the units based on name and additional checks
    const availableUnits = units
      // filter only units that are actually allowed (because of targeting)
      .filter(u => availableUnitNames.indexOf(u.name) > -1)
      // check for mobile-system-specific units
      .filter(u => checkMobileSystem(u))
      // sort them according to the priority
      .sort((a, b) => ((a.priority > b.priority) ? 1 : -1));

    return availableUnits;
  },
});
