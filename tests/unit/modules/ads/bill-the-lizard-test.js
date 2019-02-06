import { module, test } from 'qunit';
import sinon from 'sinon';
import BillTheLizard from 'mobile-wiki/modules/ads/bill-the-lizard';


module('Unit | Module | ads | bill-the-lizard', (hooks) => {
  const getBidsStub = sinon.stub(BillTheLizard, 'getBids');

  hooks.beforeEach(() => {
    window.Wikia.adServices = {
      billTheLizard: {
        getPrediction: sinon.stub(),
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
      .returns({ result: 0 });

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
      'reused;res=0;incontent_boxad_2',
    );
  });

  test('standard cheshire cat flow: IC1 never used, IC2 reused, IC3 on_time since prediction = 1', (assert) => {
    window.Wikia.adServices.billTheLizard.getPreviousPrediction
      .onFirstCall()
      .returns(undefined)
      .onSecondCall()
      .returns({ result: 0 })
      .onThirdCall()
      .returns({ result: 0 });

    window.Wikia.adServices.billTheLizard.getPrediction
      .returns({ result: 0 });

    getBidsStub
      .returns(['bid']);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.NOT_USED, 'incontent_boxad_1'),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.REUSED, 'incontent_boxad_2'),
      'reused;res=0;incontent_boxad_2',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.ON_TIME, 'incontent_boxad_3'),
      'on_time;res=0;incontent_boxad_3',
    );
  });

  test('failure for IC2 without prediction for IC1', (assert) => {
    window.Wikia.adServices.billTheLizard.getPreviousPrediction
      .returns(undefined);

    window.Wikia.adServices.billTheLizard.getPrediction
      .returns(undefined);

    getBidsStub
      .returns(['bid']);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.NOT_USED, 'incontent_boxad_1'),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.FAILURE, 'incontent_boxad_2'),
      'failure',
    );
  });

  test('failure for IC3 with prediction for IC2', (assert) => {
    window.Wikia.adServices.billTheLizard.getPreviousPrediction
      .onFirstCall()
      .returns(undefined)
      .onSecondCall()
      .returns({ result: 0 })
      .onThirdCall()
      .returns({ result: 0 });

    window.Wikia.adServices.billTheLizard.getPrediction
      .returns(undefined);

    getBidsStub
      .returns(['bid']);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.NOT_USED, 'incontent_boxad_1'),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.REUSED, 'incontent_boxad_2'),
      'reused;res=0;incontent_boxad_2',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(window.Wikia.adServices.BillTheLizard.FAILURE, 'incontent_boxad_3'),
      'failure;res=0;incontent_boxad_3',
    );
  });
});
