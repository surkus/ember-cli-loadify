import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupFactoryGuy, mockQuery, buildList } from 'ember-data-factory-guy';

module('Unit | Component | ember-loadify', function(hooks) {
  setupTest(hooks);
  setupFactoryGuy(hooks);

  let component;

  hooks.beforeEach(function() {
    component = this.owner.lookup('component:ember-loadify');
    component.set('modelName', 'user');

    const users = buildList('user', 2);
    mockQuery('user').returns({ json: users });
  });

  test('queryParams include params, page, and perPage', function(assert) {
    component.set('params', { name: 'text' });
    component.set('page', 2);
    component.set('perPage', 7);
    assert.deepEqual(component.get('queryParams'), { name: 'text', page: 2, per_page: 7 });
  });

  test('nextPage increments page', function(assert) {
    component.send('nextPage');
    assert.equal(component.get('page'), 2);
  });

  test('resetRecords clears results', function(assert) {
    component.set('records', [1, 2, 3]);
    component.get('resetRecords').perform();
    assert.equal(component.get('page'), 1);
    assert.equal(component.get('records').length, 0);
  });

  test('resetRecords queries new results', async function(assert) {
    component.set('records', [1, 2, 3]);
    await component.get('resetRecords').perform();
    assert.equal(component.get('records').length, 2);
  });

  test('isLastPage when page >= totalPages', function(assert) {
    component.set('totalPages', 2);
    assert.equal(component.get('isLastPage'), false);
    component.set('page', 2);
    assert.equal(component.get('isLastPage'), true);
  })
});
