<template>
  <v-card flat>
    <v-card-title><span>Filter</span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="mb-0">
          <app-autocomplite-ou-company
            :form-value.sync="filterForm.ouId"
            :ou-type="'invoicingTransactionCreate'"
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="4" class="mb-0">
          <app-autocomplite-partner
            :form-value.sync="filterForm.partnerId"
            :partner-type="'invoicingTransactionCreate'"
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="4" class="mb-0">
          <v-autocomplete
            label="Invoice A/R For Service Fee"
            :items="invoiceList"
            v-model="filterForm.invoiceId"
            item-value="invoiceArId"
            item-text="docNo"
            persistent-placeholder
            placeholder="Select Invoice A/R"
            class="mb-0"
            dense
            hide-details
          ></v-autocomplete>
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
import Form from "vform";
import { mdiMagnify } from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildFilter",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
  },
  data() {
    return {
      invoiceList: [],
      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        invoiceId: -99,
      }),
      icons: {
        mdiMagnify,
      },
    };
  },
  mounted() {
    this.$root.$on(
      "appAutocompliteOuCompanyInvoicingTransactionCreate",
      (msg) => {
        // this.$root.$emit("appAutocomplitePartner", msg);
        this.filterForm.partnerId = -99;
      }
    );
    this.$root.$on("appAutocomplitePartnerSelect", (msg) => {
      this.filterForm.invoiceId = -99;
      this.getInvoiceARList();
    });
    this.$root.$on("filterCreateInvoiceARReset", (msg) => {
      this.filterForm.clear();
      this.filterForm.reset();
      this.invoiceList = [];
      // this.filterForm = msg
    });
  },
  methods: {
    getInvoiceARList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/outstanding-invoice-ar-for-service-fee-list?ouId=${this.filterForm.ouId}&partnerId=${this.filterForm.partnerId}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.invoiceList = response.data.result);
          this.invoiceList = [];
        })
        .catch((e) => {
          console.log(e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    refreshData() {
      this.$root.$emit("filterCreateInvoiceAR", this.filterForm);
    },
  },
};
</script>
