import Ember from 'ember';

export default Ember.Component.extend({
	renderRun: false,

	didRender() {
		if (!this.renderRun) {
			const recentChangeId = this.get('rc');

			this.renderRun = true;

			if (recentChangeId) {
				const $recentChange = $(`#${recentChangeId}`);

				if ($recentChange) {
					const navHeight = this.get('siteHeadPinned') ? $('.site-head').outerHeight() : 0,
						offsetTop = $recentChange.offset().top - navHeight;

					$('body').scrollTop(offsetTop);
				}
			}
		}
	}
});
