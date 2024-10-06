<template>
  <v-row>
    <v-col cols="12" md="12">
      <cash-bank-list></cash-bank-list>
    </v-col>
  </v-row>
</template>

<script>
import CashBankList from "@/views/cash-bank/CashBankList.vue";
export default {
  name: "Parent",
  components: {
    CashBankList,
  },
};
</script>
