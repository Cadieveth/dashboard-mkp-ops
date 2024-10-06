<template>
  <div>
    <v-row>
      <v-col cols="12">
        <pos-list></pos-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PosList from "@/views/collector/pos/PosList";
export default {
  name:'Parent',
  components:{
    PosList
  },
}
</script>