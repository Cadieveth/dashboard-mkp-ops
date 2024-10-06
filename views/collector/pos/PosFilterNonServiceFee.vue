<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <app-autocomplite-ou-branch
            :form-value.sync="filterForm.ouBranchId"
            ou-branch-type="ticketingHistoryNonSF"
          >
          </app-autocomplite-ou-branch>
        </v-col>
        <v-col cols="12" md="6">
          <app-autocomplite-ou-subbranch
            :form-value.sync="filterForm.ouSubBranchId"
            ou-sub-branch-type="ticketingHistoryNonSF"
          >
          </app-autocomplite-ou-subbranch>
        </v-col>
        <v-col cols="12" md="6">
          <app-input-field-date
            :value-date.sync="filterForm.dateFrom"
            :label-title="startDate"
          >
          </app-input-field-date>
        </v-col>
        <v-col cols="12" md="6">
          <app-input-field-date
            :value-date.sync="filterForm.dateTo"
            :label-title="endDate"
          >
          </app-input-field-date>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-6">
      <v-btn color="primary" small dark @click="sendValueData()">
        <v-icon dark left>
          {{ icons.mdiMagnify }}
        </v-icon>
        Filter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate.vue";
import AppAutocompliteOuBranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuBranch.vue";
import AppAutocompliteOuSubbranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch.vue";
import themeConfig from "@themeConfig";
import { mdiMagnify } from "@mdi/js";
import { Form } from "vform";
import moment from "moment";

export default {
  name: "ChildFilterPosNonSF",
  components: {
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppInputFieldDate,
  },
  data() {
    return {
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,

      filterForm: new Form({
        ouBranchId: -99,
        ouSubBranchId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
      },
    };
  },
  methods: {
    sendValueData() {
      this.$root.$emit("posFilterNonServiceFee", this.filterForm);
    },
  },
};
</script>
