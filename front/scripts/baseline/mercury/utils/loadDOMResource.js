if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
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

		ajax.onerror = (error) => {
			throw new URIError(`The resource ${error.target.src} is not accessible.`);
		};

		ajax.open('GET', src, true);
		ajax.send();
	};
})(M);
