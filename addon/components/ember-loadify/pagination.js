import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import layout from '../../templates/components/ember-loadify/pagination';
import { computed } from '@ember/object';
import { gt, and } from '@ember/object/computed';

export default Component.extend(InViewportMixin, {
  layout,
  isMultiPage: gt('totalPages', 1),
  showPagination: and('paginate', 'isMultiPage'),

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

  pageLinks: computed('currentPage', 'totalPages', function() {
    return this._range(Math.max(2, this.currentPage - 2), Math.min((this.currentPage + 5), (this.totalPages - 1)));
  }),

  showPreviousEllipses: computed('pageLinks', function() {
    return this.pageLinks.length && this.pageLinks[0] != 2;
  }),

  showNextEllipses: computed('pageLinks', 'totalPages', function() {
    return this.pageLinks.length && this.pageLinks[this.pageLinks.length - 1] != (this.totalPages - 1);
  }),

  _range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  },

  didEnterViewport() {
    if (this.get('infinite'))
      this.send('nextPage');
  }
});
