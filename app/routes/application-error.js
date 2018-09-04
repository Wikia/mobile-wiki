import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend(
  {
    runtimeConfig: service(),

    renderTemplate() {
      if (this.runtimeConfig.wikiaEnv === 'dev') {
        this.render('errors/application-dev');
      } else {
        this.render('errors/application');
      }
    },

    actions: {
      reloadPage() {
        window.location.reload();
      },
    },
  },
);
