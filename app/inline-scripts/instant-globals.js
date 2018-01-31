(function () {
	var gettersQueue = [];
	var isListening = false;

	window.onInstantGlobalsLoaded = function () {
		window.document.dispatchEvent(new Event('instantGlobalsLoaded'));
	};

	window.getInstantGlobal = function (key, callback) {
		function onInstantGlobalsLoaded() {
			gettersQueue.forEach(function (getter) {
				getter.callback(window.Wikia.InstantGlobals[getter.key]);
			});

			gettersQueue = [];
			document.removeEventListener('instantGlobalsLoaded');
		}

		if (window.Wikia && window.Wikia.InstantGlobals) {
			callback(window.Wikia.InstantGlobals[key]);
		} else {
			gettersQueue.push({key: key, callback: callback});

			if (!isListening) {
				document.addEventListener('instantGlobalsLoaded', onInstantGlobalsLoaded);
				isListening = true;
			}
		}
	};
})();
