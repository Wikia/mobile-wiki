import { module, test } from 'qunit';
import sinon from 'sinon';
import BillTheLizard from 'mobile-wiki/modules/ads/ml/bill-the-lizard-wrapper';

module('Unit | Module | ads | bill-the-lizard', (hooks) => {
  hooks.beforeEach(() => {
    window.Wikia.adServices = {
      billTheLizard: {
        getPrediction: sinon.stub(),
        getLastReusablePrediction: sinon.stub(),
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

  test('default slot status with not_used as default', (assert) => {
    window.Wikia.adServices.billTheLizard.getLastReusablePrediction.returns(undefined);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.NOT_USED,
        'bar_boxad_1',
        window.Wikia.adServices.BillTheLizard.NOT_USED,
      ),
      window.Wikia.adServices.BillTheLizard.NOT_USED,
    );
  });

  test('IC1 didn\'t come but we want IC2 answer', (assert) => {
    window.Wikia.adServices.billTheLizard.getLastReusablePrediction.returns(undefined);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.REUSED,
        'bar_boxad_1',
        window.Wikia.adServices.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );
  });

  test('default failure slot status', (assert) => {
    window.Wikia.adServices.billTheLizard.getLastReusablePrediction.returns(undefined);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.FAILURE,
        'bar_boxad_1',
        window.Wikia.adServices.BillTheLizard.NOT_USED,
      ),
      window.Wikia.adServices.BillTheLizard.FAILURE,
    );
  });

  test('standard cheshire cat flow: IC1 never used, IC2 reused, IC3 on_time since prediction = 1', (assert) => {
    window.Wikia.adServices.billTheLizard.getLastReusablePrediction
      .returns({ result: 0, callId: 'incontent_boxad_1' });

    window.Wikia.adServices.billTheLizard.getPrediction
      .returns({ result: 0 });

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.NOT_USED,
        'incontent_boxad_1',
        window.Wikia.adServices.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.REUSED,
        'incontent_boxad_2',
        window.Wikia.adServices.BillTheLizard.REUSED,
      ),
      'reused;res=0;incontent_boxad_1',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.ON_TIME,
        'incontent_boxad_3',
        window.Wikia.adServices.BillTheLizard.REUSED,
      ),
      'on_time;res=0;incontent_boxad_3',
    );
  });

  test('failure for IC2 without prediction for IC1', (assert) => {
    window.Wikia.adServices.billTheLizard.getLastReusablePrediction
      .returns(undefined);

    window.Wikia.adServices.billTheLizard.getPrediction
      .returns(undefined);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.NOT_USED,
        'incontent_boxad_1',
        window.Wikia.adServices.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.FAILURE,
        'incontent_boxad_2',
        window.Wikia.adServices.BillTheLizard.REUSED,
      ),
      'failure',
    );
  });

  test('failure for IC3 with prediction for IC1', (assert) => {
    window.Wikia.adServices.billTheLizard.getLastReusablePrediction
      .returns({ result: 0, callId: 'incontent_boxad_1' });

    window.Wikia.adServices.billTheLizard.getPrediction
      .returns(undefined);

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.NOT_USED,
        'incontent_boxad_1',
        window.Wikia.adServices.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.REUSED,
        'incontent_boxad_2',
        window.Wikia.adServices.BillTheLizard.REUSED,
      ),
      'reused;res=0;incontent_boxad_1',
    );

    assert.equal(
      BillTheLizard.getBtlSlotStatus(
        window.Wikia.adServices.BillTheLizard.FAILURE,
        'incontent_boxad_3',
        window.Wikia.adServices.BillTheLizard.REUSED,
      ),
      'failure;res=0;incontent_boxad_1',
    );
  });
});
