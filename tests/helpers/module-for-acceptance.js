import {module} from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function (name, options = {}) {
	module(name, {
		beforeEach() {
			this.applicationInstance = startApp();

			if (options.beforeEach) {
				options.beforeEach.apply(this, arguments);
			}
		},

		afterEach() {
			if (options.afterEach) {
				options.afterEach.apply(this, arguments);
			}

			destroyApp(this.applicationInstance);
		},
	});
}
