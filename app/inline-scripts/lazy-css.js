document.addEventListener('DOMContentLoaded', function () {
	/*
	 * Run after 500ms to give a browser time to parse html and app.css and render it to a user
	 * without a settimeout - browser would fetch it too quickly and would have to parse it along with
	 * main app.css - slowing down FMP
	 */
	setTimeout(function () {
		document.getElementById('lazy-css').media = 'all';
	}, 500);
});
