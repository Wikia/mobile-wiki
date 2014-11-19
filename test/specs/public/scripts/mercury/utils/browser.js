QUnit.module('Browser related functions');

QUnit.test('detection of mobile operating system', function () {
	var testCases = [
			{
				userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
				expectedOutput: 'ios'
			},
			{
				userAgent: 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
				expectedOutput: 'ios'
			},
			{
				userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
				expectedOutput: 'android'
			},
			{
				userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 820)',
				expectedOutput: null
			}
		],
		originalNavigator = window.navigator;

	testCases.forEach(function (testCase) {
		window.navigator = {
			userAgent: testCase.userAgent
		};

		this.equal(Mercury.Utils.Browser.getSystem(), testCase.expectedOutput);
	});

	window.navigator = originalNavigator;
});
