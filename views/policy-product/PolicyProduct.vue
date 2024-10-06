<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <policy-product-list></policy-product-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PolicyProductList from "@/views/policy-product/PolicyProductList";

export default {
  name: 'Parent',
  components: {
    PolicyProductList,
  }
}
</script>