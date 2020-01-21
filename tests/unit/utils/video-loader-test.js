import { module, test } from 'qunit';
import require from 'require';

module('Unit | Utility | video loader', () => {
  const VideoLoader = require('mobile-wiki/modules/video-loader').default;

  test('VideoLoader can tell which provider is using', (assert) => {
    const testCases = [
      {
        provider: 'youtube',
        expected: 'youtube',
      },
    ];

    assert.expect(testCases.length);
    testCases.forEach((testCase) => {
      const data = { provider: testCase.provider };
      const videoLoader = new VideoLoader(data);

      assert.equal(videoLoader.getProviderName(), testCase.expected);
    });
  });
});
