export default {
	name: 'qualaroo',
	initialize() {
		if (typeof FastBoot === 'undefined') {
			window._kiq = [];
			window.getInstantGlobal('wgMobileQualaroo', (wgMobileQualaroo) => {
				if (wgMobileQualaroo) {
					const script = document.createElement('script');

					script.type = 'text/javascript';
					script.async = true;
					script.src = window.M.getFromHeadDataStore('wikiVariables.qualarooUrl');
					document.body.appendChild(script);
				}
			});
		}
	}
};
