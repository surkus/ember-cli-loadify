import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { isNone, isEqual } from '@ember/utils';
import { computed } from '@ember/object';
import { bool, not, equal } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { task } from 'ember-concurrency';
import layout from '../templates/components/ember-loadify';

export default Component.extend(InViewportMixin, {
  layout,
  store: service(),

  classNames: ['ember-loadify'],
  classNameBindings: ['isLoading:ember-loadify--loading'],
  nextPageText: 'Load More',
  page: 1,
  perPage: 10,
  totalPages: 0,
  showPagination: true,
  onRecordsLoaded() {},

  isLoading: bool('queryRecords.isRunning'),
  isResetting: bool('resetRecords.isRunning'),
  isEmpty: equal('records.length', 0),
  canLoadMore: not('isLastPage'),

  isLastPage: computed('page', 'totalPages', function() {
    return this.get('page') >= this.get('totalPages');
  }),

  queryParams: computed('params', 'page', 'perPage', function() {
    return assign(this.get('params') || {},  { page: this.get('page'), per_page: this.get('perPage') });
  }),

  init() {
    this._super(...arguments);

    if (isNone(this.get('records')))
      this.set('records', A([]));
  },

  didEnterViewport() {
    this.get('queryRecords').perform();
  },

  didReceiveAttrs() {
    this.set('params', this.get('params') || {});
    this.set('oldParams', this.get('params'));
  },

  didUpdateAttrs() {
    if (!isEqual(this.get('params'), this.get('oldParams'))) {
      this.set('oldParams', this.get('params'));
      this.get('resetRecords').perform();
    }
  },

  actions: {
    nextPage() {
      this.incrementProperty('page', 1);
      this.get('queryRecords').perform();
    }
  },

  resetRecords: task(function*() {
    this.set('page', 1);
    this.set('totalPages', 0);
    this.set('records', A([]));
    yield this.get('queryRecords').perform();
  }),

  queryRecords: task(function*() {
    let records = yield this.get('store').query(this.get('modelName'), this.get('queryParams'));
    this.set('totalPages', records.meta.total_pages);
    this.get('records').pushObjects(records.toArray());
    this.get('onRecordsLoaded')(this.get('records'));
  }).restartable()
});
