import Ember from 'ember';

const {getOwner} = Ember;

export default function isInitialPageView(object = null) {
	let container;

	if (object !== null) {
		container = getOwner(object);
	} else {
		container = window.MobileWiki.__container__;
	}

	return container.lookup('router:main').router.currentSequence === 1;
}
