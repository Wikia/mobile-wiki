(function (w, d, s, p, v, e, r) {
	if (!('performance' in w)) {
		w.performance = {
			now() {
				return 0;
			},
			memory: {
				usedJSHeapSize: 0,
				totalJSHeapSize: 0
			}
		};
	}

	w.$igniter_var = v;
	w[v] = w[v] || function () {
		(w[v].q = w[v].q || []).push(arguments);
	};
	w[v].l = 1 * new Date();
	e = d.createElement(s);
	r = d.getElementsByTagName(s)[0];
	e.async = 1;
	e.src = p + '?ts=' + (+new Date() / 3600000 | 0);
	r.parentNode.insertBefore(e, r);
})(window, document, 'script', '//cdn.petametrics.com/l9ehhrb6mtv75bp2.js', 'liftigniter');
