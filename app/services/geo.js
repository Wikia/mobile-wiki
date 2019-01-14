import Service from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Service.extend({
  country: oneWay('data.country'),

  init() {
    this._super(...arguments);

    try {
      const cookie = window.Cookies.get('Geo');

      this.set('data', JSON.parse(cookie) || {});
    } catch (e) {
      this.set('data', {});
    }
  },
});
