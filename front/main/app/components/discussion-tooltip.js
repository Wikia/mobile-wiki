import Ember from 'ember';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		classNames: ['discussion-tooltip-wrapper'],
		desktopText: null,
		mobileText: null,
		text: null,

		desktopTooltipText: Ember.computed('text', 'desktopText', function() {
			const t = this.get('desktopText');
			return Boolean(t) ? t : this.get('text');
		}),

		mobileTooltipText: Ember.computed('text', 'mobileText', function() {
			const t = this.get('mobileText');
			return Boolean(t) ? t : this.get('text');
		})
	});
