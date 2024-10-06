<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0" v-show="!formCashBankInPartnerReceive">
        <cash-bank-in-partner-receive-list></cash-bank-in-partner-receive-list>
      </v-col>
      <v-col cols="12" class="mb-0" v-show="formCashBankInPartnerReceive">
        <cash-bank-in-partner-receive-form></cash-bank-in-partner-receive-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CashBankInPartnerReceiveList from "@/views/cash-bank-in-partner-receive/CashBankInPartnerReceiveList";
import CashBankInPartnerReceiveForm from "@/views/cash-bank-in-partner-receive/CashBankInPartnerReceiveForm";

export default {
  name: "Parent",
  components: {
    CashBankInPartnerReceiveList,
    CashBankInPartnerReceiveForm,
  },
  data() {
    return {
      formCashBankInPartnerReceive: false,
    };
  },
  mounted() {
    this.$root.$on("cashbankInPartnerReceive", (msg) => {
      this.formCashBankInPartnerReceive = msg;
    });
  },
};
</script>
