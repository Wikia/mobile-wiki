(function () {
	function htmlToElement(html) {
		var template = document.createElement('template');

		template.insertAdjacentHTML('beforeend', html);

		return template.querySelector('svg');
	}

	function loadDOMResource(src) {
		fetch(src)
			.then(function(response) {
				return response.text();
			})
			.then(function(body) {
				var element = htmlToElement(body);

				element.style.cssText = 'height: 0; width: 0; position: absolute; overflow: hidden;';

				document.body.insertBefore(element, document.body.firstChild);
			});
	}

	loadDOMResource('/mobile-wiki/assets/main.svg');
	loadDOMResource('/mobile-wiki/assets/design-system.svg');
})();
