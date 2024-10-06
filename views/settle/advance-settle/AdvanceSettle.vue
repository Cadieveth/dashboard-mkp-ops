<template>
  <div>
    <v-col cols="12" class="pb-0">
      <advance-settle-list></advance-settle-list>
    </v-col>
  </div>
</template>

<script>
  import AdvanceSettleList from "@/views/settle/advance-settle/AdvanceSettleList";

  export default {
    name: 'Parent',
    components: {
      AdvanceSettleList
    }
  }
</script>