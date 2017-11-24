import Route from '@ember/routing/route';
import config from '../config/environment';
import {getProductionErrorMessage, canAttemptRefresh} from '../utils/errors';

export default Route.extend(
	{
		renderTemplate() {
			if (config.wikiaEnv === 'dev') {
				this.render('errors/application-dev');
			} else {
				this.get('controller.model').setProperties(
					this.getProductionErrorContext()
				);

				this.render('errors/application');
			}
		},

		getProductionErrorContext() {
			const errorCode = this.get('controller.model.error.code');

			return {
				productionErrorMessage: getProductionErrorMessage(errorCode),
				canAttemptRefresh: canAttemptRefresh(errorCode)
			};
		},

		actions: {
			reloadPage() {
				window.location.reload();
			}
		}
	}
);
