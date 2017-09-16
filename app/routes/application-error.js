import Ember from 'ember';
import config from '../config/environment';

const {Route} = Ember;

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
