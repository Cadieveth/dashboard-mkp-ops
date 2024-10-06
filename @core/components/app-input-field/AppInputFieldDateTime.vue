<template>
  <v-datetime-picker label="Select Datetime"> </v-datetime-picker>
  <!-- 
  <v-menu
    v-model="menuStart"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
  </v-menu> -->
</template>

<script>
import Vue from "vue";
import { mdiCalendar } from "@mdi/js";
import themeConfig from "@themeConfig";
import DatetimePicker from "vuetify-datetime-picker";

Vue.use(DatetimePicker);

export default {
  name: "ChildDate",
  props: {
    valueDate: { type: String, default: "" },
    valueTime: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    labelTitle: { type: String, default: "" },
    clearable: { type: Boolean, default: false },
    index: { type: Number, default: 0 },
    dense: { type: Boolean, default: true },
    maxDate: { type: String, default: "" },
    minDate: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    handleClear: { type: Function, default: () => console.log() },
  },
  data() {
    return {
      menuStart: false,
      dialog: false,
      icons: {
        mdiCalendar,
      },
      phDate: themeConfig.placeholder.date,
    };
  },
  watch: {
    valueDate(newValue) {
      // Emit the combined date and time value when either the date or time changes
      this.$emit("update:valueDate", `${newValue} ${this.valueTime}`);
    },
    valueTime(newValue) {
      // Emit the combined date and time value when either the date or time changes
      this.$emit("update:valueDate", `${this.valueDate} ${newValue}`);
    },
  },
};
</script>
