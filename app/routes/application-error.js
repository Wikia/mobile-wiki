import Route from '@ember/routing/route';
import config from '../config/environment';

export default Route.extend(
	{
		renderTemplate() {
			if (config.wikiaEnv === 'dev') {
				this.render('errors/application-dev');
			} else {
				this.render('errors/application');
			}
		},

		actions: {
			reloadPage() {
				window.location.reload();
			}
		}
	}
);
