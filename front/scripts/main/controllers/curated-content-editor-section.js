import Ember from 'ember';

const CuratedContentEditorSectionController = Ember.Controller.extend({
	queryParams: {
		isNewSection: 'new'
	}
});

export default CuratedContentEditorSectionController;
