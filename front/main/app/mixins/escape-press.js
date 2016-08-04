import Ember from 'ember';

export default Ember.Mixin.create({

	wasEscapePressed(event){
		return event.keyCode === 27;
	},

	/**
	 * This method should be overwritten, is it just stubbed here
	 *
	 * @returns {void}
	 */
	escapePress() {},

	escapeOff() {
		$(document).off('keydown.escape-press');
	},

	escapeOn() {
		$(document).on('keydown.escape-press', (event) => {
			if(this.wasEscapePressed(event)) {
				this.escapePress();
			}
		});
	},

	escapeOnce() {
		$(document).one('keydown.escape-press', (event) => {
			if(this.wasEscapePressed(event)) {
				this.escapePress();
			}
		});
	},
});
