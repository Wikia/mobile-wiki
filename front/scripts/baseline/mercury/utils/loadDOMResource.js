if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 }
	 * @throws URIError exception
	 * @param {*} error
	 * @returns {void}
	 */
	function loadError(error) {
		throw new URIError(`The resource ${error.target.src} is not accessible.`);
	}

	/**
	 * @param {string} src
	 * @returns {void}
	 */
	M.loadDOMResource = function (src) {
		const ajax = new XMLHttpRequest();

		ajax.onload = () => {
			const div = document.createElement('div');

			div.innerHTML = ajax.responseText;
			document.body.insertBefore(div.childNodes[0], document.body.firstChild);
		};
		ajax.onerror = loadError;

		ajax.open('GET', src, true);
		ajax.send();
	};
})(M);
