<template>
  <v-menu
    v-model="menuOpen"
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
        @click:clear="handleClear"
        :placeholder="placeholder"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="valueDate"
      :max="maxDate"
      :min="minDate"
      color="primary"
      :readonly="readOnly"
      v-on:change="change"
      @input="
        (menuOpen = false),
          $emit('update:valueDate', $event),
          $root.$emit('bankSettlement', index),
          $root.$emit('manualUploadTransfer', $event)
      "
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { mdiCalendar } from "@mdi/js";
import themeConfig from "@themeConfig";
import moment from "moment";

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
    placeholder: { type: String, default: themeConfig.placeholder.date },
    handleClear: { type: Function, default: () => console.log() },
    change: { type: Function, default: () => console.log() },
  },
  data() {
    return {
      menuOpen: false,
      icons: {
        mdiCalendar,
      },
      phDate: themeConfig.placeholder.date,
    };
  },

  methods: {},
};
</script>
