(function (M) {
	M.loadScript = function (src, async, onload, crossorigin) {
		var firstScriptInDocument = document.getElementsByTagName('script')[0];
		var scriptTag = document.createElement('script');

		scriptTag.src = src;
		scriptTag.async = async;

		if (typeof onload === 'function') {
			scriptTag.onload = onload;
		}

		if (typeof crossorigin !== 'undefined') {
			scriptTag.crossOrigin = crossorigin;
		}

		firstScriptInDocument.parentNode.insertBefore(scriptTag, firstScriptInDocument);
	};
})(window.M);
