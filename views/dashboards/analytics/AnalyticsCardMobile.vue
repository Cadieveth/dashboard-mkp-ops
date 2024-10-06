<template>
  <!-- v-scroll.self="onScroll"x -->
  <v-card class="overflow-y-auto" max-height="400">
    <v-banner class="justify-center" color="white" sticky>
      <span class="font-weight-semibold text-xl text--primary me-1">
        Summary by Payment Method
      </span>

      <div class="d-flex align-center">
        <h1 class="text-4xl font-weight-semibold">$24,895</h1>
      </div>

      <h4 class="mt-0 font-weight-medium text-sm">
        <span class="font-weight-semibold text--primary me-1">{{
          dateStart
        }}</span>
        <span> s/d </span>
        <span class="font-weight-semibold text--primary me-1">{{
          dateEnd
        }}</span>
      </h4>
    </v-banner>

    <v-card-text>
      <div
        v-for="(earning, index) in totalEarning"
        :key="earning.avatar"
        :class="`d-flex align-start ${index > 0 ? 'mt-8' : ''}`"
      >
        <v-avatar rounded size="38" color="#5e56690a" class="me-4">
          <v-img contain :src="earning.avatar" height="20"></v-img>
        </v-avatar>

        <div class="d-flex align-center flex-grow-1 flex-wrap">
          <div>
            <h4 class="font-weight-medium">
              {{ earning.title }}
            </h4>
            <span class="text-xs text-no-wrap">{{ earning.subtitle }}</span>
          </div>

          <v-spacer></v-spacer>

          <div class="ms-1">
            <p class="text--primary font-weight-medium mb-1">
              {{ earning.earning }}
            </p>
            <v-progress-linear
              :value="earning.progress"
              :color="earning.color"
            ></v-progress-linear>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiDotsVertical, mdiMenuUp } from "@mdi/js";
import moment from "moment";
import AnalyticsCongratulationJohn from "@/views/dashboards/analytics/AnalyticsCongratulationJohn";

export default {
  setup() {
    const totalEarning = [
      {
        avatar: require("@/assets/images/logos/bank_logo/BCA_logo.png"),
        title: "BCA",
        subtitle: "Vuejs, React & HTML",
        earning: "$24,895.65",
        progress: "85",
        color: "primary",
      },
      {
        avatar: require("@/assets/images/logos/bank_logo/BRI_logo.png"),
        title: "BRI",
        subtitle: "Sketch, Figma & XD",
        earning: "$8,6500.20",
        progress: "65",
        color: "info",
      },
      {
        avatar: require("@/assets/images/logos/bank_logo/MANDIRI_logo.png"),
        title: "Mandiri",
        subtitle: "HTML & angular",
        earning: "$1,2450.80",
        progress: "30",
        color: "secondary",
      },
      {
        avatar: require("@/assets/images/logos/bank_logo/BNI_logo.png"),
        title: "BNI",
        subtitle: "HTML & angular",
        earning: "$1,2450.80",
        progress: "30",
        color: "secondary",
      },
    ];

    return {
      totalEarning,
      icons: { mdiDotsVertical, mdiMenuUp },
      dateStart: "",
      dateEnd: "",
    };
  },
  mounted() {
    this.dateStart = moment(
      AnalyticsCongratulationJohn.data().filterForm.startDate
    ).format("DD MMMM YYYY");
    this.dateEnd = moment(
      AnalyticsCongratulationJohn.data().filterForm.endDate
    ).format("DD MMMM YYYY");
    this.$root.$on("formFilter", (data) => {
      this.dateStart = moment(data.startDate).format("DD MMMM YYYY");
      this.dateEnd = moment(data.endDate).format("DD MMMM YYYY");
    });
  },
};
</script>
