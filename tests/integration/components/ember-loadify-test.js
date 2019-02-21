import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor, waitUntil } from '@ember/test-helpers';
import { setupFactoryGuy, mockQuery, buildList } from 'ember-data-factory-guy';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember-loadify', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  const NextPageComponent = Component.extend({
    classNames: ['next-page'],
    onClick() {},

    click() {
      this.get('onClick')();
    }
  });

  const ResetRecordsComponent = Component.extend({
    classNames: ['reset-records'],
    onClick() {},

    click() {
      this.get('onClick')();
    }
  });

  hooks.beforeEach(function() {
    document.getElementById('ember-testing-container').scrollTop = 0;

    this.owner.register('component:next-page', NextPageComponent);
    this.owner.register('component:reset-records', ResetRecordsComponent);
  });

  function scrollTo(selector) {
    document.querySelector(selector).scrollIntoView();

    let scrolledTo;
    return waitUntil(() => {
      if (scrolledTo == document.getElementById('ember-testing-container').scrollTop) {
        return true;
      } else {
        scrolledTo = document.getElementById('ember-testing-container').scrollTop;
        return false;
      }
    })
  }

  test('renders with class ember-loadify', async function(assert) {
    mockQuery('user').returns({ json: { data: [] } });

    await render(hbs`{{ember-loadify modelName='user'}}`);

    assert.ok(this.element.querySelector('.ember-loadify'));
  });

  test('loads model records when in view', async function(assert) {
    const users = buildList('user', 2);

    mockQuery('user').returns({ json: users });

    await render(hbs`
      {{#ember-loadify modelName='user' as |loadify|}}
        {{#each loadify.records as |record|}}
          <div class='ember-loadify-record'>{{record.name}}</div>
        {{/each}}
      {{/ember-loadify}}
    `);

    await scrollTo('.ember-loadify');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 2);
  });

  test('bubbles onRecordsLoaded event with records', async function(assert) {
    const users = buildList('user', 2);

    mockQuery('user').returns({ json: users });

    let records;

    this.set('loadedAction', (recordsLoaded) => {
      records = recordsLoaded;
    });

    await render(hbs`{{ember-loadify modelName='user' onRecordsLoaded=(action loadedAction)}}`);

    await scrollTo('.ember-loadify');

    assert.equal(records.length, users.data.length);
  });

  test('bubbles onPageLoaded with model', async function(assert) {
    const users = buildList('user', 2).add({ meta: { total_pages: 1 }});

    mockQuery('user').returns({ json: users });

    let model;

    this.set('loadedAction', (modelReturned) => {
      model = modelReturned;
    });

    await render(hbs`{{ember-loadify modelName='user' onPageLoaded=(action loadedAction)}}`);

    await scrollTo('.ember-loadify');

    assert.equal(model.meta.total_pages, 1);
  });

  test('components can plug in and load the next page', async function(assert) {
    const users1 = buildList('user', 2);
    const users2 = buildList('user', 1);

    mockQuery('user', { page: 1, per_page: 10 }).returns({ json: users1 });
    mockQuery('user', { page: 2, per_page: 10 }).returns({ json: users2 });

    await render(hbs`
      {{#ember-loadify modelName='user' as |loadify|}}
        {{#each loadify.records as |record|}}
          <div class='ember-loadify-record'>{{record.name}}</div>
        {{/each}}
        {{next-page onClick=(action loadify.nextPage)}}
      {{/ember-loadify}}
    `);

    await scrollTo('.ember-loadify');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 2);

    await click('.next-page');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 3);
  });

  test('components can plug in and reset data', async function(assert) {
    const users1 = buildList('user', 2);
    const users2 = buildList('user', 1);

    mockQuery('user', { page: 1, per_page: 10 }).returns({ json: users1 });
    mockQuery('user', { page: 2, per_page: 10 }).returns({ json: users2 });

    await render(hbs`
      {{#ember-loadify modelName='user' page=2 as |loadify|}}
        {{#each loadify.records as |record|}}
          <div class='ember-loadify-record'>{{record.name}}</div>
        {{/each}}
        {{reset-records onClick=(action loadify.reset)}}
      {{/ember-loadify}}
    `);

    await scrollTo('.ember-loadify');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 1);

    await click('.reset-records');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 2);
  });

  test('params affect results', async function(assert) {
    const users1 = buildList('user', 2);
    const users2 = buildList('user', 1);

    mockQuery('user', { page: 1, per_page: 10 }).returns({ json: users1 });
    mockQuery('user', { page: 1, per_page: 10, query: 'text' }).returns({ json: users2 });

    this.set('params', {});

    await render(hbs`
      {{#ember-loadify modelName='user' params=params as |loadify|}}
        {{#each loadify.records as |record|}}
          <div class='ember-loadify-record'>{{record.name}}</div>
        {{/each}}
        {{reset-records onClick=(action loadify.reset)}}
      {{/ember-loadify}}
    `);

    await scrollTo('.ember-loadify');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 2);

    this.set('params', { query: 'text' });

    await waitFor('.ember-loadify-record');

    assert.equal(this.element.querySelectorAll('.ember-loadify-record').length, 1);
  });

  test('adds ember-loadify--loading class when loading data', async function(assert) {
    const users = buildList('user', 2);

    mockQuery('user').returns({ json: users });

    await render(hbs`{{ember-loadify modelName='user' isLoading=true}}`);

    assert.ok(this.element.querySelector('div').classList.contains('ember-loadify--loading'));
  });
});
