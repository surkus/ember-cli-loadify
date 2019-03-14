import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import layout from '../../templates/components/ember-loadify/pagination';
import { computed } from '@ember/object';

export default Component.extend(InViewportMixin, {
  layout,

  classNames: ['ember-loadify-pagination'],

  onNextPage() {},
  onGoToPage() {},

  init() {
    this._super(...arguments);
    this.set('viewportSpy', true);
  },

  actions: {
    nextPage() {
      this.get('onNextPage')();
    },
    goToPage(page) {
      this.get('onGoToPage')(page);
    }
  },

  pageLinks: computed('totalPages', function() {
    return Array.from({length: this.get('totalPages')}, (v, k) => k+1);
  }),

  didEnterViewport() {
    if (this.get('infinite'))
      this.send('nextPage');
  }
});
