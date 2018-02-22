import { find, render } from '@ember/test-helpers';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

const buttonSelector = '.wds-button';

module('Integration | Component | wikia button', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
      this.set('action', sinon.spy());
  });

  test('clicking button triggers action', async function(assert) {
      await render(hbs`{{wikia-ui-components/wds-button onClick=action}}`);
      find(buttonSelector).click();

      assert.equal(this.get('action').called, true);
  });
});
