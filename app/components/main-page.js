import { inject as service } from '@ember/service';
import { and, reads } from '@ember/object/computed';
import Component from '@ember/component';
import { run } from '@ember/runloop';

export default Component.extend(
  {
    classNames: ['main-page-modules', 'main-page-body'],
    tagName: 'section',

    title: reads('wikiVariables.siteName'),

    curatedContentToolButtonVisible: and('currentUser.rights.curatedcontent'),

    init() {
      this._super(...arguments);
    },
  },
);
