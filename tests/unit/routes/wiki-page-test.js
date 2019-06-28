import EmberObject from '@ember/object';
import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

const model = EmberObject.create({
  url: '/wiki/Kermit',
  description: 'Article about Kermit',
  displayTitle: 'Kermit The Frog',
  htmlTitle: 'Kermit The Frog',
});

const isInitialPageViewStub = sinon.stub();
const initialPageViewStub = Service.extend({
  isInitialPageView: isInitialPageViewStub,
});

module('Unit | Route | wiki page', (hooks) => {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.wgNow = null;
    this.owner.register('service:initial-page-view', initialPageViewStub);
    this['initial-page-view'] = this.owner.lookup('service:initial-page-view');
  });

  test('set head tags for correct model', function (assert) {
    const mock = this.owner.lookup('route:wikiPage');
    const expectedHeadTags = {
      canonical: 'http://muppet.wikia.com/wiki/Kermit',
      description: 'Article about Kermit',
      htmlTitle: 'Kermit The Frog | Muppet Wiki | Fandom powered by Wikia',
      robots: 'index,follow',
      keywords: 'The Fallout wiki - Fallout: New Vegas and more,MediaWiki,fallout,Kermit The Frog',
    };

    mock.setProperties({
      removeServerTags() {
      },
      setStaticHeadTags() {
      },
      headData: EmberObject.create(),
      wikiVariables: {
        basePath: 'http://muppet.wikia.com',
        htmlTitle: {
          parts: ['Muppet Wiki', 'Fandom powered by Wikia'],
          separator: ' | ',
        },
        siteMessage: 'The Fallout wiki - Fallout: New Vegas and more',
        siteName: 'MediaWiki',
        dbName: 'fallout',
        specialRobotPolicy: 'index,follow',
      },
    });

    mock.setDynamicHeadTags(model);
    const headData = mock.get('headData');

    assert.equal(headData.canonical, expectedHeadTags.canonical);
    assert.equal(headData.description, expectedHeadTags.description);
    assert.equal(headData.robots, expectedHeadTags.robots);
    assert.equal(headData.htmlTitle, expectedHeadTags.htmlTitle);
    assert.equal(headData.keywords, expectedHeadTags.keywords);
  });

  test('get correct handler based on model namespace', function (assert) {
    const mock = this.owner.lookup('route:wikiPage');
    const testCases = [{
      expectedHandler: {
        viewName: 'article',
        controllerName: 'article',
      },
      testModel: EmberObject.create({
        ns: 0,
      }),
    },
    {
      expectedHandler: {
        viewName: 'article',
        controllerName: 'article',
      },
      testModel: EmberObject.create({
        ns: 112,
      }),
    },
    {
      expectedHandler: {
        viewName: 'category',
        controllerName: 'category',
      },
      testModel: EmberObject.create({
        ns: 14,
      }),
    },
    {
      expectedHandler: null,
      testModel: EmberObject.create({
        ns: 200,
      }),
    }];

    mock.set('wikiVariables', {
      contentNamespaces: [0, 112],
    });

    testCases.forEach(({ expectedHandler, testModel }) => {
      const handler = mock.getHandler(testModel);

      if (handler) {
        assert.equal(handler.viewName, expectedHandler.viewName, 'viewName is different than expected');
        assert.equal(
          handler.controllerName,
          expectedHandler.controllerName,
          'controllerName is different than expected',
        );
      } else {
        assert.equal(handler, expectedHandler, 'handler is not null');
      }
    });
  });

  test('get correct handler based on model isCuratedMainPage', function (assert) {
    const mock = this.owner.lookup('route:wikiPage');
    const expectedHandler = {
      viewName: 'main-page',
      controllerName: 'main-page',
    };

    model.isCuratedMainPage = true;

    const handler = mock.getHandler(model);

    assert.equal(handler.viewName, expectedHandler.viewName, 'viewName is different than expected');
    assert.equal(handler.controllerName, expectedHandler.controllerName, 'controllerName is different than expected');
  });

  test('reset ads variables on before model', function (assert) {
    isInitialPageViewStub.returns(false);

    const mock = this.owner.lookup('route:wikiPage');
    mock.controllerFor = () => (
      {
        send() {},
      }
    );

    mock.beforeModel({
      to: {
        params: {
          'wiki-page': {
            title: 'foo',
          },
        },
      },
      data: {},
    });

    assert.notEqual(window.wgNow, null);

    isInitialPageViewStub.reset();
  });
});
