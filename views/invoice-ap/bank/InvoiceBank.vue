<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <invoice-bank-list></invoice-bank-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import InvoiceBankList from "@/views/invoice-ap/bank/InvoiceBankList";

  export default {
    name: 'Parent',
    components: {
      InvoiceBankList,
    }
  }
</script>