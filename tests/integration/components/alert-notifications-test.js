import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | alert-notifications', (hooks) => {
  setupRenderingTest(hooks);

  test('should render alerts', async function (assert) {
    assert.expect(3);

    const alerts = [
      { message: '<div id="unsafe-alert">I am an unsafe alert</div>', unsafe: true },
      { message: '<div id="safe-alert">I am a safe alert whose contents are sanitized</div>' },
    ];

    this.set('alerts', alerts);

    await render(hbs`<AlertNotifications @alerts={{this.alerts}}/>`);

    const notifications = this.element.getElementsByClassName('alert-notification');

    assert.equal(notifications.length, 2);
    assert.equal(notifications[0].querySelector('#unsafe-alert').textContent, 'I am an unsafe alert');
    assert.equal(notifications[1].textContent, '<div id="safe-alert">I am a safe alert whose contents are sanitized</div>×');
  });

  test('should remove alert on close', async function (assert) {
    assert.expect(2);

    const alerts = [
      { message: '<div id="unsafe-alert">I am an unsafe alert</div>', unsafe: true },
      { message: '<div id="safe-alert">I am a safe alert whose contents are sanitized</div>' },
    ];

    this.set('alerts', alerts);

    await render(hbs`<AlertNotifications @alerts={{this.alerts}}/>`);

    assert.equal(this.element.getElementsByClassName('alert-notification').length, 2);

    await click('.close');

    assert.equal(this.element.getElementsByClassName('alert-notification').length, 1);
  });
});
