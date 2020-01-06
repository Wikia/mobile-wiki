import Mixin from '@ember/object/mixin';

/**
  * This mixin should be considered temporary, until a
  * better solution is created with Jira ticket XW-247
  */
// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  /**
  * @returns {void}
  */
  activate() {
    this.controllerFor('application').set('fullPage', true);
  },

  /**
  * @returns {void}
  */
  deactivate() {
    this.controllerFor('application').set('fullPage', false);
  },
});
