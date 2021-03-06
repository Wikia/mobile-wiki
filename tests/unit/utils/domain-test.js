import { module, test } from 'qunit';
import require from 'require';

module('Unit | Utility | domain test', () => {
  test('extracts domain from provided urls', (assert) => {
    const testCasesForExtractDomainFromUrl = [
      {
        url: 'http://thelastofus.james.wikia-dev.us/wiki/MakerTest',
        expected: 'thelastofus.james.wikia-dev.us',
      },
      {
        url: 'witcher.wikia.com',
        expected: 'witcher.wikia.com',
      },
      {
        url: 'http://wikia.com',
        expected: 'wikia.com',
      },
      {
        url: 'http://greenhouse.io/costam/razraz?parametr1=costam.dwa&trzy',
        expected: 'greenhouse.io',
      },
      {
        url: '',
        expected: null,
      },
      {
        url: 'toniedomena',
        expected: null,
      },
      {
        url: 'wikia.',
        expected: null,
      },
    ];

    testCasesForExtractDomainFromUrl.forEach((testCase) => {
      assert.strictEqual(require('mobile-wiki/utils/domain').default(testCase.url), testCase.expected);
    });
  });
});
