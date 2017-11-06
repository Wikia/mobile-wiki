define("mobile-wiki/tests/.eslintrc", ["module"], function (module) {
	"use strict";

	module.exports = {
		env: {
			embertest: true
		},
		globals: {
			mockAdsService: true,
			mockFastbootService: true,
			mockService: true
		},
		rules: {
			"import/newline-after-import": 0,
			"no-restricted-globals": 0
		}
	};
});