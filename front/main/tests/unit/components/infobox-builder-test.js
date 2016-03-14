import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

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

test('sets correct value for sortableGroupClassNames property', function (assert) {
	const component = this.subject(),
		baseClassNames = 'portable-infobox pi-background',
		cases = [
			{
				theme: null,
				sortableGroupClassNames: baseClassNames
			},
			{
				theme: '',
				sortableGroupClassNames: baseClassNames
			},
			{
				theme: 'europa',
				sortableGroupClassNames: `${baseClassNames} pi-theme-europa`
			}
		];

	cases.forEach((testCase) => {
		component.set('theme', testCase.theme);

		assert.equal(component.get('sortableGroupClassNames'), testCase.sortableGroupClassNames);
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

test('sets correct properties values when dragging an item', function (assert) {
	const component = this.subject(),
		activeItem = {
			type: 'title'
		};

	component.set('activeItem', activeItem);
	component.set('isPreviewItemDragged', false);
	component.set('trackClick', Ember.K);

	Ember.run(() => component.send('onPreviewItemDrag', activeItem));

	assert.equal(component.get('isPreviewItemDragged'), true);
	component.set('isPreviewItemDragged', false);
});

test('sets correct properties values when dropping an item', function (assert) {
	const component = this.subject();

	component.set('isPreviewItemDragged', true);
	component.send('onPreviewItemDrop');

	assert.equal(component.get('isPreviewItemDragged'), false);
});

test('reset item in edit mode on dragging if action trigger is different than item in edit mode', function (assert) {
	const component = this.subject(),
		activeItemMock = 1,
		actionTriggerMock = 2,
		setEditItemSpy = sinon.spy();

	component.set('activeItem', activeItemMock);
	component.set('setEditItem', setEditItemSpy);
	component.set('trackClick', Ember.K);

	Ember.run(() => component.send('onPreviewItemDrag', actionTriggerMock));

	assert.equal(setEditItemSpy.called, true);
	assert.equal(setEditItemSpy.calledWith(null), true);

	component.set('isPreviewItemDragged', false);
});

test('reset item in edit mode on dragging if action trigger is different than item in edit mode', function (assert) {
	const component = this.subject(),
		actionTriggerMock = 1,
		setEditItemSpy = sinon.spy();

	component.set('activeItem', actionTriggerMock);
	component.set('setEditItem', setEditItemSpy);
	component.set('trackClick', Ember.K);

	Ember.run(() => component.send('onPreviewItemDrag', actionTriggerMock));

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
	component.set('trackClick', Ember.K);

	Ember.run(() => component.send('setEditItemAndStopPropagation', itemMock, eventMock));

	assert.equal(stopPropagationSpy.calledOnce, true);
});

test('scrolls preview element to the bottom', function (assert) {
	const component = this.subject(),
		animateSpy = sinon.spy(),
		height = 100,
		scrollHeight = 200,
		scrollTop = 0;

	sinon.stub(component, '$', () => {
		return {
			animate: animateSpy,
			height: () => height,
			prop: (propName) => {
				return {
					scrollHeight,
					scrollTop
				}[propName];
			}
		};
	});

	component.scrollPreviewToBottom();

	assert.ok(animateSpy.calledWith({
		scrollTop: scrollHeight - height
	}));
});

test('calls scrollPreviewToBottom with debounce after new item is added', function (assert) {
	const component = this.subject(),
		/** stub Ember.run.debounce so we can run it synchronously */
		debounceStub = sinon.stub(Ember.run, 'debounce', (target, func) => {
			func.call(target);
		}),
		scrollDebounceDuration = component.get('scrollDebounceDuration');

	component.set('addItem', sinon.spy());
	component.set('scrollPreviewToBottom', sinon.spy());
	component.set('trackClick', Ember.K);

	Ember.run(() => component.send('addItem', 'row'));

	assert.ok(component.scrollPreviewToBottom.calledOnce);
	assert.ok(debounceStub.calledWith(component, component.scrollPreviewToBottom, scrollDebounceDuration));

	debounceStub.restore();
});

test('correctly sets sideBarOptionsComponent name', function (assert) {
	const component = this.subject(),
		cases = [
			{
				activeItem: {
					type: 'test'
				},
				sideBarOptionsComponentName: `infobox-builder-edit-item-test`,
				message: 'options for item editing'
			},
			{
				activeItem: null,
				sideBarOptionsComponentName: 'infobox-builder-add-items',
				message: 'options for adding items'
			}
		];

	cases.forEach((testCase) => {
		component.set('activeItem', testCase.activeItem);
		assert.equal(component.get('sideBarOptionsComponent'), testCase.sideBarOptionsComponentName, testCase.message);
	});
});

function prepareForHandleSourceEditorClickTest(assert) {
	const component = this.subject(),
		confirmStub = sinon.stub(window, 'confirm'),
		done = assert.async(),
		goToSourceEditorStub = sinon.stub(),
		saveStub = sinon.stub().returns(Ember.RSVP.Promise.resolve());

	return {
		component,
		confirmStub,
		done,
		goToSourceEditorStub,
		saveStub
	}
}

test('saves model and sends goToSourceEditor action to the controller', function (assert) {
	const {
		component,
		confirmStub,
		done,
		goToSourceEditorStub,
		saveStub
	} = prepareForHandleSourceEditorClickTest.call(this, assert);

	component.set('goToSourceEditor', goToSourceEditorStub);

	component.setProperties({
		isDirty: true,
		isLoading: false,
		save: saveStub
	});
	confirmStub.returns(true);

	component.handleSourceEditorClick().then(() => {
		assert.ok(saveStub.calledWith(false), 'model is saved before redirection');
		assert.ok(
			goToSourceEditorStub.calledOnce,
			'controller\'s goToSourceEditor action is called after model is saved'
		);

		confirmStub.restore();
		done();
	});
});

test(
	'sends goToSourceEditor action to the controller without saving model when user doesn\'t want to save',
	function (assert) {
		const {
			component,
			confirmStub,
			done,
			goToSourceEditorStub,
			saveStub
		} = prepareForHandleSourceEditorClickTest.call(this, assert);

		component.set('goToSourceEditor', goToSourceEditorStub);

		component.setProperties({
			isDirty: true,
			save: saveStub
		});
		confirmStub.returns(false);

		component.handleSourceEditorClick().then(() => {
			assert.ok(!saveStub.called, 'model is not saved before redirection');
			assert.ok(
				goToSourceEditorStub.calledOnce,
				'controller\'s goToSourceEditor action is called after user rejects saving'
			);

			confirmStub.restore();
			done();
		});
	}
);

test('sends goToSourceEditor action to the controller when there are no changes in model', function (assert) {
	const {
		component,
		confirmStub,
		done,
		goToSourceEditorStub,
		saveStub
	} = prepareForHandleSourceEditorClickTest.call(this, assert);

	component.set('goToSourceEditor', goToSourceEditorStub);

	component.setProperties({
		isDirty: false,
		save: saveStub
	});

	component.handleSourceEditorClick().then(() => {
		assert.ok(!saveStub.called, 'model is not saved when it is not dirty');
		assert.equal(component.get('isLoading'), true, 'isLoading flag is set to true');
		assert.ok(
			goToSourceEditorStub.calledOnce,
			'controller\'s goToSourceEditor action is called when model is not dirty'
		);

		confirmStub.restore();
		done();
	});
});
