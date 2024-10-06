<template>
  <v-card flat>
    <v-card-title><span></span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-autocomplite-ou-company
            :form-value.sync="form.ouId"
            :ou-type="
              filterType == 'DRAFT'
                ? 'salesInvoiceDraft'
                : filterType == 'INPROGRESS'
                ? 'salesInvoiceInProgress'
                : 'salesInvoiceApproved'
            "
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-autocomplite-partner
            :form-value.sync="form.partnerId"
            :partner-type="
              filterType == 'DRAFT'
                ? 'salesInvoiceDraft'
                : filterType == 'INPROGRESS'
                ? 'salesInvoiceInProgress'
                : 'salesInvoiceApproved'
            "
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <v-text-field
            dense
            hide-details
            :label="docNo"
            persistent-placeholder
            :placeholder="phDocNo"
            v-model="form.docNo"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-input-field-date
            :label-title="startDate"
            :value-date.sync="form.startDate"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-input-field-date
            :label-title="endDate"
            :value-date.sync="form.endDate"
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
  props: {
    filterType: { type: String, default: "" },
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      phDocNo: themeConfig.placeholder.docNo,

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
    // this.$root.$on("appAutocompliteOuCompany", (msg) => {
    //   this.$root.$emit("appAutocomplitePartner", msg);
    //   this.form.partnerId = -99;
    // });
    if (this.filterType == "DRAFT") {
      this.$root.$on("appAutocompliteOuCompanySalesInvoiceDraft", (msg) => {
        this.form.partnerId = -99;
      });
    } else if (this.filterType == "INPROGRESS") {
      this.$root.$on(
        "appAutocompliteOuCompanySalesInvoiceInProgress",
        (msg) => {
          this.form.partnerId = -99;
        }
      );
    } else if (this.filterType == "APPROVED") {
      this.$root.$on("appAutocompliteOuCompanySalesInvoiceApproved", (msg) => {
        this.form.partnerId = -99;
      });
    }
  },
  methods: {
    refreshData() {
      this.$root.$emit("filterSalesInvoiceDoc", this.form);
    },
  },
};
</script>
