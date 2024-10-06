<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <product-tax-list></product-tax-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProductTaxList from "@/views/product-tax/ProductTaxList";
export default {
  name: 'Parent',
  components: {
    ProductTaxList
  }
}
</script>