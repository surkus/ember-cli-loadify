import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember-loadify/pagination', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    document.getElementById('ember-testing-container').scrollTop = 0;
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
});