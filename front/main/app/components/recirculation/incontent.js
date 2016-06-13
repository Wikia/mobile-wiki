import Ember from 'ember';
import RecirculationExperimentMixin from '../../mixins/recirculation-experiment';

export default Ember.Component.extend(
	RecirculationExperimentMixin,
	{
		layoutName: 'components/recirculation/incontent',
		label: 'in-content',

		/**
		 * A large tolerance is necesary because this component is larger than the viewport
		 * @returns {void}
		 */
		viewportOptionsOverride: Ember.observer('model.title', function () {
			Ember.run.scheduleOnce('afterRender', this, function () {
				const elementHeight = this.$().innerHeight();

				Ember.setProperties(this, {
					viewportTolerance: {
						top: elementHeight,
						bottom: elementHeight,
						left: 0,
						right: 0
					}
				});
			});
		}),
	}
);
