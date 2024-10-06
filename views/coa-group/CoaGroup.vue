<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <coa-group-list></coa-group-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import CoaGroupList from "@/views/coa-group/CoaGroupList";

  export default {
    name: 'Parent',
    components: {
      CoaGroupList
    },
  }
</script>