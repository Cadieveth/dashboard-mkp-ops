<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <outlet-list></outlet-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OutletList from "@/views/outlet/OutletList";
export default {
  name: 'Parent',
  components:{
    OutletList,
  },
}
</script>