(function () {
	function htmlToElement(html) {
		var template = document.createElement('template');

		template.insertAdjacentHTML('beforeend', html);

		return template.firstChild;
	}

	function loadDOMResource(src) {
		var ajax = new XMLHttpRequest();

		ajax.onload = function () {
			var element = htmlToElement(ajax.responseText);

			element.style.cssText = 'height: 0; width: 0; position: absolute; overflow: hidden;';

			document.body.insertBefore(element, document.body.firstChild);
		};

		ajax.onerror = function (error) {
			throw new URIError('The resource ' + error.target.src + ' is not accessible.');
		};

		ajax.open('GET', src, true);
		ajax.send();
	}

	// TODO check if fingerprint works correctly
	loadDOMResource('/mobile-wiki/assets/main.svg');
	loadDOMResource('/mobile-wiki/assets/common.svg');
	loadDOMResource('/mobile-wiki/assets/design-system.svg');
})();
