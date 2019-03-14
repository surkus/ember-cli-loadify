import Component from '@ember/component';
import layout from '../../../templates/components/ember-loadify/pagination/page-link';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  onClick() {},

  classNames: ['ember-loadify-page'],
  classNameBindings: ['isSelected:ember-loadify-page--current'],

  isSelected: computed('currentPage', 'page', function() {
    return this.get('currentPage') === this.get('page');
  }),

  actions: {
    click(page) {
      this.get('onClick')(page);
    }
  }
});
