import Ember from 'ember';
import RecirculationExperimentMixin from '../../mixins/recirculation-experiment';

export default Ember.Component.extend(
	RecirculationExperimentMixin,
	{
		layoutName: 'components/recirculation/incontent',
		label: 'in-content'
	}
);
