<template>
  <v-data-table
    v-bind="$attrs"
    v-on="$listeners"
    :headers="headers"
    :items="items"
    dense
    fixed-header
    show-select
  >
    <template v-slot:no-data>
      <div
        :style="{
          height: `250px`,
        }"
        v-show="true"
        class="d-flex flex-column align-center"
      >
        <v-img
          max-height="200"
          max-width="200"
          src="./assets/images/avatars/noData.png"
          alt="No Data Found"
        ></v-img>
        <span class="font-weight-semibold text-truncate text-lg">
          No Data Found
        </span>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import { VDataTable } from "vuetify/lib";

export default {
  extends: VDataTable,
  props: {
    headers: Array,
    items: Array,
  },
};
</script>
