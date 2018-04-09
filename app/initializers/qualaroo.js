export default {
	name: 'qualaroo',
	initialize() {
		if (typeof FastBoot === 'undefined') {
			window._kiq = [];
			window.getInstantGlobal('wgMobileQualaroo', (wgMobileQualaroo) => {
				if (wgMobileQualaroo) {
					$script(window.M.getFromHeadDataStore('wikiVariables.qualarooUrl'));
				}
			});
		}
	}
};
