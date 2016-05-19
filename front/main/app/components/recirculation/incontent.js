import Ember from 'ember';
import RecirculationExperimentMixin from '../../mixins/recirculation-experiment';

export default Ember.Component.extend(
	RecirculationExperimentMixin,
	{
		layoutName: 'components/recirculation/incontent',
		classNames: 'in-content vertical',
		label: 'in-content',

		items: Ember.computed.map('model.items', (post) => {
			return post;
		})
	}
);
