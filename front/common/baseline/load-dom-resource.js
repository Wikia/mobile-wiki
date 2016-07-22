if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 * @param {string} html HTML representing a single element
	 * @returns {element}
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
			const element = this.htmlToElement(ajax.responseText);

			element.style.cssText = 'height: 0; width: 0; position: absolute;';

			document.body.insertBefore(element, document.body.firstChild);
		};

		ajax.onerror = (error) => {
			throw new URIError(`The resource ${error.target.src} is not accessible.`);
		};

		ajax.open('GET', src, true);
		ajax.send();
	};
})(M);
