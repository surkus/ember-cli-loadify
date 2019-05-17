import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import layout from '../../templates/components/ember-loadify/pagination';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Component.extend(InViewportMixin, {
  layout,
  isFirstPage: equal('currentPage', 1),

  classNames: ['ember-loadify-pagination'],
  isOnePage: equal('totalPages', 1),
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

  nextPages: computed('currentPage', function() {
    return  this._range(6, (this.isFirstPage ? 2 : this.currentPage));
  }),

  previousPages: computed('currentPage', function() {
    const twoPageBefore = this.currentPage - 2;
    return this._scope(twoPageBefore, (this.currentPage - 1));
  }),

  linksAfter: computed('currentPage', function() {
    return this.nextPages.filter((int) => {
      return int < this.totalPages;
    });
  }),

  linksBefore: computed('currentPage', function() {
    return this.previousPages.filter((int) => {
      return int > 1;
    });
  }),

  pageLinks: computed('totalPages', function() {
    return this.linksBefore.concat(this.linksAfter);
  }),

  showPreviousEllipses: computed('linksBefore', 'previousPages', function() {
    return this.linksBefore.length == this.previousPages.length;
  }),

  showNextEllipses: computed('nextPages', 'linksAfter', function() {
    return this.linksAfter.length == this.nextPages.length;
  }),

  _range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  },

  _scope(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  },

  didEnterViewport() {
    if (this.get('infinite'))
      this.send('nextPage');
  }
});
