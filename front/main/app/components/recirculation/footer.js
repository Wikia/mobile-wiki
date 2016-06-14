import Ember from 'ember';
import RecirculationExperimentMixin from '../../mixins/recirculation-experiment';

export default Ember.Component.extend(
	RecirculationExperimentMixin,
	{
		layoutName: 'components/recirculation/footer',
		label: 'footer',

		/**
		 * A large tolerance is necesary because this component is larger than the viewport
		 * @returns {void}
		 */
		viewportOptionsOverride: Ember.observer('model.title', function () {
			Ember.run.scheduleOnce('afterRender', this, function () {
				const windowHeight = Ember.$(window).innerHeight(),
					elementHeight = this.$().innerHeight(),
					tolerance = elementHeight - windowHeight;

				if (tolerance > 0) {
					Ember.setProperties(this, {
						viewportTolerance: {
							top: tolerance,
							bottom: tolerance,
							left: 0,
							right: 0
						}
					});
				}
			});
		}),
	}
);
