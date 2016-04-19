import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('common/utils/track');
let trackStub;

moduleForComponent('infobox-builder', 'Unit | Component | infobox builder', {
	unit: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		trackStub.restore();
	}
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

test('sets correct properties values when dragging an item', function (assert) {
	const component = this.subject(),
		activeItem = {
			type: 'title'
		};

	component.set('activeItem', activeItem);
	component.set('isPreviewItemDragged', false);

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

	Ember.run(() => component.send('addItem', 'row'));

	assert.ok(component.scrollPreviewToBottom.calledOnce);
	assert.ok(debounceStub.calledWith(component, component.scrollPreviewToBottom, scrollDebounceDuration));

	debounceStub.restore();
});

test('correctly sets sidebarItemProperties name', function (assert) {
	const component = this.subject(),
		cases = [
			{
				activeItem: {
					type: 'test'
				},
				sidebarItemProperties: {
					name: 'infobox-builder-edit-item-test',
					type: 'test'
				},
				message: 'options for item editing'
			},
			{
				activeItem: null,
				sidebarItemProperties: {
					name: 'infobox-builder-add-items',
					type: null
				},
				message: 'options for adding items'
			}
		];

	cases.forEach((testCase) => {
		component.set('activeItem', testCase.activeItem);
		assert.deepEqual(component.get('sidebarItemProperties'), testCase.sidebarItemProperties, testCase.message);
	});
});

test('tryGoToSource handles opening of go to source modal', function (assert) {
	const component = this.subject(),
		cases = [
			{
				isDirty: true,
				modalVisible: true,
				message: 'should open modal'
			},
			{
				isDirty: false,
				modalVisible: false,
				message: 'should not open modal'
			}
		];

	component.set('handleGoToSource', sinon.spy());

	cases.forEach((testCase) => {
		component.set('showGoToSourceModal', false);
		component.set('isDirty', testCase.isDirty);
		component.set('title', true);

		component.send('tryGoToSource');

		assert.equal(component.get('showGoToSourceModal'), testCase.modalVisible, testCase.message);
	});
});

test('tryGoToSource triggers go to source action when no unsaved chagnes', function (assert) {
	const component = this.subject(),
		handleGoToSource = sinon.spy();

	component.set('isDirty', false);
	component.set('handleGoToSource', handleGoToSource);
	component.set('title', true);

	component.send('tryGoToSource');

	assert.equal(handleGoToSource.called, true);
});

test('goToSourceAction hides go to source modal', function (assert) {
	const component = this.subject();

	component.set('handleGoToSource', sinon.spy());
	component.set('showGoToSourceModal', true);

	component.send('goToSource');

	assert.equal(component.get('showGoToSourceModal'), false);
});

/**
 * helper function for testing go to source action
 * @param {Object} assert
 * @returns {Object}
 */
function prepareForHandleSourceEditorClickTest(assert) {
	const component = this.subject(),
		done = assert.async(),
		goToSourceControllerActionStub = sinon.stub(),
		saveStub = sinon.stub().returns(Ember.RSVP.Promise.resolve());

	return {
		component,
		done,
		goToSourceControllerActionStub,
		saveStub
	};
}

test('saves model and sends goToSourceEditor action to the controller', function (assert) {
	const {
		component,
		done,
		goToSourceControllerActionStub,
		saveStub
	} = prepareForHandleSourceEditorClickTest.call(this, assert);

	component.setProperties({
		goToSourceEditor: goToSourceControllerActionStub,
		save: saveStub
	});

	component.handleGoToSource(true).then(() => {
		assert.ok(saveStub.calledWith(false), 'model is saved before redirection');
		assert.ok(
			goToSourceControllerActionStub.calledOnce,
			'controller\'s goToSourceEditor action is called after model is saved'
		);

		done();
	});
});

test(
	'sends goToSourceEditor action to the controller without saving model when user doesn\'t want to save',
	function (assert) {
		const {
			component,
			done,
			goToSourceControllerActionStub,
			saveStub
		} = prepareForHandleSourceEditorClickTest.call(this, assert);

		component.setProperties({
			goToSourceEditor: goToSourceControllerActionStub,
			save: saveStub
		});

		component.handleGoToSource(false).then(() => {
			assert.ok(!saveStub.called, 'model is not saved before redirection');
			assert.ok(
				goToSourceControllerActionStub.calledOnce,
				'controller\'s goToSourceEditor action is called after user rejects saving'
			);

			done();
		});
	}
);

test('sends goToSourceEditor action to the controller without saving model - default action', function (assert) {
	const {
		component,
		done,
		goToSourceControllerActionStub,
		saveStub
		} = prepareForHandleSourceEditorClickTest.call(this, assert);

	component.setProperties({
		goToSourceEditor: goToSourceControllerActionStub,
		save: saveStub
	});

	component.handleGoToSource().then(() => {
		assert.ok(!saveStub.called, 'model is not saved before redirection');
		assert.ok(
			goToSourceControllerActionStub.calledOnce,
			'controller\'s goToSourceEditor action is called after user rejects saving'
		);

		done();
	});
});

test('correctly calculates infoboxTemplateTitle computed property', function (assert) {
	const component = this.subject(),
		defaultTitle = 'lorem ipsum',
		customTitle = 'ipsum dolor',
		cases = [
			{
				title: customTitle,
				infoboxTemplateTitle: customTitle,
				message: 'returns custom title'
			},
			{
				infoboxTemplateTitle: defaultTitle,
				message: 'returns defaulttitle title'
			}
		];

	sinon.stub(i18n, 't').returns(defaultTitle);

	cases.forEach((testCase) => {
		component.set('title', testCase.title || null);
		assert.equal(component.get('infoboxTemplateTitle'), testCase.infoboxTemplateTitle);
	});

	i18n.t.restore();
});

test('opens edit item modal for untitled infobox template on save', function (assert) {
	const component = this.subject(),
		showEditTitleModalSpy = sinon.spy();

	component.set('title', null);
	component.set('showEditTitleModal', showEditTitleModalSpy);
	component.send('publish');

	assert.equal(showEditTitleModalSpy.called, true);
});

test('correctly calculates editTitleModalConfirmButtonLabel', function (assert) {
	const component = this.subject(),
		messageMock = 'test',
		i18nOptions = {
			ns: 'infobox-builder'
		},
		cases = [
			{
				editTitleModalTrigger: 'publish',
				messageKey: 'edit-title-modal-publish'
			},
			{
				editTitleModalTrigger: 'test123',
				messageKey: 'edit-title-modal-ok'
			}
		];

	cases.forEach((testCase) => {
		const messageKey = `main.${testCase.messageKey}`;

		sinon.stub(i18n, 't').returns(messageMock);

		component.set('editTitleModalTrigger', testCase.editTitleModalTrigger);

		assert.equal(component.get('editTitleModalConfirmButtonLabel'), messageMock);
		assert.equal(i18n.t.calledWith(messageKey, i18nOptions), true);

		i18n.t.restore();
	});
});

test('correctly calculates showEditTitleModalCancelButton', function (assert) {
	const component = this.subject(),
		cases = [
			{
				editTitleModalTrigger: 'publish',
				showEditTitleModalCancelButton: false
			},
			{
				editTitleModalTrigger: 'test123',
				showEditTitleModalCancelButton: true
			}
		];

	cases.forEach((testCase) => {
		component.set('editTitleModalTrigger', testCase.editTitleModalTrigger);
		assert.equal(component.get('showEditTitleModalCancelButton'), testCase.showEditTitleModalCancelButton);
	});
});

test('setTemplateTitle changes title and closes modal', function (assert) {
	const component = this.subject(),
		newTitle = 'newTitle';

	component.set('isEditTitleModalVisible', true);
	component.setTemplateTitle(newTitle);

	assert.equal(component.get('title'), newTitle);
	assert.equal(component.get('isEditTitleModalVisible'), false);
});

test('handleSaveResults', function (assert) {
	const component = this.subject(),
		cases = [
			{
				data: {
					success: true,
					conflict: false,
					urls: {
						templatePageUrl: 'www.test.com'
					}
				},
				shouldRedirectToPage: false,
				isVEContext: false,
				expected: {
					showSuccess: true,
					titleExists: false,
					redirectToPageCalled: false,
					showEditTitleModalCalled: false,
					returnToVECalled: false
				},
				message: 'correctly saved template with no redirect needed'
			},
			{
				data: {
					success: true,
					conflict: false,
					urls: {
						templatePageUrl: 'www.test.com'
					}
				},
				shouldRedirectToPage: true,
				isVEContext: false,
				expected: {
					showSuccess: true,
					titleExists: false,
					redirectToPageCalled: true,
					showEditTitleModalCalled: false,
					returnToVECalled: false
				},
				message: 'correctly saved template with redirect'
			},
			{
				data: {
					success: true,
					conflict: false,
					urls: {
						templatePageUrl: 'www.test.com'
					}
				},
				shouldRedirectToPage: false,
				isVEContext: true,
				expected: {
					showSuccess: false,
					titleExists: false,
					redirectToPageCalled: false,
					showEditTitleModalCalled: false,
					returnToVECalled: true
				},
				message: 'correctly saved template with going back to VE'
			},
			{
				data: {
					success: true,
					conflict: false,
					urls: {
						templatePageUrl: 'www.test.com'
					}
				},
				shouldRedirectToPage: true,
				isVEContext: true,
				expected: {
					showSuccess: false,
					titleExists: false,
					redirectToPageCalled: false,
					showEditTitleModalCalled: false,
					returnToVECalled: true
				},
				message: 'correctly saved template with with going back to VE'
			},
			{
				data: {
					success: false,
					conflict: true,
					urls: {
						templatePageUrl: 'www.test.com'
					}
				},
				shouldRedirectToPage: false,
				isVEContext: false,
				expected: {
					showSuccess: false,
					titleExists: true,
					redirectToPageCalled: false,
					showEditTitleModalCalled: true,
					returnToVECalled: false
				},
				message: 'naming conflict with no redirect'
			},
			{
				data: {
					success: false,
					conflict: true,
					urls: {
						templatePageUrl: 'www.test.com'
					}
				},
				shouldRedirectToPage: true,
				isVEContext: false,
				expected: {
					showSuccess: false,
					titleExists: true,
					redirectToPageCalled: false,
					showEditTitleModalCalled: true,
					returnToVECalled: false
				},
				message: 'naming conflict with redirect'
			}
		];

	cases.forEach((testCase) => {
		const redirectToPageSpy = sinon.spy(),
			returnToVESpy = sinon.spy(),
			showEditTitleModalSpy = sinon.spy();

		component.set('showEditTitleModal', showEditTitleModalSpy);
		component.set('redirectToPageAction', redirectToPageSpy);
		component.set('returnToVE', returnToVESpy);
		component.set('showSuccess', false);
		component.set('titleExists', false);
		component.set('isVEContext', testCase.isVEContext);
		component.handleSaveResults(testCase.data, testCase.shouldRedirectToPage);

		assert.equal(
			component.get('showSuccess'),
			testCase.expected.showSuccess,
			`${testCase.message}- showSuccess`
		);
		assert.equal(
			component.get('titleExists'),
			testCase.expected.titleExists,
			`${testCase.message}- titleExists`
		);
		assert.equal(
			redirectToPageSpy.called,
			testCase.expected.redirectToPageCalled,
			`${testCase.message}- redirectToPageCalled`
		);
		assert.equal(
			showEditTitleModalSpy.called,
			testCase.expected.showEditTitleModalCalled,
			`${testCase.message}- showEditTitleModalCalled`
		);
		assert.equal(
			returnToVESpy.called,
			testCase.expected.returnToVECalled,
			`${testCase.message}- returnToVECalled`
		);
	});
});
