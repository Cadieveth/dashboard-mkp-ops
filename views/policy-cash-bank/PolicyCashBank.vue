<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <policy-cash-bank-list></policy-cash-bank-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import PolicyCashBankList from "@/views/policy-cash-bank/PolicyCashBankList";

  export default {
    name: 'Parent',
    components: {
      PolicyCashBankList,
    }
  }
</script>