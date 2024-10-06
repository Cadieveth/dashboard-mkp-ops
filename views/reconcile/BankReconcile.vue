<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <bank-reconcile-list></bank-reconcile-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BankReconcileList from "@/views/reconcile/BankReconcileList";

export default {
  name: "Parent",
  components: {
    BankReconcileList,
  },
};
</script>
