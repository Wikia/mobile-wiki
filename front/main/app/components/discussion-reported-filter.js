import DiscussionReportedFilterMixin from '../mixins/discussion-reported-filter';

export default Ember.Component.extend(DiscussionReportedFilterMixin, {
	tagName: 'fieldset',
	classNames: ['discussion-fieldset', 'moderation-fieldset'],

});
