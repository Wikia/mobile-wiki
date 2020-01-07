import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Component | article comments', (hooks) => {
  setupTest(hooks);

  test('page is set correctly within boundaries and buttons are displayed correctly', async function (assert) {
    const component = this.owner.factoryFor('component:article-comments').create();

    assert.expect(18);

    component.setProperties({
      articleId: 10,
      url() {
        return 'http://fallout.wikia.com/wikia.php?controller=MercuryApi&method=getSearchSuggestions&id=10';
      },
      scrollTop() {
      },
    });

    component.setProperties({
      pagesCount: 3,
      page: 2,
    });

    assert.equal(component.get('page'), 2);
    assert.equal(component.get('nextButtonDisabled'), false);
    assert.equal(component.get('prevButtonDisabled'), false);

    component.send('nextPage');

    assert.equal(component.get('page'), 3);
    assert.equal(component.get('nextButtonDisabled'), true);
    assert.equal(component.get('prevButtonDisabled'), false);

    component.send('nextPage');


    assert.equal(component.get('page'), 3);
    assert.equal(component.get('nextButtonDisabled'), true);
    assert.equal(component.get('prevButtonDisabled'), false);

    component.send('prevPage');

    assert.equal(component.get('page'), 2);
    assert.equal(component.get('nextButtonDisabled'), false);
    assert.equal(component.get('prevButtonDisabled'), false);

    component.send('prevPage');

    assert.equal(component.get('page'), 1);
    assert.equal(component.get('nextButtonDisabled'), false);
    assert.equal(component.get('prevButtonDisabled'), true);

    component.send('prevPage');

    assert.equal(component.get('page'), 1);
    assert.equal(component.get('nextButtonDisabled'), false);
    assert.equal(component.get('prevButtonDisabled'), true);
  });
});
