(function (d, s, u) {
	var e = d.createElement(s);
	var r = d.getElementsByTagName(s)[0];
	// e.async = 1;
	e.src = u + '?ts=' + (+new Date() / 3600000 | 0);
	r.parentNode.insertBefore(e, r);
})(document, 'script', '//cdn.optimizely.com/js/2449650414.js');
