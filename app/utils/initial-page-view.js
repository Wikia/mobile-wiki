import applicationInstance from './application-instance';

export default function isInitialPageView() {
	const router = applicationInstance.instance.lookup('router:main').router;

	return router.currentSequence === 1;
}
