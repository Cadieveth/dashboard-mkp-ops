<template>
  <v-snackbar
    right
    top
    v-model="openSnackbar"
    :timeout="timeout"
    :color="color"
    outlined
    text
  >
    {{ text }}
  </v-snackbar>
</template>

<script>
import themeConfig from "@themeConfig";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppCardLoader",
  props: {
    openSnackbar: { type: Boolean, default: false },
    text: { type: String, default: "Notification" },
    color: { type: String, default: "" },
    timeout: { type: Number, default: 2000 },
  },
  data() {
    return {
      textLoader: themeConfig.placeholder.remarkLoader,
    };
  },
};
</script>
