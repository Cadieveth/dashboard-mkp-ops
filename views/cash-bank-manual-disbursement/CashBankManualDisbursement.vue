<template>
  <v-row>
    <v-col cols="12" v-show="!formManualDisburs">
      <cash-bank-manual-disburs-list></cash-bank-manual-disburs-list>
    </v-col>
    <v-col cols="12" v-show="formManualDisburs">
      <cash-bank-manual-disburs-form></cash-bank-manual-disburs-form>
    </v-col>
  </v-row>
</template>

<script>
import CashBankManualDisbursList from "@/views/cash-bank-manual-disbursement/CashBankManualDisbursList";
import CashBankManualDisbursForm from "@/views/cash-bank-manual-disbursement/CashBankManualDisbursForm";

export default {
  name: "parent",
  components: {
    CashBankManualDisbursList,
    CashBankManualDisbursForm,
  },
  data() {
    return {
      formManualDisburs: false,
    };
  },
  mounted() {
    this.$root.$on("formCashBankManualDisburs", (msg) => {
      this.formManualDisburs = msg;
    });
  },
};
</script>
