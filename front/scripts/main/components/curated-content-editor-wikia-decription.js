import CuratedContentEditorItemForm from './curated-content-editor-item-form';

export default Ember.Component.extend(
	CuratedContentEditorItemForm,
	{
		classNames: ['curated-content-editor-wikia-description'],
		debounceDuration: 300,
		spinnerOverlay: false
	}
);
