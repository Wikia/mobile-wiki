import {module} from 'qunit';
import require from 'require';
import {test} from 'ember-qunit';

module('Unit | Utility | video loader', () => {
	const VideoLoader = require('mobile-wiki/modules/video-loader').default;

	test('VideoLoader can tell if a provider is Ooyala v3 or not', (assert) => {
		const testCases = [
			{
				provider: 'ooyala',
				expected: true
			},
			{
				provider: 'ooyala/funimation',
				expected: true
			},
			{
				provider: 'OOYALA',
				expected: true
			},
			{
				provider: 'OoYaLa/randooom',
				expected: true
			},
			{
				provider: 'youtube',
				expected: false
			}
		];

		assert.expect(testCases.length);
		testCases.forEach((testCase) => {
			const data = {provider: testCase.provider};
			const videoLoader = new VideoLoader(data);

			assert.equal(videoLoader.isOoyalaV3(), testCase.expected);

		});
	});

	test('VideoLoader can tell which provider is using', (assert) => {
		const testCases = [
			{
				provider: 'ooyala/funimation',
				expected: 'ooyala'
			},
			{
				provider: 'OOYALA',
				expected: 'ooyala'
			},
			{
				provider: 'OoYaLa/randooom',
				expected: 'ooyala'
			},
			{
				provider: 'youtube',
				expected: 'youtube'
			},
		]

		assert.expect(testCases.length);
		testCases.forEach((testCase) => {
			const data = {provider: testCase.provider};
			const videoLoader = new VideoLoader(data);

			assert.equal(videoLoader.getProviderName(), testCase.expected);

		});
	});

	test('getPlayerClassBasedOnProvider returns correct player class', (assert) => {
		const testCases = [
			{
				provider: 'ooyala',
				expected: 'OoyalaPlayer'
			},
			{
				provider: 'youtube',
				expected: 'YouTubePlayer'
			},
			{
				provider: 'realgravity',
				expected: 'BasePlayer'
			}
		];

		assert.expect(testCases.length);
		testCases.forEach((testCase) => {
			assert.equal(VideoLoader.getPlayerClassBasedOnProvider(testCase.provider).name, testCase.expected);
		});
	});


});
