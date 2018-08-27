import Controller from '@ember/controller';
import { computed } from '@ember/object';
import {
	getProductionErrorMessage,
	canAttemptRefresh,
} from '../utils/errors';

export default Controller.extend({
	additionalData: computed(function () {
		const additionalData = this.get('model.additionalData');

		return additionalData ? JSON.stringify(additionalData, null, 1) : null;
	}),

	stackTrace: computed(function () {
		const stackTrace = (this.get('model.normalizedStack') || '')
			.replace(new RegExp('\\n', 'g'), '<br />');

		return stackTrace || 'No stack trace available';
	}),

	productionErrorContext: computed(function () {
		const errorCode = this.get('controller.model.error.code');

		return {
			message: getProductionErrorMessage(errorCode),
			canAttemptRefresh: canAttemptRefresh(errorCode),
		};
	}),
});
