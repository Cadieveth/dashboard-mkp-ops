<template>
  <div>
    <v-row>
      <v-col cols="12">
        <product-list></product-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProductList from "@/views/product/ProductList";
export default {
  name: 'Parent',
  components: {
    ProductList
  },
}
</script>