<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <disbursement-mutation-list></disbursement-mutation-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DisbursementMutationList from "./DisbursementMutationList.vue";

export default {
  name: "DisbursementMutationParent",
  components: {
    DisbursementMutationList,
  },
  data() {
    return {};
  },
};
</script>
