import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import layout from '../../templates/components/ember-loadify/pagination';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Component.extend(InViewportMixin, {
  layout,
  isFirstPage: equal('currentPage', 1),
  isOnePage: equal('totalPages', 1),

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

  nextPages: computed('currentPage', 'isFirstPage', function() {
    const startPage = (this.isFirstPage ? 2 : this.currentPage);
    return this._range(startPage, (this.currentPage + 5));
  }),

  previousPages: computed('currentPage', function() {
    const twoPageBefore = this.currentPage - 2;
    return this._range(twoPageBefore, (this.currentPage - 1));
  }),

  linksAfter: computed('nextPages', 'totalPages', function() {
    return this.nextPages.filter((int) => {
      return int < this.totalPages;
    });
  }),

  linksBefore: computed('previousPages', function() {
    return this.previousPages.filter((int) => {
      return int > 1;
    });
  }),

  pageLinks: computed('linksBefore', 'linksAfter', function() {
    return this.linksBefore.concat(this.linksAfter);
  }),

  showPreviousEllipses: computed('linksBefore', 'previousPages', function() {
    return this.linksBefore.length == this.previousPages.length;
  }),

  showNextEllipses: computed('nextPages', 'linksAfter', function() {
    return this.linksAfter.length == this.nextPages.length;
  }),

  _range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  },

  didEnterViewport() {
    if (this.get('infinite'))
      this.send('nextPage');
  }
});
