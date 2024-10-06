<template>
  <div>
    <v-row>
      <v-col cols="12">
        <uom-list></uom-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UomList from "@/views/uom/UomList";

export default {
  name: "Parent",
  components: {
    UomList,
  },
};
</script>
