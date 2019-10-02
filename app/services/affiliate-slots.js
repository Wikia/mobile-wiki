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
 * Get random element of an array
 */
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

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
   * Get one random unit from that can be displayed on current wiki with given `title`
   */
  getUnitOnPage(title) {
    return this.getUnitByPriority(this.getAllUnitsOnPage(title));
  },

  /**
   * Get all units that can be displayed on current wiki with given `title`
   */
  getAllUnitsOnPage(title) {
    const availableUnitNames = this.getAvailableTargeting()
      .filter(t => !t.disableOnPage)
      .filter(t => checkFilter(t.page, title))
      .map(t => t.unit)
      .flat()
      .filter(distinct);

    return units
      .filter(u => availableUnitNames.indexOf(u.name) > -1)
      .filter(u => checkMobileSystem(u));
  },

  /**
   * Get one random unit from that can be displayed on current wiki with given `query`
   */
  getUnitOnSearch(query) {
    return this.getUnitByPriority(this.getAllUnitsOnSearch(query));
  },

  /**
   * Sort all units via priority and fetch one of them
   */
  getUnitByPriority(availableUnits) {
    return availableUnits.length > 0
      ? sample(availableUnits.sort((a, b) => ((a.priority > b.priority) ? 1 : -1)))
      : undefined;
  },

  /**
   * Get all units that can be displayed on current wiki with given `query`
   */
  getAllUnitsOnSearch(query) {
    const availableUnitNames = this.getAvailableTargeting()
      .filter(t => !t.disableOnSearch)
      .filter(t => checkFilter(t.query, query))
      .map(t => t.unit)
      .flat()
      .filter(distinct);

    return units
      .filter(u => availableUnitNames.indexOf(u.name) > -1)
      .filter(u => checkMobileSystem(u));
  },

  /**
   * Get all targeting that can be used on current wiki; checks for:
   * - wikiId
   * - vertical
   * - country
   */
  getAvailableTargeting() {
    return targeting
      .filter(t => checkFilter(t.country, this.currentCountry))
      .filter(t => checkFilter(t.vertical, this.currentVertical))
      .filter(t => checkFilter(t.wikiId, this.currentWikiId));
  },
});
