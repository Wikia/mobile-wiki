(function () {
	var gettersQueue = [];
	var callbacksQueue = [];
	var isListening = false;

	window.onAsyncScriptsLoaded = function () {
		window.document.dispatchEvent(new Event('asyncScriptsLoaded'));
	};

	window.onAsyncScriptsError = function () {
		window.Wikia = window.Wikia || {};
		window.Wikia.InstantGlobals = {};
		window.document.dispatchEvent(new Event('asyncScriptsLoaded'));
	};

	function onAsyncScriptsLoaded() {
		gettersQueue.forEach(function (getter) {
			if (getter.key) {
				getter.callback(window.Wikia.InstantGlobals[getter.key]);
			} else {
				getter.callback(window.Wikia.InstantGlobals);
			}
		});

		callbacksQueue.forEach(function (callback) {
			callback();
		});

		gettersQueue = [];
		callbacksQueue = [];
	}

	function waitForAsyncScripts() {
		if (!isListening) {
			document.addEventListener('asyncScriptsLoaded', onAsyncScriptsLoaded, { once: true });
			isListening = true;
		}
	}

	window.getInstantGlobal = function (key, callback) {
		if (window.Wikia && window.Wikia.InstantGlobals) {
			callback(window.Wikia.InstantGlobals[key]);
		} else {
			gettersQueue.push({ key: key, callback: callback });
			waitForAsyncScripts();
		}
	};

	window.getInstantGlobals = function (callback) {
		if (window.Wikia && window.Wikia.InstantGlobals) {
			callback(window.Wikia.InstantGlobals);
		} else {
			gettersQueue.push({ callback: callback });
			waitForAsyncScripts();
		}
	};

	window.onABTestLoaded = function (callback) {
		if (window.Wikia && window.Wikia.AbTest) {
			callback();
		} else {
			callbacksQueue.push(callback);
			waitForAsyncScripts();
		}
	};
})();
