<template>
  <div>
    <v-row>
      <v-col cols="12">
        <payment-list></payment-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PaymentList from "@/views/collector/payment/PaymentList";
export default {
  name:'Parent',
  components:{
    PaymentList
  },
}
</script>