// Derived from https://github.com/facebook/react/blob/1be9a9e/examples/todomvc-backbone/js/app.js#L148-L171

// An example generic Mixin that you can add to any component that should react
// to changes in a Backbone component. The use cases we've identified thus far
// are for Collections -- since they trigger a change event whenever any of
// their constituent items are changed there's no need to reconcile for regular
// models. One caveat: this relies on getBackboneModels() to always return the
// same model instances throughout the lifecycle of the component. If you're
// using this mixin correctly (it should be near the top of your component
// hierarchy) this should not be an issue.

'use strict';

var BackboneMixin = {
  componentDidMount: function() {
    // Whenever there is a change to the Backbone collection, trigger a reconcile.
    this.getBackboneCollection().on('add change remove', this.forceUpdate.bind(this, null), this);

    // Whenever there is a change in a Backbone model in the collection, trigger a reconcile.
    this.getBackboneCollection().forEach(function(model) {
      model.on('add change remove', this.forceUpdate.bind(this, null), this);
    }, this);
  },

  componentWillUnmount: function() {
    // Ensure that we clean up any dangling references when the component is
    // destroyed.
    this.getBackboneCollection().off(null, null, this);

    this.getBackboneCollection().forEach(function(model) {
      model.off(null, null, this);
    }, this);
  }
};

module.exports = BackboneMixin;
