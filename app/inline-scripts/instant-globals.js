(function () {
	var gettersQueue = [];
	var isListening = false;

	window.onInstantGlobalsLoaded = function () {
		window.document.dispatchEvent(new Event('instantGlobalsLoaded'));
	};

	window.getInstantGlobal = function (key, callback) {
		if (window.Wikia && window.Wikia.InstantGlobals) {
			callback(window.Wikia.InstantGlobals[key]);
		} else {
			gettersQueue.push({key, callback});

			if (!isListening) {
				document.addEventListener('instantGlobalsLoaded', () => {
					gettersQueue.forEach((getter) => {
						getter.callback(window.Wikia.InstantGlobals[getter.key]);
					});

					gettersQueue = [];
				});
			}

			isListening = true;
		}
	};
})();
