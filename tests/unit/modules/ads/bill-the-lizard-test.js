import { module, test } from 'qunit';
import sinon from 'sinon';
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

  test('2nd IC is marked as reused when 1st IC did not use the bid', (assert) => {
    sinon.stub(BillTheLizard, 'getBids')
      .onFirstCall()
      .returns([])
      .onSecondCall()
      .returns(['bid']);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.NOT_USED, 'incontent_boxad_1'),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.REUSED, 'incontent_boxad_2'),
      'reused;res=1;incontent_boxad_2',
    );
  });
});
