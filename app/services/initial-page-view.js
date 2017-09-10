import Ember from 'ember';

const {Service, getOwner} = Ember;

export default Service.extend({
	isInitialPageView() {
		const router = getOwner(this).lookup('router:main')._routerMicrolib;

		return router.currentSequence === 1;
	}
});
