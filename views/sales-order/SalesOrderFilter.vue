<template>
  <div>
    <v-card outlined>
      <v-card-title><span>Filter</span></v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <app-autocomplite-ou-company
              :form-value.sync="form.ouId"
              :ou-type="'salesInvoiceCreate'"
            ></app-autocomplite-ou-company>
          </v-col>
          <v-col cols="12" md="4">
            <app-autocomplite-partner
              :form-value.sync="form.partnerId"
              :partner-type="'salesInvoiceCreate'"
            ></app-autocomplite-partner>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              dense
              hide-details
              :label="docNo"
              v-model="form.docNo"
            ></v-text-field>
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
  </div>
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
    this.$root.$on("appAutocompliteOuCompanySalesInvoiceCreate", (msg) => {
      // this.$root.$emit('appAutocomplitePartner', msg)
      this.form.partnerId = -99;
    });
  },
  methods: {
    refreshData() {
      this.$root.$emit("filterSalesOrderCreate", this.form);
    },
  },
};
</script>
