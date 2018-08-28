import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';


/**
 * Helper to give textual representation of time interval between past date
 * and the current time/date in the form
 * {{time-ago unixTimestamp}}
 * which returns something like '2d' if interval is below 5 days or formated param date
 *
 * @param {int} unixTimestamp
 * @returns {string}
 */
export default Helper.extend({
  i18n: service(),
  compute([unixTimestamp]) {
    const date = new Date(unixTimestamp * 1000);
    const now = new Date();
    const diffInSeconds = (now - date) / 1000;
    const i18n = this.i18n;

    if (diffInSeconds > 432000) {
      // more than 5 days ago - show date
      return date.toLocaleDateString();
    }
    if (diffInSeconds > 86400) {
      // more than a day ago
      return i18n.t('main:app.days-ago', {
        days: Math.round(diffInSeconds / 60 / 60 / 24),
      });
    }
    if (diffInSeconds > 3600) {
      // more than an hour ago
      return i18n.t('main:app.hours-ago', {
        hours: Math.round(diffInSeconds / 60 / 60),
      });
    }
    if (diffInSeconds < 60) {
      // less than a minute ago
      return i18n.t('main:app.now-label');
    }
    return i18n.t('main:app.minutes-ago', {
      minutes: Math.round(diffInSeconds / 60),
    });
  },
});
