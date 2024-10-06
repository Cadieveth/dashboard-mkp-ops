<template>
  <v-card outlined class="">
    <v-card-title class="align-start ml-n6">
      <!-- :class="`${color}--text`" -->
      <p class="font-weight-semibold text-sm mb-1" :class="`${color}--text`">
        {{ statTitle }}
      </p>
      <v-spacer></v-spacer>

      <v-btn small icon class="me-n3 mt-n1" @click="sendValue(statTitle)">
        <v-icon>
          {{ mdiRefresh }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="text-no-wrap text--primary mt-n4 ml-n6">
      <div class="d-flex align-end flex-wrap">
        <span
          class="font-weight-semibold text-2xl me-1 mb-0"
          :class="`${color}--text`"
          >{{ statistics }}</span
        >
        <span
          class="percentage text-xs mb-0"
          :class="checkChange(change) ? 'success--text' : 'error--text'"
        >
          {{ change }}</span
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiRefresh } from "@mdi/js";

export default {
  props: {
    statTitle: { type: String, default: "" },
    icon: { type: String, default: "" },
    color: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    statistics: { type: String, default: "" },
    change: { type: String, default: "" },
  },
  setup() {
    const checkChange = (value) => {
      const firstChar = value.charAt(0);
      if (firstChar === "+") {
        return true;
      }

      return false;
    };

    return {
      mdiRefresh,
      checkChange,
    };
  },
  methods: {
    sendValue(str) {
      this.$root.$emit("statisticsSummaryRefresh", str);
    },
  },
};
</script>

<style lang="scss" scoped>
.percentage {
  top: -8px;
  position: relative;
}
</style>
