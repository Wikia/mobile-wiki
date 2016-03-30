import Ember from 'ember';
import { EKMixin, keyUp } from 'ember-keyboard';


export default Ember.Mixin.create(
	EKMixin,
	{
		classNames: ['infobox-builder-sidebar-padding'],

		activateKeyboard: Ember.on('init', function () {
			this.set('keyboardActivated', true);
		}),

		onEscapeKeyUp: Ember.on(keyUp('Escape'), function () {
			const onEscapeKeyUpHandler = this.get('exitEditMode');

			if (typeof onEscapeKeyUpHandler === 'function') {
				onEscapeKeyUpHandler()
			}
		})
	}
);
