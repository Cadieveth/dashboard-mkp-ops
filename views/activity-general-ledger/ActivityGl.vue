<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <activity-gl-list></activity-gl-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import ActivityGlList from "@/views/activity-general-ledger/ActivityGlList";

  export default {
    name: 'Parent',
    components: {
      ActivityGlList,
    }
  }
</script>