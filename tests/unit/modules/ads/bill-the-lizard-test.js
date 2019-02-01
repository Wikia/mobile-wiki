import { module, test } from 'qunit';
import BillTheLizard from 'mobile-wiki/modules/ads/bill-the-lizard';


module('Unit | Module | ads | bill-the-lizard', (hooks) => {
  hooks.beforeEach(() => {
    function noop() {}

    window.Wikia.adServices = {
      billTheLizard: {
        getPreviousPrediction: noop,
        getPrediction: noop,
      },
      BillTheLizard: {
        TOO_LATE: 'too_late',
        TIMEOUT: 'timeout',
        FAILURE: 'failure',
        ON_TIME: 'on_time',
        NOT_USED: 'not_used',
        REUSED: 'reused',
      },
    };
  });

  test('default slot status', (assert) => {
    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.NOT_USED, 'bar_boxad_1'),
      window.Wikia.adServices.BillTheLizard.NOT_USED,
    );
  });

  test('default failure slot status', (assert) => {
    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.FAILURE, 'bar_boxad_1'),
      window.Wikia.adServices.BillTheLizard.FAILURE,
    );
  });
});
