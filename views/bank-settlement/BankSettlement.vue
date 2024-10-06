<template>
  <v-row>
    <v-col cols="12" md="12">
      <bank-settlement-list></bank-settlement-list>
    </v-col>
  </v-row>
</template>

<script>
import BankSettlementList from "@/views/bank-settlement/BankSettlementList.vue";
export default {
  name: "Parent",
  components: {
    BankSettlementList,
  },
};
</script>
