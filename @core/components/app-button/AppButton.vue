<template>
  <v-btn
    class="white--text"
    v-show="vShow"
    :small="size === 'small'"
    :x-small="size === 'x-small'"
    dark
    :icon="icon"
    :color="color"
    @click="click"
  >
    <v-icon dark :left="!icon">
      {{ iconButton }}
    </v-icon>
    {{ text }}
  </v-btn>
</template>

<script>
import { mdiMagnify } from "@mdi/js";

export default {
  props: {
    click: { type: Function, default: () => {} },
    text: { type: String, default: "" },
    color: { type: String, default: "primary" },
    iconButton: { type: String, default: mdiMagnify }, // Default to mdiMagnify icon
    vShow: { type: Boolean, default: true },
    icon: { type: Boolean, default: false },
    size: { type: String, default: "small" },
  },
};
</script>
