import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | application wrapper', function(hooks) {
  setupTest(hooks);

  function createElement(tag, className) {
      const element = document.createElement(tag),
          parent = document.createElement('div');

      element.className = className;
      parent.appendChild(element);

      return element;
  }

  test('shouldHandleClick returns correct value', function (assert) {
      const testCases = [
          {
              target: createElement('li', 'mw-content'),
              expected: true
          },
          {
              target: createElement('li'),
              expected: null
          },
          {
              target: createElement('div', 'PDS_Poll'),
              expected: null
          }
      ];

      testCases.forEach((testCase) => {
          const component = this.owner.factoryFor('component:application-wrapper').create();

          assert.equal(component.shouldHandleClick(testCase.target), testCase.expected);
      });
  });
});