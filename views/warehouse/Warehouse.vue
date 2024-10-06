<template>
  <div>
    <v-row>
      <v-col cols="12">
        <warehouse-list></warehouse-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WarehouseList from "@/views/warehouse/WarehouseList";

export default {
  name: "Parent",
  components: {
    WarehouseList,
  },
};
</script>
