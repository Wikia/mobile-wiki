import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationErrorRouter extends Route {
  @service runtimeConfig;

  renderTemplate() {
    if (this.runtimeConfig.wikiaEnv === 'dev') {
      this.render('errors/application-dev');
    } else {
      this.render('errors/application');
    }
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  reloadPage() {
    window.location.reload();
  }
}
