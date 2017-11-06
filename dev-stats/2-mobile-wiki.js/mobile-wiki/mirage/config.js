define('mobile-wiki/mirage/config', ['exports', 'mobile-wiki/mirage/fixtures/file-page'], function (exports, _filePage) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function () {
		this.passthrough('https://localhost/**');

		this.passthrough('https://services.wikia-dev.pl/**');
		this.passthrough('https://services.wikia-dev.us/**');
		this.passthrough('https://services.wikia.com/**');
		this.passthrough('/wikia.php');
		this.passthrough('/api.php');
		this.passthrough('http://speed.wikia.net/**');

		// We have /front/main/assets prefix hardcoded in route and testem use /assets
		// This is a quick (hopefully temporary) fix
		this.get('/front/main/assets/vendor/cropper/cropper.min.js', {});

		this.get('/wikia.php', function (schema, request) {
			var _request$queryParams = request.queryParams,
			    controller = _request$queryParams.controller,
			    method = _request$queryParams.method,
			    title = _request$queryParams.title;


			if (controller === 'MercuryApi') {
				if (method === 'getPage' && title === 'Mercury_CC_Wikia') {
					// Curated Main Page Data
					return schema.curatedContents.first();
				}

				if (method === 'getPage' && title === 'File:Example.jpg') {
					return _filePage.default;
				}
			}

			if (controller === 'CuratedContent' && method === 'getData') {
				return schema.curatedContentEditorItems.first();
			}

			// fixme probably it shouldn't look like this - it just to have mirage working for backend-less development
			if (controller === 'UserApi') {
				return;
			}
			throw new Error('Controller or method response isn\'t yet mocked');
		});

		this.get('http://fallout.wikia.com/wikia.php', function (schema, request) {
			var _request$queryParams2 = request.queryParams,
			    controller = _request$queryParams2.controller,
			    method = _request$queryParams2.method,
			    title = _request$queryParams2.title;


			if (controller === 'MercuryApi') {
				if (method === 'getPage' && title === 'File:Example.jpg') {
					return _filePage.default;
				}
			}

			if (controller === 'SearchApi' && method === 'getList') {
				return schema.searches.first();
			}

			throw new Error('Controller or method response isn\'t yet mocked');
		});
	};
});