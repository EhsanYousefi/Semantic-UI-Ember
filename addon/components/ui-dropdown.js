import Ember from 'ember';
import Base from '../mixins/base';
import DataAttributes from '../mixins/data-attributes';
import Item from './ui-dropdown-item';

export default Ember.Select.extend(Base, DataAttributes, {
  classNames: ['ui', 'dropdown'],
  module: 'dropdown',
  tagName: 'div',
  defaultTemplate: null,

  optionView: Item,

  groupedView: null,
  groupedContent: null,

  initialize: Ember.on('didInsertElement', function() {
    var value = this.get('value');
    if (typeof value !== "undefined" && value !== null) {
      this.execute('set selected', value);
    }

    var placeholder = this.get('prompt');
    if (typeof placeholder !== "undefined" && placeholder !== null) {
      this.$().data('placeholderText', placeholder);
    }
  }),

  onChange: function(value, text, $element) {
    if (value === undefined) {
      // The initial set selected doesn't have an value. This is potentially a problem
      // within the main Semantic library
      //
      // https://github.com/Semantic-Org/Semantic-UI/blob/master/src/definitions/modules/dropdown.js#L85
      value = $element.data('value');
    }
    return this.set('value', value);
  },

  onUpdate: Ember.observer('value', function() {
    return Ember.run.scheduleOnce('afterRender', this, this.setValue);
  }),

  onContentChange: Ember.observer('content', function() {
    // Wait for the afterRender portion of the Run Loop to complete after
    // after a content change. Once that happens, re-initialize the
    // Semantic component the same way as Semantic.BaseMixin
    //
    // Without this, Dropdown Items will not be clickable if the content
    // is set after the initial render.
    Ember.run.scheduleOnce('afterRender', this, function() {
      if (this.get('isDestroyed') || this.get('isDestroying')) {
        return;
      }
      this.didInsertElement();
      this.setValue();
    });
  }),

  setValue: function() {
    var dropdownValue, inputValue;
    inputValue = this.get('value');
    dropdownValue = this.execute("get value");
    if (inputValue == null) {
      return this.execute("clear");
    } else if (inputValue !== dropdownValue) {
      return this.execute("set selected", this.get('value'));
    }
  }
});
