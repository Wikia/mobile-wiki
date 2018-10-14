import config from '../config/environment';
import Service, { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

const SCRIPT_URL = 'https://www.fastly-insights.com/static/scout.js?k=17272cd8-82ee-4eb5-b5a3-b3cd5403f7c5';

export default Service.extend({

  scriptWasLoaded: false,

  currentUser: service(),

  loadFastlyInsightsScript: function() {
    if (!this.scriptWasLoaded &&
        config.environment === 'production' &&
        !this.currentUser.isAuthenticated) {
      window.M.loadScript(SCRIPT_URL, true, () => {
        this.scriptWasLoaded = true;
      });
    }
  }

});
