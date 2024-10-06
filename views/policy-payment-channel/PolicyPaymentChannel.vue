<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <policy-payment-channel-list></policy-payment-channel-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PolicyPaymentChannelList from "@/views/policy-payment-channel/PolicyPaymentChannelList";

export default {
  name: 'Parent',
  components: {
    PolicyPaymentChannelList,
  }
}
</script>