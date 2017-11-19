import Service from '@ember/service';
import {getOwner} from '@ember/application';

export default Service.extend({
	isInitialPageView() {
		const router = getOwner(this).lookup('router:main')._routerMicrolib;

		return router.currentSequence === 1;
	}
});
