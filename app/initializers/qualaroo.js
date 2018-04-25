function createSVG(iconName, className) {
	const svgNS = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(svgNS, 'svg');
	const use = document.createElementNS(svgNS, 'use');
	use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconName}`);
	svg.setAttribute('role', 'img');
	svg.classList.add(className);
	svg.appendChild(use);
	return svg;
}

export default {
	name: 'qualaroo',
	initialize() {
		if (typeof FastBoot === 'undefined') {
			window._kiq = [];
			window.getInstantGlobal('wgMobileQualaroo', (wgMobileQualaroo) => {
				if (wgMobileQualaroo) {
					const renderedNudges = {};
					$script(window.M.getFromHeadDataStore('wikiVariables.qualarooUrl'));
					window._kiq.push(['eventHandler', 'nodeRendered', (nudgeId) => {
						if (renderedNudges[nudgeId]) {
							return;
						}

						renderedNudges[nudgeId] = true;
						const qualarooElement = document.getElementById('qual_ol');
						const stuffElement = qualarooElement.querySelector('.qual_ol_stuff');
						const closeElement = qualarooElement.querySelector('.qual_x_close');
						const fandomLogo = createSVG('wds-company-logo-fandom', 'fandom-logo');
						const close = createSVG('wds-icons-cross-tiny', 'fandom-close-icon');
						closeElement.appendChild(close);
						stuffElement.insertBefore(fandomLogo, stuffElement.firstChild);
					}]);
				}
			});
		}
	}
};
