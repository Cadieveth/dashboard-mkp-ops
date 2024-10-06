<template>
  <div>
    <v-row>
      <v-col cols="12" v-show="!formCashBankDisburs">
        <cash-bank-for-disburs-list></cash-bank-for-disburs-list>
      </v-col>
      <v-col cols="12" v-show="formCashBankDisburs">
        <cash-bank-for-disburs-form></cash-bank-for-disburs-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CashBankForDisbursList from "@/views/cash-bank-for-disbursement/CashBankForDisbursList";
import CashBankForDisbursForm from "@/views/cash-bank-for-disbursement/CashBankForDisbursForm";

export default {
  name: "parent",
  components: {
    CashBankForDisbursList,
    CashBankForDisbursForm,
  },
  data() {
    return {
      formCashBankDisburs: false,
    };
  },
  mounted() {
    this.$root.$on("formCashBankDisburs", (msg) => {
      this.formCashBankDisburs = msg;
    });
  },
};
</script>
