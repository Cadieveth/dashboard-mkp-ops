<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        v-show="!formCashBankTransfer && !formCashBankTransferWithoutDeposit"
      >
        <cash-bank-transfer-list></cash-bank-transfer-list>
      </v-col>
      <v-col cols="12" v-show="formCashBankTransfer">
        <cash-bank-transfer-form></cash-bank-transfer-form>
      </v-col>
      <v-col cols="12" v-show="formCashBankTransferWithoutDeposit">
        <cash-bank-transfer-form-without-deposit></cash-bank-transfer-form-without-deposit>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CashBankTransferList from "@/views/cash-bank-transfer/CashbankTransferList";
import CashBankTransferForm from "@/views/cash-bank-transfer/CashBankTransferForm";
import CashBankTransferFormWithoutDeposit from "@/views/cash-bank-transfer/CashBankTransferFormWithoutDeposit";
export default {
  name: "Parent",
  components: {
    CashBankTransferList,
    CashBankTransferForm,
    CashBankTransferFormWithoutDeposit,
  },
  data() {
    return {
      formCashBankTransfer: false,
      formCashBankTransferWithoutDeposit: false,
    };
  },
  mounted() {
    this.$root.$on("formCashBankTransfer", (msg) => {
      this.formCashBankTransfer = msg;
    });
    this.$root.$on("formCashBankTransfer2", (msg) => {
      this.formCashBankTransferWithoutDeposit = msg;
    });
  },
};
</script>
