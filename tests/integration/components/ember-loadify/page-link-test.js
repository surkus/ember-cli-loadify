import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember-loadify/page-link', function(hooks) {
  setupRenderingTest(hooks);

  test('display current page link selected', async function(assert) {
    await render(hbs`{{ember-loadify/page-link page=2 currentPage=2}}`);

    assert.ok(this.element.querySelector('.ember-loadify-page').classList.contains('ember-loadify-page--current'));
  });

  test('click on a page link calls onclick', async function(assert) {
    let pageClicked = null;

    this.set('onClick', (page) => {
      pageClicked = page;
    });

    await render(hbs`{{ember-loadify/page-link page=2 currentPage=1 onClick=(action onClick)}}`);

    await click('a');

    assert.equal(pageClicked, 2);
  });
});
