<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <data-reconcile-list></data-reconcile-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import DataReconcileList from "@/views/reconcile/DataReconcileList";

  export default {
    name: 'Parent',
    components: {
      DataReconcileList
    },
  }
</script>