<template>
  <div>
    <v-row>
      <v-col cols="12">
        <summary-reconcile-list></summary-reconcile-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SummaryReconcileList from "@/views/reconcile/SummaryReconcileList";

  export default {
    name: 'Parent',
    components: {
      SummaryReconcileList
    },
  }
</script>