import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement() {
		const recentChangeId = this.get('rc');

		if (recentChangeId) {
			const $recentChange = $(`#${recentChangeId}`);

			if ($recentChange) {
				const navHeight = this.get('siteHeadPinned') ? $('.site-head').outerHeight() : 0,
					offsetTop = $recentChange.offset().top - navHeight;

				$('body').scrollTop(offsetTop);
				$('#recent-changes').find('.current-change').animate({opacity: 0}, 2000);
			}
		}
	}
});
