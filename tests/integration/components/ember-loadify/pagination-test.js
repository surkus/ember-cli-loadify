import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember-loadify/pagination', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    document.getElementById('ember-testing-container').scrollTop = 0;
  });

  test('it renders with ember-loadify-pagination class', async function(assert) {
    await render(hbs`{{ember-loadify/pagination}}`);

    assert.ok(this.element.querySelector('div').classList.contains('ember-loadify-pagination'));
  });

  test('it renders button with text', async function(assert) {
    const text = 'Load More!';
    this.set('text', text);

    await render(hbs`{{ember-loadify/pagination text=text}}`);

    assert.equal(this.element.querySelector('.ember-loadify-next-page').textContent.trim(), text);
  });

  test('clicking button fires onNextPage action', async function(assert) {
    let didCallAction = false;

    this.set('onNextPage', () => {
      didCallAction = true;
    });

    await render(hbs`{{ember-loadify/pagination onNextPage=(action onNextPage)}}`);
    await click('.ember-loadify-next-page');

    assert.ok(didCallAction, 'callback was fired');
  });

  test('scrolling to element fires onNextPage action', async function(assert) {
    let didCallAction = false;

    this.set('onNextPage', () => {
      didCallAction = true;
    });

    await render(hbs`{{ember-loadify/pagination infinite=true text="fun" onNextPage=(action onNextPage)}}`);
    document.querySelector('.ember-loadify-next-page').scrollIntoView();

    let scrolledTo = 0;
    await waitUntil(() => {
      if (scrolledTo == document.getElementById('ember-testing-container').scrollTop) {
        return true;
      } else {
        scrolledTo = document.getElementById('ember-testing-container').scrollTop;
        return false;
      }
    })

    assert.ok(didCallAction, 'callback was fired');
  });

  test('display paginanation links', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=1 totalPages=3}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-page').length, 3);
  });

  test('does not display ellipses points', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=1 totalPages=3}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-ellipses').length, 0);
  });

  test('display ellipses points if pagination is truncated', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=9 totalPages=16}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-ellipses').length, 2);
  });

  test('display ellipses points if there are more than 5 pages after the current page', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=1 totalPages=16}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-ellipses').length, 1);
  });

  test('display ellipses points if there are more than 2 pages before the current page', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=4 totalPages=6}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-ellipses').length, 1);
  });

  test('it truncates paginanation links before two after the current page', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=3 totalPages=10}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-page').length, 9);
  });

  test('it truncates paginanation links five after the current page', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=1 totalPages=10}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-page').length, 7);
  });

  test('it displays one page link if there is one page in total', async function(assert) {
    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=1 totalPages=1}}`);

    assert.equal(this.element.querySelectorAll('.ember-loadify-page').length, 1);
  });

  test('click on a page link calls onGoToPage', async function(assert) {
    let pageClicked = null;

    this.set('onGoToPage', (page) => {
      pageClicked = page;
    });

    await render(hbs`{{ember-loadify/pagination paginate=true currentPage=1 totalPages=3 onGoToPage=(action onGoToPage)}}`);

    await click('li:nth-of-type(2) a');

    assert.equal(pageClicked, 2);
  });

});
