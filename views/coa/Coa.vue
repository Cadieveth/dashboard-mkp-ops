<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <coa-list></coa-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import CoaList from "@/views/coa/CoaList";

  export default {
    name: 'Parent',
    components: {
      CoaList,
    }
  }
</script>