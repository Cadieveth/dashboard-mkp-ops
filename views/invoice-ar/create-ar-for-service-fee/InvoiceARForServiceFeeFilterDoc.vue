<template>
  <v-card flat>
    <v-card-title><span>Filter</span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" class="mb-0">
          <app-autocomplite-ou-company
            :form-value.sync="filterForm.ouId"
            :ou-type="
              filterType == 'DRAFT'
                ? 'invoicingTransactionDraft'
                : filterType == 'INPROGRESS'
                ? 'invoicingTransactionInProgress'
                : 'invoicingTransactionApproved'
            "
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="3" class="mb-0">
          <app-autocomplite-partner
            :form-value.sync="filterForm.partnerId"
            :partner-type="
              filterType == 'DRAFT'
                ? 'invoicingTransactionDraft'
                : filterType == 'INPROGRESS'
                ? 'invoicingTransactionInProgress'
                : 'invoicingTransactionApproved'
            "
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="3" class="mb-0">
          <app-input-field-date
            :label-title="dateFrom"
            :value-date.sync="filterForm.dateFrom"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" class="mb-0">
          <app-input-field-date
            :label-title="dateTo"
            :value-date.sync="filterForm.dateTo"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="6" class="mb-0">
          <v-text-field
            dense
            hide-details
            :label="docNo"
            v-model="filterForm.docNo"
            placeholder="Insert Document No"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-2">
      <v-btn small dark color="primary" @click="refreshData()">
        <v-icon left dark>{{ icons.mdiMagnify }}</v-icon>
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
import { mdiMagnify } from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";

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
      dateFrom: themeConfig.labeling.startDate,
      dateTo: themeConfig.labeling.endDate,

      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
      },
    };
  },
  mounted() {
    // this.$root.$on("appAutocompliteOuCompany", (msg) => {
    //   this.$root.$emit("appAutocomplitePartner", msg);
    //   this.filterForm.partnerId = -99;
    // });
    if (this.filterType == "DRAFT") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionDraft",
        (msg) => {
          this.filterForm.partnerId = -99;
        }
      );
    } else if (this.filterType == "INPROGRESS") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionInProgress",
        (msg) => {
          this.filterForm.partnerId = -99;
        }
      );
    } else if (this.filterType == "APPROVED") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionApproved",
        (msg) => {
          this.filterForm.partnerId = -99;
        }
      );
    }
    this.$root.$on("filterDocInvoiceARReset", (msg) => {
      this.filterForm = msg;
    });
  },
  methods: {
    refreshData() {
      this.$root.$emit("filterDocInvoiceAR", this.filterForm);
    },
  },
};
</script>
