<template>
  <div>
    <v-snackbar
      top
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      outlined
      text
    >
      {{ text }}
    </v-snackbar>
    <v-card flat>
      <v-card-title>
        <span></span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" sm="6" class="pb-0">
            <app-autocomplite-ou-company
              :form-value.sync="form.ouId"
              :ou-type="'cashbankTransferCreate'"
            ></app-autocomplite-ou-company>
          </v-col>
          <!-- <v-col cols="12" md="3" sm="6" class="pb-0">
            <app-autocomplite-ou-branch
              :form-value.sync="form.ouBranchId"
              :company-first="'Y'"
              :ou-branch-type="'cashbankTransferCreate'"
            ></app-autocomplite-ou-branch>
          </v-col>
          <v-col cols="12" md="3" sm="6" class="pb-0">
            <app-autocomplite-cashbank-user
              :value-bank-ou.sync="form.cashbankFromId"
              :label-text="'Source Bank'"
            ></app-autocomplite-cashbank-user>
          </v-col> -->
          <v-col cols="12" md="6" sm="6" class="pb-0">
            <app-autocomplite-cashbank-user
              :value-bank-ou.sync="form.cashbankToId"
              :label-text="'Beneficiary Bank'"
              @change="sendValueDataBank()"
            ></app-autocomplite-cashbank-user>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-4 mb-n10">
        <v-btn class="" small color="primary" dark @click="sendValueData()">
          <v-icon dark left>{{ icons.mdiMagnify }}</v-icon>
          Look Up Deposit
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppAutocompliteCashbank from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank";
import AppAutocompliteCashbankUser from "@/@core/components/app-autocomplite-ou/AppAutocompliteCashbankUser.vue";
import { mdiMagnify } from "@mdi/js";
import Form from "vform";
import themeConfig from "@themeConfig";

export default {
  name: "ChildFilterCreate",
  components: {
    AppAutocompliteOuCompany,
    AppAutocompliteOuBranch,
    AppAutocompliteCashbank,
    AppAutocompliteCashbankUser,
  },
  data() {
    return {
      cashBank: themeConfig.labeling.cashBank,
      form: new Form({
        ouId: -99,
        ouBranchId: -99,
        cashbankFromId: -99,
        cashbankToId: -99,
        bankCodeTo: "",
        accountNoTo: "",
        accountNameTo: "",
      }),
      icons: {
        mdiMagnify,
      },

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteCashbankInfoAccount", (msg) => {
      this.getAccountInfo(msg);
    });
    this.$root.$on("appAutocompliteOuCompanyCashbankTransferCreate", (msg) => {
      this.form.ouBranchId = -99;
    });
    this.$root.$on("formCashBankTransferReturn", (msg) => {
      this.form.clear();
      this.form.reset();
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    sendValueData() {
      if (this.form.cashbankToId == -99) {
        this.notif("error", "Failed", "Please Select Beneficiary Bank");
      } else {
        this.$root.$emit("filterTransferCreate", this.form);
      }
    },
    sendValueDataBank() {
      this.$root.$emit("filterTransferCreateBeneficiaryBank", this.form);
    },
    getAccountInfo(msg) {
      if (msg.type == "Source Bank") {
        this.form.bankCode = msg.bankCode;
        this.form.accountNo = msg.accountNo;
        this.form.accountName = msg.accountName;
      } else if (msg.type == "Beneficiary Bank") {
        this.form.bankCodeTo = msg.bankCode;
        this.form.accountNoTo = msg.accountNo;
        this.form.accountNameTo = msg.accountName;
      }
    },
  },
};
</script>
