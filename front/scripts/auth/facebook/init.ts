window.fbAsyncInit = function(): void {
	window.FB.init({
		appId: M.prop('facebookAppId'),
		cookie: true,  // enable cookies to allow the server to access
					   // the session
		xfbml: true,  // parse social plugins on this page
		version: 'v2.2' // use version 2.2
	});
};

(function(d, s, id): void {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
