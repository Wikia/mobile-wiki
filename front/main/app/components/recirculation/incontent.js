import Ember from 'ember';
import RecirculationExperimentMixin from '../../mixins/recirculation-experiment';

export default Ember.Component.extend(
	RecirculationExperimentMixin,
	{
		layoutName: 'components/recirculation/incontent',
		classNames: 'in-content',
		label: 'in-content'
	}
);
