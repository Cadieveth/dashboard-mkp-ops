<template>
  <v-card flat>
    <v-card-title><span>Filter</span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="mb-0">
          <app-autocomplite-ou-company
            :form-value.sync="filterForm.ouId"
            :ou-type="'cashbankInPartnerReceiveCreate'"
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="4" class="mb-0">
          <app-autocomplite-cashbank-ou
            :label-text="'Cash/Bank In'"
            :value-bank-ou.sync="filterForm.cashbankId"
            :cashbank-type="'cashbankInPartnerReceiveCreate'"
          ></app-autocomplite-cashbank-ou>
        </v-col>
        <v-col cols="12" md="4" class="mb-0">
          <app-autocomplite-partner
            :form-value.sync="filterForm.partnerId"
            :partner-type="'cashbankInPartnerReceiveCreate'"
          ></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="4" class="pt-2">
          <v-text-field
            dense
            hide-details
            persistent-placeholder
            placeholder="Insert Activity G/L Code/Name"
            label="Activity G/L Code/Name"
            v-model="filterForm.keyword"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-2">
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
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankOu";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import Form from "vform";
import { mdiMagnify } from "@mdi/js";

export default {
  name: "ChildFilterCreate",
  components: {
    AppAutocompliteOuCompany,
    AppAutocompliteCashbankOu,
    AppAutocomplitePartner,
  },
  data() {
    return {
      filterForm: new Form({
        ouId: -99,
        cashbankId: -99,
        bankCode: "",
        accountNo: "",
        accountName: "",
        partnerId: -99,
        keyword: "",
      }),
      icons: {
        mdiMagnify,
      },
    };
  },
  mounted() {
    this.$root.$on(
      "appAutocompliteOuCompanyCashbankInPartnerReceiveCreate",
      (msg) => {
        // this.$root.$emit('appAutocomplitePartner', msg)
        this.filterForm.partnerId = -99;
        this.filterForm.cashbankId = -99;
        this.filterForm.bankCode = "";
        this.filterForm.accountNo = "";
        this.filterForm.accountName = "";
        // this.$root.$emit('appAutocompliteOuCashbank', msg)
      }
    );
    this.$root.$on("appAutocompliteCashbankOu", (msg) => {
      this.getAccountInfo(msg);
    });
  },
  methods: {
    refreshData() {
      this.$root.$emit("cashbankInPartnerFilterCreate", this.filterForm);
    },
    getAccountInfo(msg) {
      this.filterForm.bankCode = msg.bankCode;
      this.filterForm.accountNo = msg.accountNo;
      this.filterForm.accountName = msg.accountName;
    },
  },
};
</script>
