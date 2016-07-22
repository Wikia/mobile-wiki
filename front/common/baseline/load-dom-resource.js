if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 * @param {String} html HTML representing a single element
	 * @return {NodeList}
	 */
	M.htmlToElement = function (html) {
		const template = document.createElement('template');

		template.innerHTML = html;

		return template.content.firstChild;
	};

	/**
	 * @param {string} src
	 * @returns {void}
	 */
	M.loadDOMResource = function (src) {
		const ajax = new XMLHttpRequest();

		ajax.onload = () => {
			const svg = this.htmlToElement(ajax.responseText);

			svg.style.cssText = 'height: 0; width: 0; position: absolute;';

			document.body.insertBefore(svg, document.body.firstChild);
		};

		ajax.onerror = (error) => {
			throw new URIError(`The resource ${error.target.src} is not accessible.`);
		};

		ajax.open('GET', src, true);
		ajax.send();
	};
})(M);
