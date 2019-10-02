import {
  readOnly,
} from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import { system } from '../utils/browser';

import targeting from './affiliate-slots-targeting';
import units from './affiliate-slots-units';

/**
 *  Returns `true` if filter is undefined OR if it has the value
 */
const checkFilter = (filter, value) => (
  typeof filter === 'undefined'
    || (Array.isArray(filter) && (filter.length === 0 || filter.indexOf(value) > -1))
);

/**
 * Distinct filter for arrays
 */
const distinct = (value, index, self) => (self.indexOf(value) === index);

/**
 * Check if the unit can be displayed on current system
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
   * Get aone unit that can be displayed on search page with given `query`
   */
  getUnitOnSearch(query) {
    const allUnits = this.getAllUnitsOnSearch(query);

    return allUnits.length > 0 ? allUnits[0] : undefined;
  },

  /**
   * Get all units that can be displayed on search page with given `query`
   */
  getAllUnitsOnSearch(query) {
    return this.getAllUnits([
      t => !t.disableOnSearch,
      t => checkFilter(t.query, query),
    ]);
  },

  /**
   * Get all units that can be displayed on current wiki with given `title`
   */
  getUnitOnPage(title) {
    const allUnits = this.getAllUnitsOnPage(title);

    return allUnits.length > 0 ? allUnits[0] : undefined;
  },

  /**
   * Get all units that can be displayed on current wiki with given `title`
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
   * @param [function[]] filter functions for targeting
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
      .flat()
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
