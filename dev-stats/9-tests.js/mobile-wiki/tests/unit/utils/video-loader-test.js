define('mobile-wiki/tests/unit/utils/video-loader-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | video loader', function () {
		var VideoLoader = (0, _require2.default)('mobile-wiki/modules/video-loader').default;

		(0, _emberQunit.test)('VideoLoader can tell if a provider is Ooyala v3 or not', function (assert) {
			var testCases = [{
				provider: 'ooyala',
				expected: true
			}, {
				provider: 'ooyala/funimation',
				expected: true
			}, {
				provider: 'OOYALA',
				expected: true
			}, {
				provider: 'OoYaLa/randooom',
				expected: true
			}, {
				provider: 'youtube',
				expected: false
			}];

			assert.expect(testCases.length);
			testCases.forEach(function (testCase) {
				var data = { provider: testCase.provider };
				var videoLoader = new VideoLoader(data);

				assert.equal(videoLoader.isOoyalaV3(), testCase.expected);
			});
		});

		(0, _emberQunit.test)('VideoLoader can tell which provider is using', function (assert) {
			var testCases = [{
				provider: 'ooyala/funimation',
				expected: 'ooyala'
			}, {
				provider: 'OOYALA',
				expected: 'ooyala'
			}, {
				provider: 'OoYaLa/randooom',
				expected: 'ooyala'
			}, {
				provider: 'youtube',
				expected: 'youtube'
			}, {
				provider: 'ooyala-v4',
				expected: 'ooyala-v4'
			}];

			assert.expect(testCases.length);
			testCases.forEach(function (testCase) {
				var data = { provider: testCase.provider };
				var videoLoader = new VideoLoader(data);

				assert.equal(videoLoader.getProviderName(), testCase.expected);
			});
		});

		(0, _emberQunit.test)('getPlayerClassBasedOnProvider returns correct player class', function (assert) {
			var testCases = [{
				provider: 'ooyala',
				expected: 'OoyalaPlayer'
			}, {
				provider: 'youtube',
				expected: 'YouTubePlayer'
			}, {
				provider: 'realgravity',
				expected: 'BasePlayer'
			}, {
				provider: 'ooyala-v4',
				expected: 'OoyalaV4Player'
			}];

			assert.expect(testCases.length);
			testCases.forEach(function (testCase) {
				assert.equal(VideoLoader.getPlayerClassBasedOnProvider(testCase.provider).name, testCase.expected);
			});
		});
	});
});