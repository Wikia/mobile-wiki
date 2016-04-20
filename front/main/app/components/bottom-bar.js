import Ember from 'ember';
import HeadroomMixin from '../mixins/headroom';

export default Ember.Component.extend(
	HeadroomMixin,
	{
		classNames: ['nav-ab-test-bottom-bar'],
		headroomOptions: {
			classes: {
				unpinned: 'bottom-unpinned'
			}
		}
	}
);
