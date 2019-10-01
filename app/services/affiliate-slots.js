import {
  readOnly,
} from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import targeting from './affiliate-slots-targeting.json';
import units from './affiliate-slots-units.json';

/**
 *  Returns `true` if filter is undefined OR if it has the value
 */
function checkFilter(filter, value) {
  return typeof filter === 'undefined'
    || (Array.isArray(filter) && filter.indexOf(value) > -1);
}

/**
 * Distinct filter for arrays
 */
function distinct(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Get random element of an array
 */
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
    return sample(this.getAllUnitsOnPage(title));
  },

  /**
   * Get all units that can be displayed on current wiki with given `title`
   */
  getAllUnitsOnPage(title) {
    const availableUnitNames = this.getAvailableTargeting()
      .filter(t => checkFilter(t.page, title))
      .map(t => t.unit)
      .filter(distinct);

    return units.filter(u => availableUnitNames.indexOf(u.name) > -1);
  },

  /**
   * Get one random unit from that can be displayed on current wiki with given `query`
   */
  getUnitOnSearch(query) {
    return sample(this.getAllUnitsOnSearch(query));
  },

  /**
   * Get all units that can be displayed on current wiki with given `query`
   */
  getAllUnitsOnSearch(query) {
    const availableUnitNames = this.getAvailableTargeting()
      .filter(t => checkFilter(t.query, query))
      .map(t => t.unit)
      .filter(distinct);

    return units.filter(u => availableUnitNames.indexOf(u.name) > -1);
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
