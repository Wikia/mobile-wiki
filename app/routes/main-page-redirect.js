import Ember from 'ember';
const {Route, inject} = Ember;

export default Route.extend(
	{
		wikiVariables: inject.service(),

		beforeModel() {
			this.replaceWith('wiki-page', this.get('wikiVariables.mainPageTitle'))
		}
	}
);
