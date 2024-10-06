<template>
  <v-card elevation="0">
    <v-card-title><span></span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-autocomplite-ou-company
            :form-value.sync="filterCreateForm.ouId"
            :ou-type="'cashbankDisbursementCreate'"
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-autocomplite-partner
            :form-value.sync="filterCreateForm.partnerId"
            partner-type="cashbankDisbursementCreate"
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-autocomplite-partner-bank
            :form-value.sync="filterCreateForm.partnerBank"
            partner-bank-type="cashbankDisbursementCreate"
          >
          </app-autocomplite-partner-bank>
        </v-col>
        <v-col cols="12" md="4" class="pb-0 mt-2">
          <app-autocomplite-product-disbursement
            :partner-id="filterCreateForm.partnerId"
            :form-value.sync="filterCreateForm.productIdentifier"
          ></app-autocomplite-product-disbursement>
        </v-col>
        <!-- <v-col cols="12" md="3" class="pb-0 mt-2">
          <app-autocomplite-ou-branch
            :form-value.sync="filterCreateForm.ouBranchId"
            ou-branch-type="cashbankDisbursementCreate"
          >
          </app-autocomplite-ou-branch>
        </v-col> -->
        <!-- <v-col cols="12" md="6" class="pb-0 mt-2">
          <app-autocomplite-ou-subbranch-partner
            :form-value.sync="filterCreateForm.ouSubBranchId"
            ou-sub-branch-type="cashbankDisbursementCreate"
            :multiple="true"
          >
          </app-autocomplite-ou-subbranch-partner>
        </v-col> -->
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-4">
      <v-btn small dark color="primary" @click="refreshInvoiceList()">
        <v-icon dark left>
          {{ icons.mdiMagnify }}
        </v-icon>
        Look Up
      </v-btn>
      <v-btn
        v-show="false"
        small
        dark
        color="info"
        @click="checkPartnerDisbursement()"
      >
        <v-icon dark left>
          {{ icons.mdiMagnify }}
        </v-icon>
        Disbursement Check
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppAutocompliteOuBranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuBranch.vue";
import AppAutocompliteOuSubbranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch.vue";
import AppAutocomplitePartnerBank from "@/@core/components/app-autocomplite-ou/AppAutocomplitePartnerBank.vue";
import AppAutocompliteOuSubbranchPartner from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranchPartner.vue";
import AppAutocompliteProductDisbursement from "@/@core/components/app-autocomplite-ou/AppAutocompliteProductDisbursement.vue";
import { mdiMagnify } from "@mdi/js";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";

export default {
  name: "ChildFilterCreate",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppAutocomplitePartnerBank,
    AppAutocompliteOuSubbranchPartner,
    AppAutocompliteProductDisbursement,
  },
  data() {
    return {
      icons: {
        mdiMagnify,
      },
      filterCreateForm: new Form({
        ouId: -99,
        partnerId: -99,
        ouBranchId: -99,
        ouSubBranchId: [],
        partnerBank: -99,
        productIdentifier: "",
      }),
    };
  },
  mounted() {
    this.$root.$on("disbursementProductAvaiable", (msg) => {
      console.log("disbursementProductAvaiable", msg);
      if (msg.length === 0) {
        this.filterCreateForm.productIdentifier = "";
      }
    });
    this.$root.$on("appAutocompliteOuCompany", (msg) => {
      this.$root.$emit("appAutocomplitePartner", msg);
      if (sessionStorage.getItem("disbursementCreateForm") !== null) {
      } else {
        this.filterCreateForm.partnerId = -99;
      }
    });
    this.$root.$on(
      "appAutocomplitePartnerCashbankDisbursementCreate",
      (msg) => {
        this.filterCreateForm.ouSubBranchId = [];
      }
    );
    this.$root.$on("formCashBankDisbursReturn", (msg) => {
      if (sessionStorage.getItem("disbursementCreateForm") === null) {
        this.filterCreateForm.clear();
        this.filterCreateForm.reset();
      }
    });
  },
  methods: {
    refreshInvoiceList() {
      this.$root.$emit("filterDisbursementCreate", this.filterCreateForm);
    },
    checkPartnerDisbursement() {
      this.$root.$emit("filterDisbursementInfo", true);
    },
  },
};
</script>
