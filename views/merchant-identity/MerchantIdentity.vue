<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <merchant-identity-list></merchant-identity-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MerchantIdentityList from "@/views/merchant-identity/MerchantIdentityList";

export default {
  name: 'Parent',
  components: {
    MerchantIdentityList
  },
}
</script>