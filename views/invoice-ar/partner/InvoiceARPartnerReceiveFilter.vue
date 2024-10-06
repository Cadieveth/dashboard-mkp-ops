<template>
  <v-card flat>
    <v-card-title><span></span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="pb-0">
          <app-autocomplite-ou-company
            :form-value.sync="form.ouId"
            :ou-type="'conversionCashBankInPartnerReceiveCreate'"
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <app-autocomplite-partner
            :form-value.sync="form.partnerId"
            :partner-type="'conversionCashBankInPartnerReceiveCreate'"
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <v-text-field
            dense
            hide-details
            :label="docNo"
            v-model="form.docNo"
            persistent-placeholder
            placeholder="Insert Document No"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="mt-2">
          <app-input-field-date
            :label-title="startDate"
            :value-date.sync="form.startDate"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="4" class="mt-2">
          <app-input-field-date
            :label-title="endDate"
            :value-date.sync="form.endDate"
          ></app-input-field-date>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
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
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import Form from "vform";
import moment from "moment";
import themeConfig from "@themeConfig";
import { mdiMagnify } from "@mdi/js";

export default {
  name: "ChildFilter",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,

      icons: {
        mdiMagnify,
      },
      form: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
    };
  },
  mounted() {
    this.$root.$on(
      "appAutocompliteOuCompanyConversionCashBankInPartnerReceive",
      (msg) => {
        // this.$root.$emit('appAutocomplitePartner', msg)
        this.form.partnerId = -99;
      }
    );
  },
  methods: {
    refreshData() {
      this.$root.$emit("filterInvoiceARPartnerReceive", this.form);
    },
  },
};
</script>
