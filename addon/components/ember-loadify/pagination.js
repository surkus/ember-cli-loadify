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

  previousPageLinks: computed('currentPage', function() {
    const twoPagesBefore = this.get('currentPage') - 2;
    const lastDisplayLink  = twoPagesBefore < 1 ? 1 : twoPagesBefore;

    return Array(this.get('currentPage') - lastDisplayLink).fill().map((_, idx) => lastDisplayLink + idx);
  }),

  nextPageLinks: computed('totalPages', 'currentPage', function() {
    const fivePagesAfter = this.get('currentPage') + 5 ;
    const lastDisplayLink  = this.get('totalPages') < fivePagesAfter ? this.get('totalPages') : fivePagesAfter;

    return Array(lastDisplayLink - this.get('currentPage') + 1).fill().map((_, idx) => this.get('currentPage') + idx);
  }),

  pageLinks: computed('totalPages', function() {
    return this.truncatePagination ? this.previousPageLinks.concat(this.nextPageLinks) : Array.from({length: this.get('totalPages')}, (v, k) => k+1);
  }),

  didEnterViewport() {
    if (this.get('infinite'))
      this.send('nextPage');
  }
});
