<template>
  <v-menu
    v-model="menuStart"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="valueDate"
        :label="labelTitle"
        :append-icon="icons.mdiCalendar"
        :index="index"
        readonly
        :dense="dense"
        hide-details
        v-bind="attrs"
        v-on="on"
        :clearable="clearable"
        persistent-placeholder
        @click:clear="handleClear"
        :placeholder="phDate"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="valueDate"
      :max="maxDate"
      :min="minDate"
      color="primary"
      :readonly="readOnly"
      @change="change"
      @input="(menuStart = false), input, $emit('update:valueDate', $event)"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { mdiCalendar } from "@mdi/js";
import themeConfig from "@themeConfig";

export default {
  name: "ChildDate",
  props: {
    valueDate: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    labelTitle: { type: String, default: "" },
    clearable: { type: Boolean, default: false },
    index: { type: Number, default: 0 },
    dense: { type: Boolean, default: true },
    maxDate: { type: String, default: "" },
    minDate: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    handleClear: { type: Function, default: () => console.log() },
    changeMethod: { type: Function },
    input: { type: Function, default: () => console.log() },
    rules: { type: Array, default: [] },
  },
  data() {
    return {
      menuStart: false,
      icons: {
        mdiCalendar,
      },
      phDate: themeConfig.placeholder.date,
    };
  },
  mounted() {
    console.log(this.changeMethod());
    // handleClear() {
    //   // Handle the clear event
    //   console.log("Input value cleared");
    // },
  },
};
</script>
