import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  fetch: service(),
  logger: service(),

  items: null,
  item: computed('items', function () {
    return this.getSponsoredItem(this.items);
  }),

  fetchData() {
    const url = this.fetch.getServiceUrl('wiki-recommendations', '/sponsored-articles');

    if (!this.items) {
      this.fetch.fetchAndParseResponse(url)
        .then(data => this.set('items', data))
        .catch((error) => {
          this.logger.error(error.message);
        });
    }
  },

  getSponsoredItem(sponsoredContent = []) {
    const randomNumber = Math.random();
    const applicableContent = this.getApplicableContent(sponsoredContent);
    const sumOfWeights = this.getWeightsSum(applicableContent);
    const ranges = this.getMaxRanges(applicableContent, sumOfWeights);
    const applicableRanges = ranges.filter(el => el >= randomNumber);
    const firstApplicableIndex = applicableContent.length - applicableRanges.length;

    return applicableContent[firstApplicableIndex];
  },

  getApplicableContent(sponsoredContent) {
    // todo move to geo service
    let cookie;
    try {
      cookie = JSON.parse(window.Cookies.get('Geo'));
    } catch (e) {
      cookie = {};
    }
    return sponsoredContent.filter(el => !el.geos.length || el.geos.indexOf(cookie.country) !== -1);
  },

  getWeightsSum(applicableContent) {
    return applicableContent.reduce((sum, el) => sum + el.weight, 0);
  },

  getMaxRanges(applicableContent, totalSum) {
    return applicableContent.map((el, index, arr) => {
      const currentSum = this.getWeightsSum(arr.slice(0, index + 1));

      return currentSum / totalSum;
    });
  },
});
