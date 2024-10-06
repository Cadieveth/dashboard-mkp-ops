<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        v-show="
          !formCashBankDisburs &&
          !formCashBankTransfer &&
          !formCashBankTransferWithDeposit
        "
      >
        <my-document-list></my-document-list>
      </v-col>
      <v-col cols="12" v-show="formCashBankDisburs">
        <cash-bank-for-disburs-form></cash-bank-for-disburs-form>
      </v-col>
      <v-col cols="12" v-show="formCashBankTransfer">
        <cash-bank-transfer-form-without-deposit></cash-bank-transfer-form-without-deposit>
      </v-col>
      <v-col cols="12" v-show="formCashBankTransferWithDeposit">
        <cash-bank-transfer-form></cash-bank-transfer-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MyDocumentList from "@/views/my-document/MyDocumentList";
import CashBankForDisbursForm from "@/views/cash-bank-for-disbursement/CashBankForDisbursForm";
import CashBankTransferForm from "@/views/cash-bank-transfer/CashBankTransferForm";
import CashBankTransferFormWithoutDeposit from "@/views/cash-bank-transfer/CashBankTransferFormWithoutDeposit";

export default {
  name: "Parent",
  components: {
    MyDocumentList,
    CashBankForDisbursForm,
    CashBankTransferForm,
    CashBankTransferFormWithoutDeposit,
  },
  data() {
    return {
      formCashBankDisburs: false,
      formCashBankTransfer: false,
      formCashBankTransferWithDeposit: false,
    };
  },
  mounted() {
    this.$root.$on("formCashBankDisburs", (msg) => {
      this.formCashBankDisburs = msg;
    });
    this.$root.$on("formCashBankTransfer2", (msg) => {
      this.formCashBankTransfer = msg;
    });
    this.$root.$on("formCashBankTransfer", (msg) => {
      this.formCashBankTransferWithDeposit = msg;
    });
  },
};
</script>
