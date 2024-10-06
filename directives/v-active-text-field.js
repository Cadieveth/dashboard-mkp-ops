import Vue from "vue";

Vue.directive("active-text-field", {
  inserted: function (el, binding) {
    el.querySelector("input").value = binding.value || " ";
  },
});
