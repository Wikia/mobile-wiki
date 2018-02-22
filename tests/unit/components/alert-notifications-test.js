import {A} from '@ember/array';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | alert notifications', function(hooks) {
  setupTest(hooks);

  test('Dismissing alert', function (assert) {
      const alertOne = {
              type: 'success',
              message: 'Success message',
              callbacks: {}
          },
          alertTwo = {
              type: 'error',
              message: 'Error message',
              callbacks: {}
          },
          component = this.owner.factoryFor('component:alert-notifications').create();

      component.setProperties({
          alerts: A([
              alertOne,
              alertTwo
          ])
      });

      component.send('dismissAlert', alertOne);
      assert.deepEqual(component.get('alerts'), A([alertTwo]), 'First alert should be removed');
  });
});