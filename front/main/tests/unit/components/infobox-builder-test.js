import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('infobox-builder', 'Unit | Component | infobox builder', {
	unit: true
});

test('calls scrollPreviewToBottom with debounce after new item is added', function (assert) {
	const component = this.subject(),
		/** stub Ember.run.debounce so we can run it synchronously */
		debounceStub = sinon.stub(Ember.run, 'debounce', (target, func) => {
			func.call(target);
		});

	component.set('addItem', sinon.spy());
	component.scrollPreviewToBottom = sinon.spy();

	Ember.run(() => {
		component.send('addItem', 'row');
	});

	assert.ok(component.scrollPreviewToBottom.calledOnce);

	debounceStub.restore();
});

test('scrolls preview element to the bottom', function (assert) {
	const component = this.subject(),
		animateSpy = sinon.spy();

	sinon.stub(component, '$', () => {
		return {
			animate: animateSpy,
			height: () => 100,
			prop: (propName) => {
				return {
					scrollHeight: 200,
					scrollTop: 0
				}[propName];
			}
		};
	});

	component.scrollPreviewToBottom();

	assert.ok(animateSpy.calledWith({
		scrollTop: 100
	}));
});
