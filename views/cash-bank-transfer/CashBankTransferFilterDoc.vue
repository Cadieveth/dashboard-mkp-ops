<template>
  <v-card flat>
    <v-card-title><span></span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" class="pb-0">
          <app-autocomplite-ou
            :form-value.sync="form.ouId"
            :readOnly="false"
          ></app-autocomplite-ou>
        </v-col>
        <v-col cols="12" md="3" class="pb-0">
          <app-input-field-date
            :value-date.sync="form.dateFrom"
            :label-title="startDate"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" class="pb-0">
          <app-input-field-date
            :value-date.sync="form.dateTo"
            :label-title="endDate"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            :label="labelDocNo"
            v-model="form.docNo"
            persistent-placeholder
            placeholder="Insert Document No"
            dense
            class="mb-0"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-4">
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
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import themeConfig from "@themeConfig";
import Form from "vform";
import moment from "moment";
import { mdiMagnify } from "@mdi/js";

export default {
  name: "ChildFilter",
  components: {
    AppAutocompliteOu,
    AppInputFieldDate,
  },
  data() {
    return {
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,

      icons: {
        mdiMagnify,
      },
      form: new Form({
        ouId: -99,
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
    };
  },
  mounted() {},
  methods: {
    sendValueData() {
      this.$root.$emit("filterTransferDoc", this.form);
    },
  },
};
</script>
