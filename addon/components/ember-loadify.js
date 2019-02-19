import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { observer } from '@ember/object';
import { task } from 'ember-concurrency';
import layout from '../templates/components/ember-loadify';

export default Component.extend(InViewportMixin, {
  layout,
  store: service(),

  classNames: ['ember-loadify'],
  classNameBindings: ['isLoading:ember-loadify--loading'],
  page: 1,
  onRecordsLoaded() {},

  isLoading: bool('queryRecords.isRunning'),
  isResetting: bool('resetRecords.isRunning'),

  queryParams: computed('params', 'page', function() {
    return assign(this.get('params') || {},  { page: this.get('page') });
  }),

  paramsChanged: observer('params', function() {
    this.get('resetRecords').perform();
  }),

  init() {
    this._super(...arguments);
    this.set('records', A([]));
  },

  didEnterViewport() {
    this.get('queryRecords').perform();
  },

  actions: {
    nextPage() {
      this.incrementProperty('page', 1);
      this.get('queryRecords').perform();
    }
  },

  resetRecords: task(function*() {
    this.set('page', 1);
    this.set('totalPages', null);
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
