import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

moduleForComponent('infobox-builder', 'Unit | Component | infobox builder', {
	unit: true
});

test('sets correct value for showOverlay property', function (assert) {
	const component = this.subject(),
		cases = [
			{
				isLoading: true,
				showSuccess: true,
				showOverlay: true
			},
			{
				isLoading: false,
				showSuccess: true,
				showOverlay: true
			},
			{
				isLoading: true,
				showSuccess: false,
				showOverlay: true
			},
			{
				isLoading: false,
				showSuccess: false,
				showOverlay: false
			}
		];

	cases.forEach((testCase) => {
		component.set('isLoading', testCase.isLoading);
		component.set('showSuccess', testCase.showSuccess);

		assert.equal(component.get('showOverlay'), testCase.showOverlay);
	});
});

test('sets correct value for isReorderTooltipVisible property', function (assert) {
	const component = this.subject(),
		cases = [
			{
				isPreviewItemHovered: true,
				isPreviewItemDragged: false,
				isReorderTooltipVisible: true
			},
			{
				isPreviewItemHovered: false,
				isPreviewItemDragged: false,
				isReorderTooltipVisible: false
			},
			{
				isPreviewItemHovered: true,
				isPreviewItemDragged: true,
				isReorderTooltipVisible: false
			},
			{
				isPreviewItemHovered: false,
				isPreviewItemDragged: true,
				isReorderTooltipVisible: false
			}
		];

	cases.forEach((testCase) => {
		component.set('isPreviewItemHovered', testCase.isPreviewItemHovered);
		component.set('isPreviewItemDragged', testCase.isPreviewItemDragged);

		assert.equal(component.get('isReorderTooltipVisible'), testCase.isReorderTooltipVisible);
	});
});

test('sets correct properties values for showing reorder item tooltip', function (assert) {
	const component = this.subject(),
		tooltipDistanceFromCursor = 10,
		posX = 10,
		posY = 20;

	component.set('tooltipDistanceFromCursor', tooltipDistanceFromCursor);
	component.send('showReorderTooltip', posX, posY);

	assert.equal(component.get('isPreviewItemHovered'), true);
	assert.equal(component.get('tooltipPosX'), posX + tooltipDistanceFromCursor);
	assert.equal(component.get('tooltipPosy', posY));
});

test('correct resets properties values for hiding reorder item tooltip', function (assert) {
	const component = this.subject(),
		position = 10;

	component.set('isPreviewItemHovered', true);
	component.set('tooltipPosX', position);
	component.set('tooltipPosy', position);
	component.send('hideReorderTooltip');

	assert.equal(component.get('isPreviewItemHovered'), false);
	assert.equal(component.get('tooltipPosX'), null);
	assert.equal(component.get('tooltipPosy', null));
});

test('sets correct properties values when drugging an item', function (assert) {
	const component = this.subject();

	component.set('activeItem', null);
	component.set('isPreviewItemDragged', false);
	component.send('onPreviewItemDrag', null);

	assert.equal(component.get('isPreviewItemDragged'), true);
	component.set('isPreviewItemDragged', false);
});

test('sets correct properties values when dropping an item', function (assert) {
	const component = this.subject();

	component.set('isPreviewItemDragged', true);
	component.send('onPreviewItemDrop');

	assert.equal(component.get('isPreviewItemDragged'), false);
});

test('reset item in edit mode on drugging if action trigger is different than item in edit mode', function (assert) {
	const component = this.subject(),
		activeItemMock = 1,
		actionTriggerMock = 2,
		setEditItemSpy = sinon.spy();

	component.set('activeItem', activeItemMock);
	component.set('setEditItem', setEditItemSpy);
	component.send('onPreviewItemDrag', actionTriggerMock);

	assert.equal(setEditItemSpy.called, true);
	assert.equal(setEditItemSpy.calledWith(null), true);

	component.set('isPreviewItemDragged', false);
});

test('reset item in edit mode on drugging if action trigger is different than item in edit mode', function (assert) {
	const component = this.subject(),
		actionTriggerMock = 1,
		setEditItemSpy = sinon.spy();

	component.set('activeItem', actionTriggerMock);
	component.set('setEditItem', setEditItemSpy);
	component.send('onPreviewItemDrag', actionTriggerMock);

	assert.equal(setEditItemSpy.called, false);

	component.set('isPreviewItemDragged', false);
});

test('stopped event propagation while setting edit item', function (assert) {
	const component = this.subject(),
		itemMock = {},
		stopPropagationSpy = sinon.spy(),
		setEditItemSpy = sinon.spy(),
		eventMock = {
			stopPropagation: stopPropagationSpy
		};

	component.set('setEditItem', setEditItemSpy);
	component.send('setEditItemAndStopPropagation', itemMock, eventMock);

	assert.equal(stopPropagationSpy.calledOnce, true);
});
