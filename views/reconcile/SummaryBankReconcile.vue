<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <summary-bank-reconcile-list></summary-bank-reconcile-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SummaryBankReconcileList from "@/views/reconcile/SummaryBankReconcileList";

  export default {
    name: 'Parent',
    components:{
      SummaryBankReconcileList,
    }
  }
</script>