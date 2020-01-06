import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { logError } from '../modules/event-logger';

export default Route.extend(
  {
    fastboot: service(),
    runtimeConfig: service(),

    /**
   * @param {Ember.Controller} controller
   * @param {EmberError} error
   * @returns {void}
   */
    renderTemplate(controller, error) {
      switch (error.code) {
        case 404:
          this.render('errors/not-found');
          break;
        default:
          this.render('errors/other');

          if (!this.get('fastboot.isFastBoot')) {
            logError(this.runtimeConfig.servicesExternalHost, 'Wiki-page route error substate', error);
          }
          break;
      }
    },

    /**
     * @returns {void}
     */
    @action
    reloadPage() {
      window.location.reload();
    },
  },
);
