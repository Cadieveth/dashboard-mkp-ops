<template>
  <v-card elevation="0">
    <v-card-title><span>Filter</span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
          <app-autocomplite-ou-bu-main
            :form-value.sync="filterForm.ouId"
            :ou-type="'generateOutstandingForecast'"
          ></app-autocomplite-ou-bu-main>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
          <app-autocomplite-partner
            :form-value.sync="filterForm.partnerId"
            :partner-type="'generateOutstandingForecast'"
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
          <app-input-field-date
            :label-title="startDate"
            :value-date.sync="filterForm.startDate"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
          <app-input-field-date
            :label-title="endDate"
            :value-date.sync="filterForm.endDate"
          ></app-input-field-date>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-4">
      <v-btn small dark color="primary" @click="refreshData()">
        <v-icon dark left>
          {{ icons.mdiMagnify }}
        </v-icon>
        Filter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import Form from "vform";
import moment from "moment";
import themeConfig from "@themeConfig";
import { mdiFileDocumentOutline, mdiMagnify } from "@mdi/js";
import axios from "@axios";
import router from "@/router";

export default {
  name: "ChildFilter",
  components: {
    AppAutocompliteOuBuMain,
    AppAutocomplitePartner,
    AppInputFieldDate,
  },
  data() {
    return {
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,

      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
        mdiFileDocumentOutline,
      },
    };
  },
  mounted() {
    this.$root.$on(
      "appAutocompliteOuBuMainGenerateOutstandingForecast",
      (msg) => {
        // this.$root.$emit("appAutocomplitePartner", msg);
        this.filterForm.partnerId = -99;
      }
    );
  },
  methods: {
    refreshData() {
      this.$root.$emit("generateOutstandingARForServiceFee", this.filterForm);
    },
  },
};
</script>
