<template>
  <v-card v-if="!loading" outlined>
    <div class="d-flex justify-space-between">
      <div>
        <v-card-title class="align-start">
          <v-avatar @click="alert()" size="50" rounded class="elevation-3">
            <v-icon size="26" :color="color" class="rounded-0">
              {{ icon }}
            </v-icon>
          </v-avatar>
        </v-card-title>
      </div>
      <v-card-text class="text-no-wrap text--primary">
        <p class="font-weight-semibold text-sm text-end mb-0">
          {{ statTitle }}
          <!-- <span>
            <v-btn class="mt-n1" x-small icon>
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </span> -->
        </p>

        <p class="font-weight-semibold text-sm text-end mb-0 mt-2">
          <span
            :class="color + '--text'"
            class="font-weight-semibold text-xl me-1 mb-0"
            >{{ statistics }}</span
          >
        </p>
        <p class="text-xs text-end text--secondary mb-0">
          {{ subtitle }}
        </p>
      </v-card-text>
    </div>
  </v-card>
  <v-card v-else-if="loading" outlined>
    <div class="d-flex justify-center">
      <div>
        <v-card-title class="align-center">
          <v-avatar
            @click="alert()"
            size="50"
            rounded
            class="elevation-0 spinner-border"
          >
            <v-icon size="54" :color="color" class="spin"> mdi-loading </v-icon>
          </v-avatar>
        </v-card-title>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mdiDotsVertical } from "@mdi/js";

export default {
  props: {
    statTitle: { type: String, default: "" },
    icon: { type: String, default: "" },
    color: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    statistics: { type: String, default: "" },
    change: { type: String, default: "" },
    loading: { type: Boolean, default: false },
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
      mdiDotsVertical,
      checkChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.percentage {
  top: -8px;
  position: relative;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
