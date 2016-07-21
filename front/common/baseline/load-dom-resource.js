if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 * @param {string} src
	 * @returns {void}
	 */
	M.loadDOMResource = function (src, visible = true) {
		const ajax = new XMLHttpRequest();

		ajax.onload = () => {
			const div = document.createElement('div');

			div.innerHTML = ajax.responseText;
			div.style.cssText = 'height: 0; width: 0; position: absolute;';

			if (!visible) {
				div.style.cssText += ' visibility: hidden;';
			}

			document.body.insertBefore(div, document.body.firstChild);
		};

		ajax.onerror = (error) => {
			throw new URIError(`The resource ${error.target.src} is not accessible.`);
		};

		ajax.open('GET', src, true);
		ajax.send();
	};
})(M);
