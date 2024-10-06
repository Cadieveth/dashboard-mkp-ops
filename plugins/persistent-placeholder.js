import Vue from "vue";
import { VTextField, VTextarea, VAutocomplete } from "vuetify/lib";

export default {
  install(Vue) {
    [VTextField, VTextarea, VAutocomplete].forEach((component) => {
      component.options.props.persistentPlaceholder.default = true;
    });
  },
};
