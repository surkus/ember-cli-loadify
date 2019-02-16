import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import layout from '../templates/components/ember-loadify';

export default Component.extend(InViewportMixin, {
  layout,
  store: service(),

  classNames: ['ember-loadify'],
  page: 1,
  onRecordsLoaded() {},

  queryParams: computed('page', function() {
    return {
      page: this.get('page')
    };
  }),

  init() {
    this._super(...arguments);
    this.set('records', A([]));
  },

  didEnterViewport() {
    this.get('fetchData').perform();
  },

  actions: {
    nextPage() {
      this.incrementProperty('page', 1);
      this.get('fetchData').perform();
    },

    reset() {
      this.set('page', 1);
      this.set('totalPages', null);
      this.set('records', A([]));
      this.get('fetchData').perform();
    }
  },

  fetchData: task(function*() {
    let records = yield this.get('store').query(this.get('modelName'), this.get('queryParams'));
    this.set('totalPages', records.meta.total_pages);
    this.get('records').pushObjects(records.toArray());
    this.get('onRecordsLoaded')(this.get('records'));
  }).restartable()
});
