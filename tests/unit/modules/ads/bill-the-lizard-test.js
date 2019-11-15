import { module, test } from 'qunit';
import sinon from 'sinon';
import CheshireCat from 'mobile-wiki/modules/ads/ml/cheshire-cat';

module('Unit | Module | ads | bill-the-lizard', (hooks) => {
  hooks.beforeEach(() => {
    window.Wikia.adEngine = {
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
    window.Wikia.adEngine.billTheLizard.getLastReusablePrediction.returns(undefined);

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
        'bar_boxad_1',
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
      ),
      window.Wikia.adEngine.BillTheLizard.NOT_USED,
    );
  });

  test('IC1 didn\'t come but we want IC2 answer', (assert) => {
    window.Wikia.adEngine.billTheLizard.getLastReusablePrediction.returns(undefined);

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.REUSED,
        'bar_boxad_1',
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );
  });

  test('default failure slot status', (assert) => {
    window.Wikia.adEngine.billTheLizard.getLastReusablePrediction.returns(undefined);

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.FAILURE,
        'bar_boxad_1',
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
      ),
      window.Wikia.adEngine.BillTheLizard.FAILURE,
    );
  });

  test('standard cheshire cat flow: IC1 never used, IC2 reused, IC3 on_time since prediction = 1', (assert) => {
    window.Wikia.adEngine.billTheLizard.getLastReusablePrediction
      .returns({ result: 0, callId: 'incontent_boxad_1' });

    window.Wikia.adEngine.billTheLizard.getPrediction
      .returns({ result: 0 });

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
        'incontent_boxad_1',
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.REUSED,
        'incontent_boxad_2',
        window.Wikia.adEngine.BillTheLizard.REUSED,
      ),
      'reused;res=0;incontent_boxad_1',
    );

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.ON_TIME,
        'incontent_boxad_3',
        window.Wikia.adEngine.BillTheLizard.REUSED,
      ),
      'on_time;res=0;incontent_boxad_3',
    );
  });

  test('failure for IC2 without prediction for IC1', (assert) => {
    window.Wikia.adEngine.billTheLizard.getLastReusablePrediction
      .returns(undefined);

    window.Wikia.adEngine.billTheLizard.getPrediction
      .returns(undefined);

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
        'incontent_boxad_1',
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.FAILURE,
        'incontent_boxad_2',
        window.Wikia.adEngine.BillTheLizard.REUSED,
      ),
      'failure',
    );
  });

  test('failure for IC3 with prediction for IC1', (assert) => {
    window.Wikia.adEngine.billTheLizard.getLastReusablePrediction
      .returns({ result: 0, callId: 'incontent_boxad_1' });

    window.Wikia.adEngine.billTheLizard.getPrediction
      .returns(undefined);

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
        'incontent_boxad_1',
        window.Wikia.adEngine.BillTheLizard.NOT_USED,
      ),
      'not_used',
    );

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.REUSED,
        'incontent_boxad_2',
        window.Wikia.adEngine.BillTheLizard.REUSED,
      ),
      'reused;res=0;incontent_boxad_1',
    );

    assert.equal(
      CheshireCat.getBtlSlotStatus(
        window.Wikia.adEngine.BillTheLizard.FAILURE,
        'incontent_boxad_3',
        window.Wikia.adEngine.BillTheLizard.REUSED,
      ),
      'failure;res=0;incontent_boxad_1',
    );
  });
});
