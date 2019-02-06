import { module, test } from 'qunit';
import sinon from 'sinon';
import BillTheLizard from 'mobile-wiki/modules/ads/bill-the-lizard';


module('Unit | Module | ads | bill-the-lizard', (hooks) => {
  function noop() {}

  const getBidsStub = sinon.stub(BillTheLizard, 'getBids');

  hooks.beforeEach(() => {
    window.Wikia.adServices = {
      billTheLizard: {
        getPrediction: noop,
        getPreviousPrediction: sinon.stub(),
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
    window.Wikia.adServices.billTheLizard.getPreviousPrediction.returns(undefined);
    getBidsStub.returns(['bid']);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.NOT_USED, 'bar_boxad_1'),
      window.Wikia.adServices.BillTheLizard.NOT_USED,
    );
  });

  test('default failure slot status', (assert) => {
    window.Wikia.adServices.billTheLizard.getPreviousPrediction.returns(undefined);
    getBidsStub.returns(['bid']);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.FAILURE, 'bar_boxad_1'),
      window.Wikia.adServices.BillTheLizard.FAILURE,
    );
  });

  test('2nd IC is marked as reused when 1st IC did not have prediction and there was no bids', (assert) => {
    window.Wikia.adServices.billTheLizard.getPreviousPrediction
      .onFirstCall()
      .returns(undefined)
      .onSecondCall()
      .returns({ result: 1 });

    getBidsStub
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

  test('2nd IC is marked as reused when 1st IC did not have prediction and did not use bid', (assert) => {
    window.Wikia.adServices.billTheLizard.getPreviousPrediction
      .onFirstCall()
      .returns(undefined)
      .onSecondCall()
      .returns({ result: 1 });

    getBidsStub
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
