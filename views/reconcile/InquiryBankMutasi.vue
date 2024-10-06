<template>
  <div>
    <v-row>
      <v-col cols="12">
        <inquiry-bank-mutasi-list></inquiry-bank-mutasi-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import InquiryBankMutasiList from "@/views/reconcile/InquiryBankMutasiList";

  export  default {
    name: 'Parent',
    components:{
      InquiryBankMutasiList,
    },
  }
</script>