import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('infobox-builder-item-title', 'Unit | Component | infobox builder item title', {
	unit: true
});

test('correctly computes value property', function (assert) {
	const defaultMessageKey = 'first-title-default',
		i18nParamsMock = {
			ns: 'infobox-builder'
		},
		cases = [
			{
				modelMock: {
					data: {
						defaultValue: 'test'
					}
				},
				messageKey: 'title-article-name'
			},
			{
				modelMock: {
					data: {
						defaultValue: ''
					}
				},
				messageKey: defaultMessageKey
			},
			{
				modelMock: {},
				messageKey: defaultMessageKey
			}
		];

	cases.forEach((testCase) => {
		const component = this.subject(),
			messageKey = `main.${testCase.messageKey}`;

		sinon.stub(i18n, 't').returns('test');

		component.set('model', testCase.modelMock);
		component.get('value');

		assert.equal(i18n.t.calledWith(messageKey, i18nParamsMock), true);

		i18n.t.restore();
	});
});

