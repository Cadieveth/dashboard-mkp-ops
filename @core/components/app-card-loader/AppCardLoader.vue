<template>
  <v-dialog v-model="openLoader" persistent width="400">
    <v-card color="primary" dark>
      <v-card-text class="pt-3" :align="'center'">
        {{ textLoader }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import themeConfig from "@themeConfig";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppCardLoader",
  computed: {
    ...mapGetters(["getLoadingText"]),
    loadingText() {
      return this.getLoadingText;
    },
  },
  props: {
    openLoader: { type: Boolean, default: false },
  },
  data() {
    return {
      textLoader: themeConfig.placeholder.remarkLoader,
    };
  },
};
</script>
