import Ember from 'ember';

export default Ember.Component.extend(
	{
		classNameBindings: ['isEditMode:highlight-overlay-content'],
		isEditMode: false,
	}
);
