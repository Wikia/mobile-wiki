import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent(
	'infobox-builder-edit-options-pop-over', 'Unit | Component | infobox builder edit options pop-over',
	{
		unit: true
	}
);

test('correctly sets posX', function (assert) {
	const component = this.subject(),
		targetPosX = 100,
		popOverWidth = 50,
		offsetX = 10;

	component.setProperties({
		targetPosX,
		popOverWidth,
		offsetX
	});

	assert.equal(component.get('posX'), targetPosX - popOverWidth - offsetX);
});

test('correctly sets posY', function (assert) {
	const component = this.subject(),
		targetPosY = 100,
		targetHeight = 30,
		popOverHeight = 50;

	component.setProperties({
		targetPosY,
		targetHeight,
		popOverHeight
	});

	assert.equal(component.get('posY'), targetPosY + targetHeight / 2 - popOverHeight / 2);
});

test('shouldUpdatePosition returns correct value', function (assert) {
	const component = this.subject(),
		cases = [
			{
				visible: true,
				didAttrsChange: true,
				shouldUpdatePosition: true
			},
			{
				visible: false,
				didAttrsChange: true,
				shouldUpdatePosition: false
			},
			{
				visible: true,
				didAttrsChange: false,
				shouldUpdatePosition: false
			},
			{
				visible: false,
				didAttrsChange: false,
				shouldUpdatePosition: false
			}
		];

	cases.forEach((testCase) => {
		component.setProperties({
			visible: testCase.visible,
			didAttrsChange: testCase.didAttrsChange
		});

		assert.equal(component.get('shouldUpdatePosition'), testCase.shouldUpdatePosition);
	});
});

test('resets data for calculation component position', function (assert) {
	const component = this.subject();

	component.setProperties({
		popOverHeight: 1,
		popOverWidth: 1,
		targetHeight: 1,
		targetPosX: 1,
		targetPosY: 1
	});

	component.resetDataForCalculationComponentPosition();

	assert.equal(component.get('popOverHeight'), null);
	assert.equal(component.get('popOverWidth'), null);
	assert.equal(component.get('targetHeight'), null);
	assert.equal(component.get('targetPosX'), null);
	assert.equal(component.get('targetPosY'), null);
});

test('didUpdateAttrs hook set didAttrsChange to true', function (assert) {
	const component = this.subject();

	component.set('visible', false);
	component.didUpdateAttrs();

	assert.equal(component.get('didAttrsChange'), true);
});

test('didUpdateAttrs hook set didAttrsChange to true', function (assert) {
	const component = this.subject();

	component.didUpdateAttrs();

	assert.equal(component.get('didAttrsChange'), true);
});

test('didUpdateAttrs hook handles reset data for calculation component position', function (assert) {
	const component = this.subject(),
		cases = [
			{
				visible: false,
				reset: true,
				message: 'didUpdateAttrs hook should reset data for calculation component position'
			},
			{
				visible: true,
				reset: false,
				message: 'didUpdateAttrs hook should not reset data for calculation component position'
			}
		];

	cases.forEach((testCase) => {
		const spy = sinon.spy();

		component.set('visible', testCase.visible);
		component.set('resetDataForCalculationComponentPosition', spy);

		component.didUpdateAttrs();

		assert.equal(spy.called, testCase.reset, testCase.message);
	});
});

test('didRender hook handles updating position', function (assert) {
	const component = this.subject(),
		cases = [
			{
				shouldUpdatePosition: true,
				spysCalled: true,
				didAttrsChange: false,
				message: 'didRender hook should update position'
			},
			{
				shouldUpdatePosition: false,
				spysCalled: false,
				didAttrsChange: true,
				message: 'didRender hook should not update position'
			}
		];

	cases.forEach((testCase) => {
		const setDataForCalculationComponentPositionSpy = sinon.spy(),
			setComponentCSSPositionSpy = sinon.spy();

		component.setProperties({
			didAttrsChange: true,
			shouldUpdatePosition: testCase.shouldUpdatePosition,
			setDataForCalculationComponentPosition: setDataForCalculationComponentPositionSpy,
			setComponentCSSPosition: setComponentCSSPositionSpy
		});

		Ember.run(() => {
			component.didRender();
		});

		assert.equal(setDataForCalculationComponentPositionSpy.called, testCase.spysCalled, testCase.message);
		assert.equal(setComponentCSSPositionSpy.called, testCase.spysCalled, testCase.message);
		assert.equal(component.get('didAttrsChange'), testCase.didAttrsChange, testCase.message);
	});
});
