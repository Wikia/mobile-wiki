(function (M) {
	M.loadScript = function (src, async, onload) {
		var firstScriptInDocument = document.getElementsByTagName('script')[0];
		var scriptTag = document.createElement('script');

		scriptTag.src = src;
		scriptTag.async = async;

		if (typeof onload === 'function') {
			scriptTag.onload = onload;
		}

		firstScriptInDocument.parentNode.insertBefore(scriptTag, firstScriptInDocument);
	};
})(window.M);
