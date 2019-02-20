import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import layout from '../../templates/components/ember-loadify/pagination';

export default Component.extend(InViewportMixin, {
  layout,

  classNames: ['ember-loadify-pagination'],

  onNextPage() {},

  init() {
    this._super(...arguments);
    this.set('viewportSpy', true);
  },

  actions: {
    nextPage() {
      this.get('onNextPage')();
    }
  },

  didEnterViewport() {
    if (this.get('infinite'))
      this.send('nextPage');
  }
});
